import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiArrowRight, FiBookOpen, FiEye, FiEyeOff, FiMail, FiLock, FiUser } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'

function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.')
      return
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }

    register({ name, email, password })
    navigate('/', { replace: true })
  }

  return (
    <div className="auth-page">
      <div className="auth-decoration auth-decoration-one" />
      <div className="auth-decoration auth-decoration-two" />

      <section className="auth-card auth-card-register">
        <div className="auth-brand">
          <div className="auth-logo"><FiBookOpen /></div>
          <span>CONGOLIBS</span>
        </div>

        <div className="auth-heading">
          <span className="section-label">COMMENCER</span>
          <h1>Créez votre compte.</h1>
          <p>Rejoignez CONGOLIBS et construisez votre bibliothèque numérique.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            <span>Nom complet</span>
            <div className="auth-input">
              <FiUser />
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Votre nom" required />
            </div>
          </label>

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
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="6 caractères minimum" required />
              <button type="button" className="auth-password-toggle" onClick={() => setShowPassword((value) => !value)} aria-label="Afficher le mot de passe">
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </label>

          <label>
            <span>Confirmer le mot de passe</span>
            <div className="auth-input">
              <FiLock />
              <input type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Répétez votre mot de passe" required />
            </div>
          </label>

          {error && <div className="auth-error">{error}</div>}

          <button className="auth-submit" type="submit">
            Créer mon compte <FiArrowRight />
          </button>
        </form>

        <p className="auth-switch">Vous avez déjà un compte ? <Link to="/connexion">Se connecter</Link></p>
      </section>
    </div>
  )
}

export default Register
