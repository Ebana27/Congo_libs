import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  FiBell,
  FiBookOpen,
  FiMenu,
  FiSearch,
  FiUser,
} from 'react-icons/fi'

function Navbar({ onMenuClick }) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button
          className="menu-button"
          onClick={onMenuClick}
          aria-label="Ouvrir le menu"
        >
          <FiMenu />
        </button>

        <button
          className="mobile-logo"
          onClick={() => navigate('/')}
        >
          <span className="mobile-logo-icon">
            <FiBookOpen />
          </span>
          <span>CONGOLIBS</span>
        </button>
      </div>

      <button
        className="navbar-search"
        onClick={() => navigate('/recherche')}
      >
        <FiSearch />
        <span>Rechercher un livre, un auteur...</span>
      </button>

      <div className="navbar-actions">
        <button
          className="navbar-icon-button navbar-search-mobile"
          onClick={() => navigate('/recherche')}
          aria-label="Rechercher"
        >
          <FiSearch />
        </button>

        <button
          className="navbar-icon-button"
          aria-label="Notifications"
        >
          <FiBell />
          <span className="notification-dot" />
        </button>

        <button
          className="profile-button"
          onClick={() => navigate('/profile')}
        >
          <span className="profile-avatar">
            <FiUser />
          </span>
          <span>{user?.name || 'Mon profil'}</span>
        </button>

        <button
          className="navbar-logout"
          onClick={logout}
          aria-label="Se déconnecter"
        >
          Déconnexion
        </button>
      </div>
    </header>
  )
}

export default Navbar
