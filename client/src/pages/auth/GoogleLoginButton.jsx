import { useState } from 'react'
import { useGoogleLogin } from '@react-oauth/google'
import { FiGlobe } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'

export default function GoogleLoginButton({ onError, onSuccess }) {
  const { loginWithGoogle } = useAuth()
  const [busy, setBusy] = useState(false)

  const startGoogleLogin = useGoogleLogin({
    onSuccess: async ({ access_token: accessToken }) => {
      try {
        if (!accessToken) throw new Error('Google n’a pas retourné de jeton.')
        await loginWithGoogle(accessToken)
        onSuccess()
      } catch (error) {
        onError(error.message)
      } finally {
        setBusy(false)
      }
    },
    onError: () => {
      setBusy(false)
      onError('La connexion Google a échoué. Réessayez.')
    },
    onNonOAuthError: () => {
      setBusy(false)
      onError('La fenêtre de connexion Google a été fermée ou bloquée.')
    },
  })

  return (
    <button
      className="cg-button cg-button-secondary cg-secondary-button cg-google-button"
      type="button"
      disabled={busy}
      onClick={() => {
        onError('')
        setBusy(true)
        startGoogleLogin()
      }}
    >
      <FiGlobe aria-hidden="true" />
      {busy ? 'Connexion Google…' : 'Continuer avec Google'}
    </button>
  )
}
