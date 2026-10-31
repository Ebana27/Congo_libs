import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  FiBookOpen,
  FiMenu,
  FiSearch,
  FiUser,
} from 'react-icons/fi'

function Navbar({ isSidebarOpen, onMenuClick }) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  return (
    <header className="navbar cg-topbar">
      <div className="navbar-left">
        <button
          className="menu-button"
          onClick={onMenuClick}
          aria-label="Ouvrir le menu"
          aria-expanded={isSidebarOpen}
          aria-controls="primary-sidebar"
        >
          <FiMenu />
        </button>

        <button
          className="mobile-logo"
          onClick={() => navigate('/')}
          aria-label="Congolibs, accueil"
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
        aria-label="Rechercher dans la bibliothèque"
      >
        <FiSearch />
        <span>Rechercher un livre, un auteur ou une matière</span>
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
          className="profile-button"
          onClick={() => navigate('/profile')}
          aria-label="Ouvrir mon profil"
        >
          <span className="profile-avatar">
            <FiUser />
          </span>
          <span>{user?.name || 'Mon profil'}</span>
        </button>

        <button
          className="navbar-logout"
          onClick={logout}
        >
          Déconnexion
        </button>
      </div>
    </header>
  )
}

export default Navbar
