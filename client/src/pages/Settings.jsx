import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FiArrowLeft,
  FiBell,
  FiBookOpen,
  FiCheck,
  FiChevronRight,
  FiGlobe,
  FiLock,
  FiMoon,
  FiSave,
  FiShield,
  FiUser,
} from 'react-icons/fi'

function Settings() {
  const navigate = useNavigate()

  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(true)
  const [privateAccount, setPrivateAccount] = useState(false)

  const [language, setLanguage] = useState('Français')

  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)

    setTimeout(() => {
      setSaved(false)
    }, 2500)
  }

  return (
    <div className="settings-page">

      {/* HEADER */}

      <section className="settings-header">

        <button
          className="settings-back"
          onClick={() => navigate(-1)}
        >
          <FiArrowLeft />
          Retour
        </button>

        <div className="settings-title">

          <span className="section-label">
            CONGOLIBS
          </span>

          <h1>
            Paramètres
          </h1>

          <p>
            Personnalisez votre expérience et gérez
            les préférences de votre compte.
          </p>

        </div>

      </section>


      {/* ACCOUNT */}

      <section className="settings-section">

        <div className="settings-section-title">

          <div className="settings-section-icon">
            <FiUser />
          </div>

          <div>
            <span className="section-label">
              COMPTE
            </span>

            <h2>
              Mon compte
            </h2>
          </div>

        </div>


        <div className="settings-card">

          <button
            className="settings-row"
            onClick={() => navigate('/profile')}
          >

            <div className="settings-row-icon">
              <FiUser />
            </div>

            <div className="settings-row-content">

              <strong>
                Profil
              </strong>

              <span>
                Modifier vos informations personnelles
              </span>

            </div>

            <FiChevronRight className="settings-row-arrow" />

          </button>


          <div className="settings-divider" />


          <button
            className="settings-row"
            onClick={() => {}}
          >

            <div className="settings-row-icon">
              <FiLock />
            </div>

            <div className="settings-row-content">

              <strong>
                Mot de passe
              </strong>

              <span>
                Modifier votre mot de passe
              </span>

            </div>

            <FiChevronRight className="settings-row-arrow" />

          </button>

        </div>

      </section>


      {/* APPEARANCE */}

      <section className="settings-section">

        <div className="settings-section-title">

          <div className="settings-section-icon">
            <FiMoon />
          </div>

          <div>
            <span className="section-label">
              APPARENCE
            </span>

            <h2>
              Apparence
            </h2>
          </div>

        </div>


        <div className="settings-card">

          <div className="settings-row">

            <div className="settings-row-icon">
              <FiMoon />
            </div>

            <div className="settings-row-content">

              <strong>
                Mode sombre
              </strong>

              <span>
                Utiliser le thème sombre de CONGOLIBS
              </span>

            </div>

            <button
              className={
                darkMode
                  ? 'settings-toggle active'
                  : 'settings-toggle'
              }
              onClick={() =>
                setDarkMode(!darkMode)
              }
              aria-label="Activer ou désactiver le mode sombre"
            >
              <span />
            </button>

          </div>

        </div>

      </section>


      {/* NOTIFICATIONS */}

      <section className="settings-section">

        <div className="settings-section-title">

          <div className="settings-section-icon">
            <FiBell />
          </div>

          <div>
            <span className="section-label">
              NOTIFICATIONS
            </span>

            <h2>
              Notifications
            </h2>
          </div>

        </div>


        <div className="settings-card">

          <div className="settings-row">

            <div className="settings-row-icon">
              <FiBell />
            </div>

            <div className="settings-row-content">

              <strong>
                Notifications
              </strong>

              <span>
                Recevoir les nouveautés et recommandations
              </span>

            </div>

            <button
              className={
                notifications
                  ? 'settings-toggle active'
                  : 'settings-toggle'
              }
              onClick={() =>
                setNotifications(!notifications)
              }
              aria-label="Activer ou désactiver les notifications"
            >
              <span />
            </button>

          </div>

        </div>

      </section>


      {/* LANGUAGE */}

      <section className="settings-section">

        <div className="settings-section-title">

          <div className="settings-section-icon">
            <FiGlobe />
          </div>

          <div>
            <span className="section-label">
              LANGUE
            </span>

            <h2>
              Langue de l'application
            </h2>
          </div>

        </div>


        <div className="settings-card">

          <div className="settings-language">

            <div className="settings-row-icon">
              <FiGlobe />
            </div>

            <div className="settings-row-content">

              <strong>
                Langue
              </strong>

              <span>
                Choisissez la langue de CONGOLIBS
              </span>

            </div>

            <select
              value={language}
              onChange={(event) =>
                setLanguage(event.target.value)
              }
            >
              <option>
                Français
              </option>

              <option>
                English
              </option>

              <option>
                Lingala
              </option>
            </select>

          </div>

        </div>

      </section>


      {/* PRIVACY */}

      <section className="settings-section">

        <div className="settings-section-title">

          <div className="settings-section-icon">
            <FiShield />
          </div>

          <div>
            <span className="section-label">
              CONFIDENTIALITÉ
            </span>

            <h2>
              Confidentialité
            </h2>
          </div>

        </div>


        <div className="settings-card">

          <div className="settings-row">

            <div className="settings-row-icon">
              <FiShield />
            </div>

            <div className="settings-row-content">

              <strong>
                Compte privé
              </strong>

              <span>
                Limiter la visibilité de votre activité
              </span>

            </div>

            <button
              className={
                privateAccount
                  ? 'settings-toggle active'
                  : 'settings-toggle'
              }
              onClick={() =>
                setPrivateAccount(!privateAccount)
              }
              aria-label="Activer ou désactiver le compte privé"
            >
              <span />
            </button>

          </div>

        </div>

      </section>


      {/* READING */}

      <section className="settings-section">

        <div className="settings-section-title">

          <div className="settings-section-icon">
            <FiBookOpen />
          </div>

          <div>
            <span className="section-label">
              LECTURE
            </span>

            <h2>
              Préférences de lecture
            </h2>
          </div>

        </div>


        <div className="settings-card">

          <button
            className="settings-row"
            onClick={() => navigate('/library')}
          >

            <div className="settings-row-icon">
              <FiBookOpen />
            </div>

            <div className="settings-row-content">

              <strong>
                Ma bibliothèque
              </strong>

              <span>
                Accéder à vos livres et votre collection
              </span>

            </div>

            <FiChevronRight className="settings-row-arrow" />

          </button>

        </div>

      </section>


      {/* SAVE */}

      <div className="settings-actions">

        <button
          className={
            saved
              ? 'settings-save saved'
              : 'settings-save'
          }
          onClick={handleSave}
        >

          {saved ? (
            <>
              <FiCheck />
              Modifications enregistrées
            </>
          ) : (
            <>
              <FiSave />
              Enregistrer les modifications
            </>
          )}

        </button>

      </div>

    </div>
  )
}

export default Settings