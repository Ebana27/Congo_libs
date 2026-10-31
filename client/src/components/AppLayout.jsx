import { useState } from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import {
  FiBookOpen,
  FiHeart,
  FiHome,
  FiSearch,
  FiUser,
} from 'react-icons/fi'

import Navbar from './Navbar'
import Sidebar from './Sidebar'

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const closeSidebar = () => setSidebarOpen(false)

  return (
    <div className="app-shell">
      <a className="cg-skip-link" href="#main-content">
        Aller au contenu
      </a>

      <Sidebar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />

      <div className="app-frame">
        <Navbar
          isSidebarOpen={sidebarOpen}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="app-main" id="main-content" tabIndex="-1">
          <Outlet />
        </main>

        <nav className="mobile-bottom-nav" aria-label="Navigation principale">
          <NavLink to="/" end aria-label="Accueil">
            <FiHome />
            <span>Accueil</span>
          </NavLink>

          <NavLink to="/bibliotheque">
            <FiBookOpen />
            <span>Bibliothèque</span>
          </NavLink>

          <NavLink to="/recherche">
            <FiSearch />
            <span>Recherche</span>
          </NavLink>

          <NavLink to="/favoris">
            <FiHeart />
            <span>Favoris</span>
          </NavLink>

          <NavLink to="/profile" aria-label="Profil">
            <FiUser />
            <span>Profil</span>
          </NavLink>
        </nav>
      </div>
    </div>
  )
}

export default AppLayout
