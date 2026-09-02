import { Routes, Route } from 'react-router-dom'

import AppLayout from './components/AppLayout'

import Home from './pages/Home'
import Explore from './pages/Explore'
import Library from './pages/Library'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Bibliotheque from './pages/Bibliotheque'
import Search from './pages/Search'
import Favorites from './pages/Favorites'
import BookDetails from './pages/BookDetails'
import Reader from './pages/Reader'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLoginPage from './admin/AdminLoginPage'
import AdminDashboardPage from './admin/AdminDashboardPage'
import AdminUsersPage from './admin/AdminUsersPage'

function App() {
  return (
    <Routes>
      <Route path="/connexion" element={<Login />} />
      <Route path="/inscription" element={<Register />} />
      <Route path="/admin" element={<AdminLoginPage />} />
      <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
      <Route path="/admin/users" element={<AdminUsersPage />} />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/library" element={<Library />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/bibliotheque" element={<Bibliotheque />} />
        <Route path="/recherche" element={<Search />} />
        <Route path="/favoris" element={<Favorites />} />
        <Route path="/livre/:id" element={<BookDetails />} />
        <Route path="/lecteur/:id" element={<Reader />} />
      </Route>
    </Routes>
  )
}

export default App
