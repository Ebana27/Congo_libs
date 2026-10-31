import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FiArrowRight, FiBookOpen, FiEye, FiEyeOff, FiLock, FiMail } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import GoogleLoginButton from './GoogleLoginButton'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (busy) return
    setError('')
    setBusy(true)
    try {
      const result = await login({ email, password })
      if (!result.ok) {
        setError(result.message)
        return
      }
      navigate(location.state?.from || '/', { replace: true })
    } catch (requestError) {
      setError(requestError.message || 'La connexion a échoué. Réessayez.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="cg-auth cg-auth-page">
      <aside className="cg-auth-aside">
        <div className="cg-auth-brand"><FiBookOpen aria-hidden="true" /><span>Congolibs</span></div>
        <div><h2>Des livres à lire, des idées à partager.</h2><p>Retrouvez les récits et les savoirs de la collection congolaise.</p></div>
        <p>Votre bibliothèque numérique, à portée de main.</p>
      </aside>
      <div className="cg-auth-main">
      <section className="cg-auth-panel cg-auth-card" aria-labelledby="login-title">
        <header className="cg-auth-heading">
          <p className="cg-eyebrow">Bienvenue</p>
          <h1 id="login-title">Content de vous revoir.</h1>
          <p>Connectez-vous pour retrouver votre bibliothèque et poursuivre vos lectures.</p>
        </header>
        <form className="cg-auth-form" onSubmit={handleSubmit}>
          <label className="cg-form-field">
            <span>Adresse e-mail ou nom d’utilisateur</span>
            <span className="cg-input-wrap"><FiMail aria-hidden="true" /><input className="cg-input" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="vous@exemple.com" required /></span>
          </label>
          <label className="cg-form-field">
            <span>Mot de passe</span>
            <span className="cg-input-wrap">
              <FiLock aria-hidden="true" />
              <input className="cg-input" autoComplete="current-password" type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Votre mot de passe" required />
              <button type="button" className="cg-password-toggle" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}>
                {showPassword ? <FiEyeOff aria-hidden="true" /> : <FiEye aria-hidden="true" />}
              </button>
            </span>
          </label>
          {error && <p className="cg-auth-error cg-form-error" role="alert">{error}</p>}
          <button className="cg-button cg-primary-button cg-button-primary cg-auth-submit" type="submit" disabled={busy}>
            {busy ? 'Connexion…' : 'Se connecter'} <FiArrowRight aria-hidden="true" />
          </button>
        </form>
        {import.meta.env.VITE_GOOGLE_CLIENT_ID && (
          <GoogleLoginButton onError={setError} onSuccess={() => navigate(location.state?.from || '/', { replace: true })} />
        )}
        <p className="cg-auth-switch">Vous n’avez pas encore de compte ? <Link to="/inscription">Créer un compte</Link></p>
      </section>
      </div>
    </main>
  )
}

export default Login
