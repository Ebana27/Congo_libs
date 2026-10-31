import { useNavigate } from 'react-router-dom'
import { FiArrowRight, FiBookOpen, FiHeart, FiSettings, FiUser } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'

function Profile() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const displayName = user?.name || user?.username || ''

  return (
    <main className="cg-page cg-profile">
      <header className="cg-profile-heading cg-page-header">
        <div className="cg-profile-identity">
          <span className="cg-profile-avatar"><FiUser aria-hidden="true" /></span>
          <div>
            <p className="cg-eyebrow">Mon espace</p>
            <h1>Mon profil</h1>
            <p>Votre compte Congolibs</p>
          </div>
        </div>
        <div className="cg-actions">
          <button className="cg-button cg-button-secondary cg-secondary-button" onClick={() => navigate('/settings')}>
            <FiSettings aria-hidden="true" /> Paramètres
          </button>
          <button className="cg-button cg-button-quiet cg-secondary-button" onClick={logout}>Déconnexion</button>
        </div>
      </header>

      <section className="cg-profile-card" aria-labelledby="profile-account">
        <div className="cg-section-heading">
          <div><p className="cg-eyebrow">Compte</p><h2 id="profile-account">Informations du compte</h2></div>
          <FiUser aria-hidden="true" />
        </div>
        <dl className="cg-profile-details">
          <div><dt>Nom d’utilisateur</dt><dd>{displayName || 'Non renseigné'}</dd></div>
          <div><dt>Adresse e-mail</dt><dd>{user?.email || 'Non renseignée'}</dd></div>
        </dl>
      </section>

      <section className="cg-profile-links" aria-label="Ma bibliothèque">
        <button className="cg-profile-link-card" onClick={() => navigate('/favoris')}>
          <FiHeart aria-hidden="true" />
          <span><strong>Mes favoris</strong><small>Accéder à vos livres enregistrés</small></span>
          <FiArrowRight aria-hidden="true" />
        </button>
        <button className="cg-profile-link-card" onClick={() => navigate('/bibliotheque')}>
          <FiBookOpen aria-hidden="true" />
          <span><strong>Bibliothèque</strong><small>Parcourir les livres disponibles</small></span>
          <FiArrowRight aria-hidden="true" />
        </button>
      </section>

      <section className="cg-profile-note">
        <p className="cg-eyebrow">Votre espace de lecture</p>
        <h2>Retrouvez la collection Congolibs.</h2>
        <p>Les données d’activité et les lectures récentes ne sont pas encore enregistrées sur votre compte.</p>
        <button className="cg-text-button cg-text-link" onClick={() => navigate('/explore')}>Explorer les livres <FiArrowRight aria-hidden="true" /></button>
      </section>
    </main>
  )
}

export default Profile
