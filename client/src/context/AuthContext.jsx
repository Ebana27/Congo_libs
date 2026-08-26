import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)

const USER_KEY = 'congolibs_user'
const REGISTERED_KEY = 'congolibs_registered_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(USER_KEY)
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
    else localStorage.removeItem(USER_KEY)
  }, [user])

  const register = ({ name, email, password }) => {
    const registeredUser = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    }

    localStorage.setItem(REGISTERED_KEY, JSON.stringify(registeredUser))
    setUser({ id: registeredUser.id, name: registeredUser.name, email: registeredUser.email })
  }

  const login = ({ email, password }) => {
    const saved = localStorage.getItem(REGISTERED_KEY)
    const registeredUser = saved ? JSON.parse(saved) : null

    if (!registeredUser) {
      return { ok: false, message: 'Aucun compte local trouvé. Créez d’abord un compte.' }
    }

    if (
      registeredUser.email !== email.trim().toLowerCase() ||
      registeredUser.password !== password
    ) {
      return { ok: false, message: 'Adresse e-mail ou mot de passe incorrect.' }
    }

    setUser({
      id: registeredUser.id,
      name: registeredUser.name,
      email: registeredUser.email,
    })

    return { ok: true }
  }

  const logout = () => setUser(null)

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), register, login, logout }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth doit être utilisé dans AuthProvider')
  return context
}
