import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''
const GOOGLE_SCRIPT = 'https://accounts.google.com/gsi/client'

function GoogleSignInButton({ mode = 'signin' }) {
  const containerRef = useRef(null)
  const { loginGoogle } = useAuth()
  const { language } = useLanguage()
  const [error, setError] = useState('')
  const [ready, setReady] = useState(Boolean(window.google?.accounts?.id))

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return
    if (window.google?.accounts?.id) {
      setReady(true)
      return
    }

    const existing = document.querySelector(`script[src="${GOOGLE_SCRIPT}"]`)
    const script = existing || document.createElement('script')
    if (!existing) {
      script.src = GOOGLE_SCRIPT
      script.async = true
      script.defer = true
      document.head.appendChild(script)
    }

    const onLoad = () => setReady(true)
    script.addEventListener('load', onLoad)
    return () => script.removeEventListener('load', onLoad)
  }, [])

  useEffect(() => {
    if (!ready || !GOOGLE_CLIENT_ID || !containerRef.current || !window.google?.accounts?.id) return

    let cancelled = false
    const handleCredential = async (response) => {
      if (cancelled) return
      setError('')
      if (!response?.credential) {
        setError(language === 'ln' ? 'Google epesi kopesa nzela te.' : language === 'en' ? 'Google did not return a credential.' : 'Google n’a pas renvoyé de justificatif.')
        return
      }
      const result = await loginGoogle(response.credential)
      if (!result.ok && !cancelled) setError(result.message)
    }

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleCredential,
      auto_select: false,
      cancel_on_tap_outside: true,
      context: mode === 'signup' ? 'signup' : 'signin',
    })

    containerRef.current.innerHTML = ''
    window.google.accounts.id.renderButton(containerRef.current, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      width: Math.min(380, containerRef.current.clientWidth || 380),
      text: mode === 'signup' ? 'signup_with' : 'signin_with',
      shape: 'rectangular',
      logo_alignment: 'left',
      locale: language === 'ln' ? 'fr' : language,
    })

    return () => { cancelled = true }
  }, [ready, mode, loginGoogle, language])

  if (!GOOGLE_CLIENT_ID) {
    return (
      <div className="google-auth-unavailable">
        <strong>Google</strong>
        <span>
          {language === 'en'
            ? 'Add VITE_GOOGLE_CLIENT_ID to activate Google authentication.'
            : language === 'ln'
              ? 'Bakisa VITE_GOOGLE_CLIENT_ID mpo kofungola bokɔti ya Google.'
              : 'Ajoutez VITE_GOOGLE_CLIENT_ID pour activer l’authentification Google.'}
        </span>
      </div>
    )
  }

  return (
    <div className="google-auth-wrap">
      <div ref={containerRef} className="google-auth-button" />
      {error && <div className="auth-error google-auth-error">{error}</div>}
    </div>
  )
}

export default GoogleSignInButton
