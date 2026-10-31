import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'

import './index.css'
import './redesign.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'

const app = (
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

createRoot(document.getElementById('root')).render(
  googleClientId
    ? <GoogleOAuthProvider clientId={googleClientId}>{app}</GoogleOAuthProvider>
    : app,
)