import { useState } from 'react'
import { getApiErrorMessage, readApiResponse } from './adminApi'

const API_URL = 'http://localhost:8000/api/v1/admin'

export default function AdminLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    try {
      const response = await fetch(`${API_URL}/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      })

      const data = await readApiResponse(response)

      localStorage.setItem('admin_session', JSON.stringify(data))
      window.location.href = '/admin/dashboard'
    } catch (err) {
      setError(getApiErrorMessage(err))
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-soft border border-slate-200">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Administration</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Connexion</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Nom d’utilisateur</label>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
              placeholder="adminuser"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-slate-900 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

          <button type="submit" className="w-full rounded-xl bg-accent px-4 py-3 font-semibold text-white transition hover:bg-blue-700">
            Se connecter
          </button>
        </form>
      </div>
    </div>
  )
}
