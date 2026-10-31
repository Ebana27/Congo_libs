import * as SecureStore from 'expo-secure-store'
import { fromByteArray } from 'base64-js'

export const API_BASE_URL = (
  process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000'
).replace(/\/$/, '')

const AUTH_TOKEN_KEY = 'congolibs.auth-token'

export class AuthenticationRequiredError extends Error {}

export async function getAuthToken() {
  return SecureStore.getItemAsync(AUTH_TOKEN_KEY)
}

export async function signIn(username, password) {
  const response = await fetch(`${API_BASE_URL}/api/v1/users/auth/login-mobile/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  if (!response.ok) throw new Error('Identifiant ou mot de passe invalide.')

  const payload = await response.json()
  if (!payload.token) throw new Error('Le serveur n’a pas retourné de session valide.')
  await SecureStore.setItemAsync(AUTH_TOKEN_KEY, payload.token)
  return payload.user
}

export async function authenticatedRequest(path, options = {}) {
  const token = await getAuthToken()
  if (!token) throw new AuthenticationRequiredError('Connectez-vous pour continuer.')

  const headers = new Headers(options.headers || {})
  headers.set('Authorization', `Token ${token}`)
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })
  if (response.status === 401) {
    await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY)
    throw new AuthenticationRequiredError('Votre session a expiré. Connectez-vous à nouveau.')
  }
  return response
}

export async function listDocuments() {
  const response = await fetch(`${API_BASE_URL}/api/v1/documents/`, {
    headers: { Accept: 'application/json' },
  })
  if (!response.ok) throw new Error('Impossible de charger la bibliothèque.')
  return response.json()
}

export async function fetchPageImage(documentId, pageNumber, sessionId) {
  const query = new URLSearchParams({ session: sessionId })
  const response = await authenticatedRequest(
    `/api/v1/documents/${documentId}/pages/${pageNumber}/?${query}`,
    { headers: { Accept: 'image/png' }, cache: 'no-store' },
  )
  if (!response.ok || !response.headers.get('content-type')?.startsWith('image/png')) {
    throw new Error('Impossible de charger cette page.')
  }
  return `data:image/png;base64,${fromByteArray(new Uint8Array(await response.arrayBuffer()))}`
}

export async function fetchReaderMetadata(documentId) {
  const response = await authenticatedRequest(
    `/api/v1/documents/${documentId}/meta/`,
    { headers: { Accept: 'application/json' }, cache: 'no-store' },
  )
  if (!response.ok) throw new Error('Ce document est introuvable ou non disponible.')
  return response.json()
}

export async function logoutMobile() {
  try {
    await authenticatedRequest('/api/v1/users/auth/logout-mobile/', { method: 'POST' })
  } finally {
    await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY)
  }
}
