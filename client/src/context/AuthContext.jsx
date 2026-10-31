import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

function csrfTokenFromCookie() {
  const cookie = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith('csrftoken='))
  return cookie ? decodeURIComponent(cookie.slice('csrftoken='.length)) : ''
}

export async function getCsrfToken() {
  const response = await fetch(`${API_BASE_URL}/api/v1/users/csrf/`, {
    credentials: 'include',
    cache: 'no-store',
  })
  if (!response.ok) throw new Error('Impossible d’initialiser la session sécurisée.')
  const token = csrfTokenFromCookie()
  if (!token) throw new Error('Le cookie de sécurité CSRF est absent.')
  return token
}

async function postWithCsrf(path, body) {
  const csrfToken = await getCsrfToken()
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken,
    },
    body: JSON.stringify(body),
  })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(payload.detail || payload.non_field_errors?.[0] || 'La requête a échoué.')
  }
  return payload
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const refreshSession = useCallback(async () => {
    const response = await fetch(`${API_BASE_URL}/api/v1/users/session/`, {
      credentials: 'include',
      cache: 'no-store',
    })
    if (response.status === 401 || response.status === 403) {
      setUser(null)
      return null
    }
    if (!response.ok) throw new Error('Impossible de vérifier la session.')
    const payload = await response.json()
    setUser(payload.user)
    return payload.user
  }, [])

  useEffect(() => {
    let active = true
    refreshSession()
      .catch((error) => {
        console.error('Échec de la vérification de la session web.', error)
        if (active) setUser(null)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [refreshSession])

  const register = async ({ name, email, password }) => {
    const username = name.trim()
    await postWithCsrf('/api/v1/users/auth/registration/', {
      username,
      email: email.trim(),
      password1: password,
      password2: password,
    })
    const result = await postWithCsrf('/api/v1/users/login/', {
      username: email.trim(),
      password,
    })
    setUser(result.user)
    return { ok: true }
  }

  const login = async ({ email, password }) => {
    try {
      const result = await postWithCsrf('/api/v1/users/login/', {
        username: email.trim(),
        password,
      })
      setUser(result.user)
      return { ok: true }
    } catch (error) {
      return { ok: false, message: error.message }
    }
  }

  const loginWithGoogle = async (accessToken) => {
    const result = await postWithCsrf('/api/v1/users/auth/google/', {
      access_token: accessToken,
    })
    const authenticatedUser = result.user || await refreshSession()
    if (!authenticatedUser) {
      throw new Error('La connexion Google n’a pas ouvert de session.')
    }
    setUser(authenticatedUser)
  }

  const logout = async () => {
    try {
      await postWithCsrf('/api/v1/users/logout/', {})
    } finally {
      setUser(null)
    }
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      register,
      login,
      loginWithGoogle,
      logout,
      refreshSession,
    }),
    [user, loading, refreshSession],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth doit être utilisé dans AuthProvider')
  return context
}
