import { useState } from 'react'
import { FiBookOpen } from 'react-icons/fi'
import { getApiErrorMessage, getCookie, readApiResponse } from './adminApi'

const API_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/v1/admin`

export default function AdminLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    if (busy) return
    setError('')
    setBusy(true)

    try {
      await fetch(`${API_URL}/auth/csrf/`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })

      const csrfToken = getCookie('csrftoken')
      const response = await fetch(`${API_URL}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      })

      const data = await readApiResponse(response)
      localStorage.setItem('admin_session', JSON.stringify(data))
      window.location.href = '/admin/dashboard'
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="cg-admin cg-admin-auth-page">
      <section className="cg-admin-shell cg-admin-surface cg-admin-auth-card" aria-labelledby="admin-login-title">
        <div className="cg-auth-brand"><FiBookOpen aria-hidden="true" /><span>Congolibs</span></div>
        <header className="cg-auth-heading">
          <p className="cg-eyebrow">Administration</p>
          <h1 id="admin-login-title">Connexion</h1>
          <p>Connectez-vous à votre espace d’administration.</p>
        </header>
        <form className="cg-auth-form" onSubmit={handleSubmit}>
          <label className="cg-form-field" htmlFor="admin-username">
            <span>Nom d’utilisateur</span>
            <input className="cg-input" id="admin-username" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} required />
          </label>
          <label className="cg-form-field" htmlFor="admin-password">
            <span>Mot de passe</span>
            <input className="cg-input" id="admin-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </label>
          {error && <p className="cg-auth-error cg-form-error" role="alert">{error}</p>}
          <button type="submit" className="cg-button cg-primary-button cg-auth-submit" disabled={busy}>
            {busy ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>
      </section>
    </main>
  )
}
