import { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'

import { AppHeader } from '../../src/components/Header'
import {
  AuthenticationRequiredError,
  authenticatedRequest,
  getAuthToken,
  listDocuments,
} from '../../src/drm/api'
import { getDeviceUuid, removeOfflineDownload, saveEncryptedDownload } from '../../src/drm/storage'

export default function Library() {
  const router = useRouter()
  const [documents, setDocuments] = useState([])
  const [authenticated, setAuthenticated] = useState(false)
  const [busyDocument, setBusyDocument] = useState('')
  const [error, setError] = useState('')

  const loadLibrary = useCallback(async () => {
    try {
      const [items, token] = await Promise.all([listDocuments(), getAuthToken()])
      setDocuments(items)
      setAuthenticated(Boolean(token))
    } catch (requestError) {
      if (requestError instanceof AuthenticationRequiredError) {
        router.push('/connexion')
      } else {
        setError(requestError.message)
      }
    }
  }, [router])

  useEffect(() => {
    loadLibrary()
  }, [loadLibrary])

  const download = async (document) => {
    if (!authenticated) {
      router.push('/connexion')
      return
    }

    setBusyDocument(document.id)
    setError('')
    try {
      const deviceUuid = await getDeviceUuid()
      const deviceResponse = await authenticatedRequest('/api/mobile/devices/register/', {
        method: 'POST',
        body: JSON.stringify({ device_uuid: deviceUuid, label: 'Appareil mobile' }),
      })
      if (!deviceResponse.ok) throw new Error('Impossible d’enregistrer cet appareil.')

      const licenseResponse = await authenticatedRequest(
        `/api/mobile/documents/${document.id}/license/`,
        {
          method: 'POST',
          body: JSON.stringify({ device_uuid: deviceUuid }),
        },
      )
      if (!licenseResponse.ok) {
        throw new Error(licenseResponse.status === 403
          ? 'La limite d’appareils ou le quota hors ligne est atteint.'
          : 'Impossible d’obtenir une licence de lecture.')
      }
      const license = await licenseResponse.json()
      await removeOfflineDownload(document.id)

      const downloadResponse = await authenticatedRequest(
        `/api/mobile/documents/${document.id}/download/?license=${license.license_id}`,
        { headers: { Accept: 'application/octet-stream' } },
      )
      if (!downloadResponse.ok
        || !downloadResponse.headers.get('content-type')?.startsWith('application/octet-stream')) {
        throw new Error('Impossible de télécharger le document chiffré.')
      }

      await saveEncryptedDownload(
        document,
        license,
        new Uint8Array(await downloadResponse.arrayBuffer()),
        deviceUuid,
      )
    } catch (requestError) {
      if (requestError instanceof AuthenticationRequiredError) {
        router.replace('/connexion')
      } else {
        setError(requestError.message)
      }
    } finally {
      setBusyDocument('')
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title="BIBLIOTHÈQUE" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heading}>
          <Text style={styles.title}>Documents</Text>
          <Pressable onPress={() => router.push('/downloads')} style={styles.secondaryButton}>
            <Text style={styles.secondaryText}>Téléchargements</Text>
          </Pressable>
        </View>
        {!authenticated && (
          <Pressable onPress={() => router.push('/connexion')} style={styles.loginButton}>
            <Text style={styles.buttonText}>Connectez-vous pour lire et télécharger</Text>
          </Pressable>
        )}
        {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
        {documents.map((document) => (
          <View key={document.id} style={styles.card}>
            <Text style={styles.type}>{document.type.toUpperCase()}</Text>
            <Text style={styles.documentTitle}>{document.nom}</Text>
            <View style={styles.actions}>
              <Pressable
                disabled={!authenticated}
                onPress={() => router.push(`/reader/${document.id}`)}
                style={[styles.button, !authenticated && styles.disabled]}
              >
                <Text style={styles.buttonText}>Lire en ligne</Text>
              </Pressable>
              <Pressable
                disabled={!authenticated || Boolean(busyDocument)}
                onPress={() => download(document)}
                style={[styles.button, styles.downloadButton, (!authenticated || busyDocument) && styles.disabled]}
              >
                <Text style={styles.buttonText}>
                  {busyDocument === document.id ? 'Téléchargement…' : 'Hors ligne'}
                </Text>
              </Pressable>
            </View>
          </View>
        ))}
        {!documents.length && !error && <Text style={styles.empty}>Aucun document disponible.</Text>}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 18, paddingBottom: 36, gap: 14 },
  heading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 24, fontWeight: '800', color: '#111827' },
  secondaryButton: { paddingVertical: 9, paddingHorizontal: 12, borderRadius: 9, backgroundColor: '#e5e7eb' },
  secondaryText: { color: '#111827', fontWeight: '700' },
  loginButton: { padding: 13, backgroundColor: '#1e40af', borderRadius: 10 },
  card: { padding: 16, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, gap: 8 },
  type: { color: '#1e40af', fontSize: 11, fontWeight: '800' },
  documentTitle: { fontSize: 17, fontWeight: '700', color: '#111827' },
  actions: { flexDirection: 'row', gap: 10, marginTop: 4 },
  button: { flex: 1, padding: 11, alignItems: 'center', backgroundColor: '#1e40af', borderRadius: 9 },
  downloadButton: { backgroundColor: '#166534' },
  buttonText: { color: '#fff', fontWeight: '700', textAlign: 'center' },
  disabled: { opacity: 0.45 },
  error: { color: '#b91c1c' },
  empty: { color: '#6b7280', textAlign: 'center', marginTop: 30 },
})
