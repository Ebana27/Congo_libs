import { useEffect, useState } from 'react'

const API_URL = 'http://localhost:8000/api/v1/admin'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch(`${API_URL}/dashboard/`, {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        })

        if (!response.ok) {
          window.location.href = '/admin'
          return
        }

        const data = await response.json()
        setStats(data)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  if (loading || !stats) {
    return <div className="min-h-screen bg-slate-100 p-8 text-slate-700">Chargement du dashboard…</div>
  }

  const cards = [
    { label: 'Documents', value: stats.documents_total },
    { label: 'Utilisateurs', value: stats.users_total },
    { label: 'Téléchargements', value: stats.downloads_today },
  ]

  return (
    <div className="min-h-screen bg-slate-100 p-8 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Dashboard</p>
            <h1 className="mt-2 text-3xl font-bold">Vue d’ensemble</h1>
          </div>
          <a href="/admin/users" className="rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700">Voir les utilisateurs</a>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {cards.map((card) => (
            <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
              <p className="text-sm text-slate-500">{card.label}</p>
              <p className="mt-3 text-3xl font-bold text-slate-900">{card.value}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
            <h2 className="mb-4 text-lg font-semibold">Répartition par type</h2>
            <div className="space-y-3">
              {stats.documents_by_type.map((row) => (
                <div key={row.type}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="capitalize text-slate-600">{row.type}</span>
                    <span className="font-medium text-slate-900">{row.total}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div className="h-2 rounded-full bg-accent" style={{ width: `${Math.min(100, (row.total / Math.max(stats.documents_total, 1)) * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
            <h2 className="mb-4 text-lg font-semibold">Téléchargements récents</h2>
            <div className="space-y-3">
              {stats.recent_downloads.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b border-slate-100 pb-2 last:border-none last:pb-0">
                  <div>
                    <p className="font-medium text-slate-900">{item.document}</p>
                    <p className="text-xs text-slate-500">{item.user} · {item.type}</p>
                  </div>
                  <span className="text-xs text-slate-500">{new Date(item.date).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
