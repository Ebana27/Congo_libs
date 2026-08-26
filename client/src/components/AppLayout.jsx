import { useState } from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import {
  FiBookOpen,
  FiCompass,
  FiHeart,
  FiHome,
  FiUser,
} from 'react-icons/fi'

import Navbar from './Navbar'
import Sidebar from './Sidebar'

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const closeSidebar = () => setSidebarOpen(false)

  return (
    <div className="app-shell">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />

      <div className="app-frame">
        <Navbar
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="app-main">
          <Outlet />
        </main>

        <nav className="mobile-bottom-nav" aria-label="Navigation principale">
          <NavLink to="/" end>
            <FiHome />
            <span>Accueil</span>
          </NavLink>

          <NavLink to="/library">
            <FiBookOpen />
            <span>Bibliothèque</span>
          </NavLink>

          <NavLink to="/explore">
            <FiCompass />
            <span>Explorer</span>
          </NavLink>

          <NavLink to="/favoris">
            <FiHeart />
            <span>Favoris</span>
          </NavLink>

          <NavLink to="/profile">
            <FiUser />
            <span>Profil</span>
          </NavLink>
        </nav>
      </div>
    </div>
  )
}

export default AppLayout
