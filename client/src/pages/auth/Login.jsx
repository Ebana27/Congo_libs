import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FiArrowRight, FiBookOpen, FiEye, FiEyeOff, FiMail, FiLock } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    setError('')
    const result = login({ email, password })
    if (!result.ok) {
      setError(result.message)
      return
    }
    navigate(location.state?.from || '/', { replace: true })
  }

  return (
    <div className="auth-page">
      <div className="auth-decoration auth-decoration-one" />
      <div className="auth-decoration auth-decoration-two" />

      <section className="auth-card">
        <div className="auth-brand">
          <div className="auth-logo"><FiBookOpen /></div>
          <span>CONGOLIBS</span>
        </div>

        <div className="auth-heading">
          <span className="section-label">BIENVENUE</span>
          <h1>Content de vous revoir.</h1>
          <p>Connectez-vous pour retrouver votre bibliothèque et continuer vos lectures.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            <span>Adresse e-mail</span>
            <div className="auth-input">
              <FiMail />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vous@exemple.com" required />
            </div>
          </label>

          <label>
            <span>Mot de passe</span>
            <div className="auth-input">
              <FiLock />
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Votre mot de passe" required />
              <button type="button" className="auth-password-toggle" onClick={() => setShowPassword((value) => !value)} aria-label="Afficher le mot de passe">
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </label>

          {error && <div className="auth-error">{error}</div>}

          <button className="auth-submit" type="submit">
            Se connecter <FiArrowRight />
          </button>
        </form>

        <p className="auth-switch">Vous n’avez pas encore de compte ? <Link to="/inscription">Créer un compte</Link></p>
      </section>
    </div>
  )
}

export default Login
