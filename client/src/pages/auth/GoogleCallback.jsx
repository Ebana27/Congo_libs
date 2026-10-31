import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiBookOpen } from 'react-icons/fi'
import GoogleLoginButton from './GoogleLoginButton'

export default function GoogleCallback() {
  const navigate = useNavigate()
  const [status, setStatus] = useState('')

  return (
    <main className="cg-auth cg-auth-page">
      <aside className="cg-auth-aside">
        <div className="cg-auth-brand"><FiBookOpen aria-hidden="true" /><span>Congolibs</span></div>
        <div><h2>Votre bibliothèque, partout avec vous.</h2><p>Connectez-vous pour retrouver les œuvres et les auteurs de la collection.</p></div>
      </aside>
      <div className="cg-auth-main">
      <section className="cg-auth-panel cg-auth-card cg-google-callback" aria-labelledby="google-callback-title">
        <header className="cg-auth-heading">
          <p className="cg-eyebrow">Connexion sécurisée</p>
          <h1 id="google-callback-title">Continuer avec Google</h1>
          <p role={status ? 'alert' : undefined}>{status || 'Autorisez la connexion pour accéder à votre bibliothèque.'}</p>
        </header>
        {import.meta.env.VITE_GOOGLE_CLIENT_ID && (
          <GoogleLoginButton onError={setStatus} onSuccess={() => navigate('/', { replace: true })} />
        )}
      </section>
      </div>
    </main>
  )
}
