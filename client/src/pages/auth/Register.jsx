import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiArrowRight, FiBookOpen, FiEye, FiEyeOff, FiLock, FiMail, FiUser } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'

function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [busy, setBusy] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    if (busy) return
    setError('')
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.')
      return
    }
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }
    setBusy(true)
    register({ name, email, password })
      .then(() => navigate('/', { replace: true }))
      .catch((requestError) => setError(requestError.message || 'La création du compte a échoué.'))
      .finally(() => setBusy(false))
  }

  return (
    <main className="cg-auth cg-auth-page">
      <aside className="cg-auth-aside">
        <div className="cg-auth-brand"><FiBookOpen aria-hidden="true" /><span>Congolibs</span></div>
        <div><h2>Ouvrez un livre, découvrez un monde.</h2><p>Créez votre espace et parcourez la collection Congolibs.</p></div>
        <p>Une bibliothèque numérique consacrée aux récits et aux savoirs.</p>
      </aside>
      <div className="cg-auth-main">
      <section className="cg-auth-panel cg-auth-card cg-auth-card-register" aria-labelledby="register-title">
        <header className="cg-auth-heading">
          <p className="cg-eyebrow">Créer un compte</p>
          <h1 id="register-title">Bienvenue dans la bibliothèque.</h1>
          <p>Créez un compte pour accéder à votre espace Congolibs.</p>
        </header>
        <form className="cg-auth-form" onSubmit={handleSubmit}>
          <label className="cg-form-field">
            <span>Nom d’utilisateur</span>
            <span className="cg-input-wrap"><FiUser aria-hidden="true" /><input className="cg-input" autoCapitalize="none" autoComplete="username" value={name} onChange={(event) => setName(event.target.value)} placeholder="Votre nom d’utilisateur" required /></span>
          </label>
          <label className="cg-form-field">
            <span>Adresse e-mail</span>
            <span className="cg-input-wrap"><FiMail aria-hidden="true" /><input className="cg-input" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="vous@exemple.com" required /></span>
          </label>
          <label className="cg-form-field">
            <span>Mot de passe</span>
            <span className="cg-input-wrap">
              <FiLock aria-hidden="true" />
              <input className="cg-input" autoComplete="new-password" type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="6 caractères minimum" required />
              <button type="button" className="cg-password-toggle" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}>{showPassword ? <FiEyeOff aria-hidden="true" /> : <FiEye aria-hidden="true" />}</button>
            </span>
          </label>
          <label className="cg-form-field">
            <span>Confirmer le mot de passe</span>
            <span className="cg-input-wrap"><FiLock aria-hidden="true" /><input className="cg-input" autoComplete="new-password" type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Répétez votre mot de passe" required /></span>
          </label>
          {error && <p className="cg-auth-error cg-form-error" role="alert">{error}</p>}
          <button className="cg-button cg-primary-button cg-button-primary cg-auth-submit" type="submit" disabled={busy}>
            {busy ? 'Création du compte…' : 'Créer mon compte'} <FiArrowRight aria-hidden="true" />
          </button>
        </form>
        <p className="cg-auth-switch">Vous avez déjà un compte ? <Link to="/connexion">Se connecter</Link></p>
      </section>
      </div>
    </main>
  )
}

export default Register
