import * as FileSystem from 'expo-file-system/legacy'
import * as SecureStore from 'expo-secure-store'
import { fromByteArray, toByteArray } from 'base64-js'
import { gcm } from '@noble/ciphers/aes.js'

import { authenticatedRequest } from './api'

const DEVICE_UUID_KEY = 'congolibs.device-uuid'
const LICENSE_INDEX_KEY = 'congolibs.drm-license-index'
const LICENSE_KEY_PREFIX = 'congolibs.drm-license.'
const ENCRYPTED_DIRECTORY = `${FileSystem.cacheDirectory}drm-encrypted/`
const READER_DIRECTORY = `${FileSystem.cacheDirectory}drm-reader/`

async function ensureDirectory(directory) {
  const info = await FileSystem.getInfoAsync(directory)
  if (!info.exists) await FileSystem.makeDirectoryAsync(directory, { intermediates: true })
}

export async function getDeviceUuid() {
  let deviceUuid = await SecureStore.getItemAsync(DEVICE_UUID_KEY)
  if (!deviceUuid) {
    const Crypto = await import('expo-crypto')
    deviceUuid = Crypto.randomUUID()
    await SecureStore.setItemAsync(DEVICE_UUID_KEY, deviceUuid)
  }
  return deviceUuid
}

async function getLicenseIndex() {
  const value = await SecureStore.getItemAsync(LICENSE_INDEX_KEY)
  if (!value) return []
  const parsed = JSON.parse(value)
  if (!Array.isArray(parsed) || parsed.some((id) => typeof id !== 'string')) {
    throw new Error('Les téléchargements sécurisés ne peuvent pas être lus.')
  }
  return parsed
}

async function saveLicenseIndex(ids) {
  await SecureStore.setItemAsync(LICENSE_INDEX_KEY, JSON.stringify([...new Set(ids)]))
}

export async function readStoredLicense(documentId) {
  const value = await SecureStore.getItemAsync(`${LICENSE_KEY_PREFIX}${documentId}`)
  if (!value) return null
  return JSON.parse(value)
}

export async function saveEncryptedDownload(document, license, encryptedBytes, deviceUuid) {
  await ensureDirectory(ENCRYPTED_DIRECTORY)
  const fileUri = `${ENCRYPTED_DIRECTORY}${document.id}.pdf.enc`
  const record = {
    document_id: document.id,
    title: document.nom,
    device_uuid: deviceUuid,
    license_id: license.license_id,
    content_key: license.content_key,
    expires_at: license.expires_at,
    last_server_time: license.server_time,
    file_uri: fileUri,
  }
  try {
    await FileSystem.writeAsStringAsync(fileUri, fromByteArray(encryptedBytes), {
      encoding: FileSystem.EncodingType.Base64,
    })
    await SecureStore.setItemAsync(`${LICENSE_KEY_PREFIX}${document.id}`, JSON.stringify(record))
    await saveLicenseIndex([...(await getLicenseIndex()), document.id])
  } catch (error) {
    await SecureStore.deleteItemAsync(`${LICENSE_KEY_PREFIX}${document.id}`)
    await FileSystem.deleteAsync(fileUri, { idempotent: true })
    throw error
  }
}

export async function listOfflineDownloads() {
  const ids = await getLicenseIndex()
  const result = []
  for (const id of ids) {
    const record = await readStoredLicense(id)
    if (!record) {
      await saveLicenseIndex(ids.filter((storedId) => storedId !== id))
      continue
    }
    const file = await FileSystem.getInfoAsync(record.file_uri)
    if (file.exists) {
      result.push(record)
    } else {
      await SecureStore.deleteItemAsync(`${LICENSE_KEY_PREFIX}${id}`)
      await saveLicenseIndex(ids.filter((storedId) => storedId !== id))
    }
  }
  return result
}

export async function removeOfflineDownload(documentId) {
  const record = await readStoredLicense(documentId)
  if (record?.file_uri) {
    await FileSystem.deleteAsync(record.file_uri, { idempotent: true })
  }
  await SecureStore.deleteItemAsync(`${LICENSE_KEY_PREFIX}${documentId}`)
  await saveLicenseIndex((await getLicenseIndex()).filter((id) => id !== documentId))
}

