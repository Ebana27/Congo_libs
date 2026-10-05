import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  getSession,
  loginUser,
  loginWithGoogle,
  logoutUser,
  registerUser,
  saveAuthToken,
} from '../services/api'

const AuthContext = createContext(null)
const USER_KEY = 'congolibs_user'
const PROFILE_KEY = 'congolibs_profiles'
const AUTH_VERSION_KEY = 'congolibs_auth_version'
const AUTH_VERSION = '3'

function loadProfiles() {
  try { return JSON.parse(localStorage.getItem(PROFILE_KEY)) || {} } catch { return {} }
}

function saveProfile(email, name) {
  const profiles = loadProfiles()
  profiles[email] = { name }
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profiles))
}

function normalizeUser(user, fallbackName = '') {
  const key = user?.email || user?.username || ''
  const profile = loadProfiles()[key]
  return {
    ...user,
    name: fallbackName || user?.first_name || profile?.name || user?.username || 'Utilisateur CONGOLIBS',
  }
}

function clearLocalAuth() {
  saveAuthToken(null)
  localStorage.removeItem(USER_KEY)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function restoreSession() {
      // The previous frontend could keep a token/user from an old test account.
      // Clear that legacy session once after this version is deployed.
      if (localStorage.getItem(AUTH_VERSION_KEY) !== AUTH_VERSION) {
        clearLocalAuth()
        localStorage.setItem(AUTH_VERSION_KEY, AUTH_VERSION)
      }

      const token = localStorage.getItem('congolibs_api_token')
      if (!token) {
        if (mounted) setAuthLoading(false)
        return
      }

      try {
        const data = await getSession()
        if (mounted) setUser(normalizeUser(data.user))
      } catch (error) {
        if (mounted && (error.status === 401 || error.status === 403)) {
          clearLocalAuth()
          setUser(null)
        }
        // On network errors we also avoid showing a cached account. The user can
        // explicitly reconnect once the API is reachable again.
        if (mounted && !error.status) {
          clearLocalAuth()
          setUser(null)
        }
      } finally {
        if (mounted) setAuthLoading(false)
      }
    }

    restoreSession()
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
    else localStorage.removeItem(USER_KEY)
  }, [user])

  const establishSession = (data, fallbackName = '') => {
    const token = data?.token || data?.key || data?.access || data?.auth_token
    if (!token) throw new Error('Le serveur n’a pas renvoyé de jeton de connexion.')
    saveAuthToken(token)
    const nextUser = normalizeUser(data.user || data, fallbackName)
    setUser(nextUser)
    return nextUser
  }

  const register = useCallback(async ({ name, email, password }) => {
    const normalizedEmail = email.trim().toLowerCase()
    const registration = await registerUser({
      username: normalizedEmail,
      email: normalizedEmail,
      password1: password,
      password2: password,
    })
    saveProfile(normalizedEmail, name.trim())
    establishSession(registration, name.trim())
    return { ok: true }
  }, [])

  const login = useCallback(async ({ email, password }) => {
    try {
      const username = email.trim().toLowerCase()
      const data = await loginUser({ username, password })
      establishSession(data)
      return { ok: true }
    } catch (error) {
      return { ok: false, message: error.message || 'Impossible de se connecter.' }
    }
  }, [])

  const loginGoogle = useCallback(async (credential) => {
    try {
      const data = await loginWithGoogle(credential)
      establishSession(data)
      return { ok: true }
    } catch (error) {
      return { ok: false, message: error.message || 'Connexion Google impossible.' }
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      if (localStorage.getItem('congolibs_api_token')) await logoutUser()
    } catch {
      // Local logout must still succeed when the API is temporarily unavailable.
    } finally {
      clearLocalAuth()
      setUser(null)
    }
  }, [])

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), authLoading, register, login, loginGoogle, logout }),
    [user, authLoading, register, login, loginGoogle, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth doit être utilisé dans AuthProvider')
  return context
}
