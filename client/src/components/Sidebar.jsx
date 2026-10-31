import { NavLink } from 'react-router-dom'
import {
  FiHome,
  FiBookOpen,
  FiCompass,
  FiHeart,
  FiUser,
  FiSettings,
  FiX,
} from 'react-icons/fi'

function Sidebar({ isOpen, onClose }) {
  const menuItems = [
    {
      name: 'Accueil',
      path: '/',
      icon: <FiHome />,
    },
    {
      name: 'Bibliothèque',
      path: '/bibliotheque',
      icon: <FiBookOpen />,
    },
    {
      name: 'Explorer',
      path: '/explore',
      icon: <FiCompass />,
    },
    {
      name: 'Favoris',
      path: '/favoris',
      icon: <FiHeart />,
    },
  ]

  const accountItems = [
    {
      name: 'Profil',
      path: '/profile',
      icon: <FiUser />,
    },
    {
      name: 'Paramètres',
      path: '/settings',
      icon: <FiSettings />,
    },
  ]

  return (
    <>
      {isOpen && (
        <button
          type="button"
          className="sidebar-overlay"
          onClick={onClose}
          aria-label="Fermer le menu"
        />
      )}

      <aside
        id="primary-sidebar"
        aria-label="Navigation principale"
        className={`sidebar ${
          isOpen ? 'sidebar-open' : ''
        }`}
      >
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">
              <FiBookOpen />
            </div>

            <div>
              <h1>CONGOLIBS</h1>
              <span>
                Bibliothèque numérique
              </span>
            </div>
          </div>

          <button
            className="sidebar-close"
            onClick={onClose}
          >
            <FiX />
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <span className="nav-title">
              Bibliothèque
            </span>

            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `nav-link ${
                    isActive ? 'active' : ''
                  }`
                }
              >
                <span className="nav-icon">
                  {item.icon}
                </span>

                <span>{item.name}</span>
              </NavLink>
            ))}
          </div>

          <div className="nav-section account-section">
            <span className="nav-title">
              Votre espace
            </span>

            {accountItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `nav-link ${
                    isActive ? 'active' : ''
                  }`
                }
              >
                <span className="nav-icon">
                  {item.icon}
                </span>

                <span>{item.name}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="footer-logo">
            <FiBookOpen />
          </div>

          <div>
            <strong>CONGOLIBS</strong>
            <p>
              Lire et apprendre
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar