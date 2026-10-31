import { useEffect, useState } from 'react'
import { getApiErrorMessage, readApiResponse } from './adminApi'

const API_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/v1/admin`

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
        setUsers(Array.isArray(data.results) ? data.results : [])
      } catch (err) {
        setError(getApiErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  if (loading) return <main className="cg-admin cg-admin-page"><div className="cg-admin-shell"><p className="cg-status-message" role="status">Chargement des utilisateurs…</p></div></main>
  if (error) return <main className="cg-admin cg-admin-page"><div className="cg-admin-shell"><div className="cg-admin-message cg-error-state"><p role="alert">{error}</p></div></div></main>

  return (
    <main className="cg-admin cg-admin-page">
      <div className="cg-admin-shell cg-admin-content">
        <header className="cg-admin-heading">
          <div><p className="cg-eyebrow">Administration</p><h1>Utilisateurs</h1></div>
          <a className="cg-button cg-secondary-button" href="/admin/dashboard">Retour au tableau de bord</a>
        </header>

        {users.length ? (
          <div className="cg-admin-table-wrap cg-admin-surface">
            <table className="cg-admin-table">
              <thead>
                <tr><th scope="col">Nom</th><th scope="col">Adresse e-mail</th><th scope="col">Rôle</th><th scope="col">Inscription</th></tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td><span className="cg-admin-role">{user.role}</span></td>
                    <td>{user.date_joined ? new Date(user.date_joined).toLocaleDateString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <section className="cg-empty-state" role="status">
            <h2>Aucun utilisateur à afficher</h2>
            <p>La liste ne contient aucun résultat.</p>
          </section>
        )}
      </div>
    </main>
  )
}
