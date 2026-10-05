const API_BASE_URL = (import.meta.env.VITE_API_URL || 'https://ledevfreelance.pythonanywhere.com/api/v1').replace(/\/$/, '')

export const API_ROOT_URL = `${API_BASE_URL.replace(/\/api\/v1$/, '')}/`
const TOKEN_KEY = 'congolibs_api_token'
const GOOGLE_AUTH_PATH = import.meta.env.VITE_GOOGLE_AUTH_PATH || '/users/auth/google/'

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function saveAuthToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

async function request(path, options = {}) {
  const method = (options.method || 'GET').toUpperCase()
  const headers = {
    Accept: 'application/json',
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(options.headers || {}),
  }
  const token = getAuthToken()
  if (token) headers.Authorization = `Token ${token}`

  let response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      method,
      headers,
    })
  } catch {
    const error = new Error('API CONGOLIBS inaccessible. Vérifiez votre connexion ou la disponibilité du serveur.')
    error.status = 0
    throw error
  }

  const contentType = response.headers.get('content-type') || ''
  const data = contentType.includes('application/json')
    ? await response.json().catch(() => ({}))
    : await response.text()

  if (!response.ok) {
    const values = typeof data === 'object' && data ? Object.values(data).flat?.() : []
    const detail = typeof data === 'string'
      ? data
      : data?.detail || data?.message || data?.non_field_errors?.[0] || values?.[0] || `Erreur HTTP ${response.status}`
    const error = new Error(String(detail))
    error.status = response.status
    error.data = data
    throw error
  }
  return data
}

export function registerUser({ username, email, password1, password2 }) {
  return request('/users/auth/register-mobile/', {
    method: 'POST',
    body: JSON.stringify({ username, email, password1, password2 }),
  })
}

export function loginUser({ username, password }) {
  return request('/users/auth/login-mobile/', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
}

export function loginWithGoogle(credential) {
  return request(GOOGLE_AUTH_PATH, {
    method: 'POST',
    body: JSON.stringify({ credential, id_token: credential }),
  })
}

export function getSession() {
  return request('/users/auth/user/')
}

export function logoutUser() {
  return request('/users/auth/logout-mobile/', { method: 'POST' })
}

export function getDocuments(params = {}) {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') query.set(key, value)
  })
  const suffix = query.toString() ? `?${query.toString()}` : ''
  return request(`/documents/${suffix}`)
}

export function getDocument(id) { return request(`/documents/${id}/`) }
export function getLivreDetails() { return request('/documents/livres/') }
export function getLivreDetail(id) { return request(`/documents/livres/${id}/`) }
export function getConcours(params = {}) {
  const query = new URLSearchParams(params).toString()
  return request(`/documents/concours/${query ? `?${query}` : ''}`)
}
export function getBac(params = {}) {
  const query = new URLSearchParams(params).toString()
  return request(`/documents/bac/${query ? `?${query}` : ''}`)
}
export function getDownloadHistory() { return request('/documents/telechargements/') }

export async function downloadDocument(id) {
  const token = getAuthToken()
  if (!token) throw new Error('Connectez-vous pour télécharger ce document.')

  let response
  try {
    response = await fetch(`${API_BASE_URL}/documents/${id}/telecharger/`, {
      method: 'POST',
      headers: { Accept: 'application/pdf', Authorization: `Token ${token}` },
    })
  } catch {
    throw new Error('Le service de téléchargement est momentanément inaccessible.')
  }

  if (!response.ok) {
    let message = `Erreur HTTP ${response.status}`
    try {
      const data = await response.json()
      message = data?.detail || data?.message || message
    } catch {}
    const error = new Error(message)
    error.status = response.status
    throw error
  }
  return response.blob()
}

export async function fetchBooks() {
  const [documents, details] = await Promise.all([getDocuments({ type: 'livre' }), getLivreDetails()])
  const docs = Array.isArray(documents) ? documents : documents?.results || []
  const rows = Array.isArray(details) ? details : details?.results || []
  const documentMap = new Map(docs.map((doc) => [String(doc.id), doc]))
  return rows.map((row) => {
    const id = String(row.document)
    const doc = documentMap.get(id)
    return {
      id,
      title: doc?.nom || 'Livre sans titre',
      author: row.auteur || 'Auteur inconnu',
      category: 'Livre',
      type: doc?.type || 'livre',
      date: doc?.date_creation || null,
      rating: null,
      pages: null,
      cover: null,
    }
  })
}

// Ressource API « Pleurer rire » fournie avec le projet.
// L'identifiant est conservé ici pour permettre son branchement dès que l'URL
// complète de l'endpoint REST est disponible.
export const PLEURER_RIRE_RESOURCE_ID = '1W3dJ80LWlprS_-KiLUI3hjn5ZvT-GiFT'
export function getPleurerRireResourceId() {
  return PLEURER_RIRE_RESOURCE_ID
}