export async function removeExpiredDownloads() {
  const now = Date.now()
  for (const record of await listOfflineDownloads()) {
    const expiresAt = Date.parse(record.expires_at)
    if (!Number.isFinite(expiresAt) || now >= expiresAt) {
      await removeOfflineDownload(record.document_id)
    }
  }
  await removeTemporaryReaderFiles()
}

export async function prepareOfflinePdf(documentId) {
  const record = await readStoredLicense(documentId)
  if (!record) throw new Error('Aucun téléchargement hors ligne n’est disponible.')

  const now = Date.now()
  const lastServerTime = Date.parse(record.last_server_time)
  const expiresAt = Date.parse(record.expires_at)
  if (!Number.isFinite(lastServerTime) || now < lastServerTime) {
    throw new Error('L’horloge de cet appareil a reculé. Connectez-vous pour vérifier la licence.')
  }
  if (!Number.isFinite(expiresAt)) {
    await removeOfflineDownload(documentId)
    throw new Error('La date d’expiration de cette licence est invalide.')
  }
  if (now >= expiresAt) {
    await removeOfflineDownload(documentId)
    throw new Error('Cette licence hors ligne a expiré. Connectez-vous pour la renouveler.')
  }

  const encrypted = toByteArray(
    await FileSystem.readAsStringAsync(record.file_uri, {
      encoding: FileSystem.EncodingType.Base64,
    }),
  )
  if (encrypted.length <= 12 + 16) throw new Error('Le fichier chiffré est invalide.')

  const key = toByteArray(record.content_key)
  const nonce = encrypted.slice(0, 12)
  const ciphertext = encrypted.slice(12)
  const plaintext = gcm(key, nonce).decrypt(ciphertext)

  await ensureDirectory(READER_DIRECTORY)
  const fileUri = `${READER_DIRECTORY}${documentId}.pdf`
  await FileSystem.writeAsStringAsync(fileUri, fromByteArray(plaintext), {
    encoding: FileSystem.EncodingType.Base64,
  })
  return { fileUri, record }
}

export async function renewOfflineLicense(documentId) {
  const record = await readStoredLicense(documentId)
  if (!record) throw new Error('Aucun téléchargement hors ligne n’est disponible.')
  const response = await authenticatedRequest(
    `/api/mobile/licenses/${record.license_id}/renew/`,
    { method: 'POST' },
  )
  if (!response.ok) throw new Error('Impossible de renouveler cette licence.')
  const renewed = await response.json()
  const nextRecord = {
    ...record,
    content_key: renewed.content_key,
    expires_at: renewed.expires_at,
    last_server_time: renewed.server_time,
  }
  await SecureStore.setItemAsync(`${LICENSE_KEY_PREFIX}${documentId}`, JSON.stringify(nextRecord))
  return nextRecord
}

export async function removeTemporaryReaderFiles() {
  const info = await FileSystem.getInfoAsync(READER_DIRECTORY)
  if (info.exists) await FileSystem.deleteAsync(READER_DIRECTORY, { idempotent: true })
}

export async function clearAccountDownloads() {
  for (const documentId of await getLicenseIndex()) {
    await SecureStore.deleteItemAsync(`${LICENSE_KEY_PREFIX}${documentId}`)
  }
  await SecureStore.deleteItemAsync(LICENSE_INDEX_KEY)
  await FileSystem.deleteAsync(ENCRYPTED_DIRECTORY, { idempotent: true })
  await removeTemporaryReaderFiles()
}

export async function reportScreenCapture(documentId, record) {
  const response = await authenticatedRequest(
    `/api/mobile/documents/${documentId}/screen-capture/`,
    {
      method: 'POST',
      body: JSON.stringify({
        device_uuid: record.device_uuid,
        license_id: record.license_id,
      }),
    },
  )
  if (!response.ok) throw new Error('Impossible d’enregistrer cet événement de capture.')
}
