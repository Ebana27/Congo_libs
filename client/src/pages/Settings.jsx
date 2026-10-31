import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiBell, FiBookOpen, FiCheck, FiChevronRight, FiGlobe, FiLock, FiMoon, FiSave, FiShield, FiUser } from 'react-icons/fi'

function PreferenceSwitch({ label, checked, onChange }) {
  return (
    <button
      type="button"
      className="cg-switch"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
    >
      <span />
    </button>
  )
}

function SettingRow({ icon: Icon, title, description, children }) {
  return (
    <div className="cg-setting-row">
      <span className="cg-setting-icon"><Icon aria-hidden="true" /></span>
      <span className="cg-setting-copy"><strong>{title}</strong><small>{description}</small></span>
      {children}
    </div>
  )
}

function Settings() {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(true)
  const [privateAccount, setPrivateAccount] = useState(false)
  const [language, setLanguage] = useState('Français')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2500)
  }

  return (
    <main className="cg-page cg-settings">
      <header className="cg-page-heading cg-page-header">
        <button className="cg-text-button cg-text-link" onClick={() => navigate(-1)}>
          <FiArrowLeft aria-hidden="true" /> Retour
        </button>
        <div>
          <p className="cg-eyebrow">Congolibs · Mon espace</p>
          <h1>Paramètres</h1>
          <p>Choisissez vos préférences pour cette expérience.</p>
        </div>
      </header>

      <section className="cg-settings-section" aria-labelledby="settings-account">
        <div className="cg-section-heading"><div><p className="cg-eyebrow">Compte</p><h2 id="settings-account">Mon compte</h2></div></div>
        <div className="cg-settings-card">
          <button type="button" className="cg-setting-link" onClick={() => navigate('/profile')}>
            <SettingRow icon={FiUser} title="Profil" description="Consulter les informations de votre compte"><FiChevronRight aria-hidden="true" /></SettingRow>
          </button>
          <div className="cg-setting-link">
            <SettingRow icon={FiLock} title="Mot de passe" description="La modification du mot de passe n’est pas encore disponible dans cette interface" />
          </div>
        </div>
      </section>

      <section className="cg-settings-section" aria-labelledby="settings-appearance">
        <div className="cg-section-heading"><div><p className="cg-eyebrow">Affichage</p><h2 id="settings-appearance">Apparence</h2></div></div>
        <div className="cg-settings-card">
          <SettingRow icon={FiMoon} title="Mode sombre" description="Préférence d’affichage">
            <PreferenceSwitch label="Activer ou désactiver le mode sombre" checked={darkMode} onChange={() => setDarkMode((value) => !value)} />
          </SettingRow>
        </div>
      </section>

      <section className="cg-settings-section" aria-labelledby="settings-notifications">
        <div className="cg-section-heading"><div><p className="cg-eyebrow">Notifications</p><h2 id="settings-notifications">Préférences de notification</h2></div></div>
        <div className="cg-settings-card">
          <SettingRow icon={FiBell} title="Nouveautés et recommandations" description="Préférence de réception des notifications">
            <PreferenceSwitch label="Activer ou désactiver les notifications" checked={notifications} onChange={() => setNotifications((value) => !value)} />
          </SettingRow>
        </div>
      </section>

      <section className="cg-settings-section" aria-labelledby="settings-language">
        <div className="cg-section-heading"><div><p className="cg-eyebrow">Langue</p><h2 id="settings-language">Langue de l’application</h2></div></div>
        <div className="cg-settings-card">
          <SettingRow icon={FiGlobe} title="Langue" description="Choisissez la langue de l’interface">
            <label className="cg-visually-hidden" htmlFor="settings-language-select">Langue</label>
            <select id="settings-language-select" className="cg-select cg-control" value={language} onChange={(event) => setLanguage(event.target.value)}>
              <option>Français</option><option>English</option><option>Lingala</option>
            </select>
          </SettingRow>
        </div>
      </section>

      <section className="cg-settings-section" aria-labelledby="settings-privacy">
        <div className="cg-section-heading"><div><p className="cg-eyebrow">Confidentialité</p><h2 id="settings-privacy">Préférences de confidentialité</h2></div></div>
        <div className="cg-settings-card">
          <SettingRow icon={FiShield} title="Compte privé" description="Préférence de visibilité de votre activité">
            <PreferenceSwitch label="Activer ou désactiver le compte privé" checked={privateAccount} onChange={() => setPrivateAccount((value) => !value)} />
          </SettingRow>
        </div>
      </section>

      <section className="cg-settings-section" aria-labelledby="settings-reading">
        <div className="cg-section-heading"><div><p className="cg-eyebrow">Lecture</p><h2 id="settings-reading">Préférences de lecture</h2></div></div>
        <div className="cg-settings-card">
          <button type="button" className="cg-setting-link" onClick={() => navigate('/library')}>
            <SettingRow icon={FiBookOpen} title="Ma bibliothèque" description="Accéder aux livres de la collection"><FiChevronRight aria-hidden="true" /></SettingRow>
          </button>
        </div>
      </section>

      <div className="cg-settings-actions">
        <button type="button" className="cg-button cg-button-primary cg-primary-button" onClick={handleSave}>
          {saved ? <><FiCheck aria-hidden="true" /> Préférences mises à jour</> : <><FiSave aria-hidden="true" /> Appliquer les préférences</>}
        </button>
        {saved && <p className="cg-status-message" role="status">Ces préférences sont appliquées à cette session.</p>}
      </div>
      <p className="cg-settings-note">La synchronisation des préférences avec votre compte n’est pas encore disponible.</p>
    </main>
  )
}

export default Settings
