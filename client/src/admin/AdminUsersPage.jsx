import { useEffect, useState } from 'react'
import { getApiErrorMessage, readApiResponse } from './adminApi'

const API_URL = 'http://localhost:8000/api/v1/admin'

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch(`${API_URL}/users/`, { credentials: 'include' })
        if (response.status === 401 || response.status === 403) {
          window.location.href = '/admin'
          return
        }

        const data = await readApiResponse(response)
        setUsers(data.results || [])
      } catch (err) {
        setError(getApiErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  if (loading) return <div className="min-h-screen bg-slate-100 p-8">Chargement…</div>
  if (error) return <div className="min-h-screen bg-slate-100 p-8 text-red-700">{error}</div>

  return (
    <div className="min-h-screen bg-slate-100 p-8 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Administration</p>
            <h1 className="mt-2 text-3xl font-bold">Utilisateurs</h1>
          </div>
          <a href="/admin/dashboard" className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">Retour dashboard</a>
        </header>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Nom</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Rôle</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Inscription</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{user.username}</td>
                  <td className="px-4 py-3 text-slate-600">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">{user.role}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{new Date(user.date_joined).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
