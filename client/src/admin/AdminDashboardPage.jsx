import { useEffect, useState } from 'react'
import { getApiErrorMessage, readApiResponse } from './adminApi'

const API_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/v1/admin`

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch(`${API_URL}/dashboard/`, {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        })

        if (response.status === 401 || response.status === 403) {
          window.location.href = '/admin'
          return
        }

        setStats(await readApiResponse(response))
      } catch (err) {
        setError(getApiErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  if (loading) return <main className="cg-admin cg-admin-page"><div className="cg-admin-shell"><p className="cg-status-message" role="status">Chargement du tableau de bord…</p></div></main>
  if (error || !stats) {
    return <main className="cg-admin cg-admin-page"><div className="cg-admin-shell"><div className="cg-admin-message cg-error-state"><p role="alert">{error || 'Les données du tableau de bord sont indisponibles.'}</p></div></div></main>
  }

  const cards = [
    { label: 'Documents', value: stats.documents_total },
    { label: 'Utilisateurs', value: stats.users_total },
    { label: 'Téléchargements aujourd’hui', value: stats.downloads_today },
  ]
  const documentsByType = Array.isArray(stats.documents_by_type) ? stats.documents_by_type : []
  const recentDownloads = Array.isArray(stats.recent_downloads) ? stats.recent_downloads : []
  const documentTotal = Number(stats.documents_total) || 0

  return (
    <main className="cg-admin cg-admin-page">
      <div className="cg-admin-shell cg-admin-content">
        <header className="cg-admin-heading">
          <div><p className="cg-eyebrow">Administration</p><h1>Vue d’ensemble</h1></div>
          <a className="cg-button cg-primary-button" href="/admin/users">Voir les utilisateurs</a>
        </header>

        <section className="cg-admin-metrics" aria-label="Indicateurs">
          {cards.map((card) => (
            <article className="cg-admin-metric cg-admin-surface" key={card.label}>
              <h2>{card.label}</h2>
              <p>{card.value}</p>
            </article>
          ))}
        </section>

        <div className="cg-admin-panels">
          <section className="cg-admin-panel cg-admin-surface" aria-labelledby="admin-documents-heading">
            <h2 id="admin-documents-heading">Répartition par type</h2>
            {documentsByType.length ? (
              <ul className="cg-admin-type-list">
                {documentsByType.map((row) => {
                  const percentage = Math.min(100, (Number(row.total) / Math.max(documentTotal, 1)) * 100)
                  return (
                    <li className="cg-admin-type-row" key={row.type}>
                      <div><span>{row.type}</span><strong>{row.total}</strong></div>
                      <div className="cg-admin-meter" role="presentation"><span style={{ width: `${percentage}%` }} /></div>
                    </li>
                  )
                })}
              </ul>
            ) : <p className="cg-empty-state">Aucun document à répartir.</p>}
          </section>

          <section className="cg-admin-panel cg-admin-surface" aria-labelledby="admin-downloads-heading">
            <h2 id="admin-downloads-heading">Téléchargements récents</h2>
            {recentDownloads.length ? (
              <ul className="cg-admin-download-list">
                {recentDownloads.map((item) => (
                  <li className="cg-admin-download" key={item.id}>
                    <div><strong>{item.document}</strong><span>{item.user} · {item.type}</span></div>
                    <time dateTime={item.date}>{new Date(item.date).toLocaleDateString()}</time>
                  </li>
                ))}
              </ul>
            ) : <p className="cg-empty-state">Aucun téléchargement récent.</p>}
          </section>
        </div>
      </div>
    </main>
  )
}
