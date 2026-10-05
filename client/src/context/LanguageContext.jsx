import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const LANGUAGE_KEY = 'congolibs_language'
const DEFAULT_LANGUAGE = 'fr'

const translations = {
  en: {
    'Accueil': 'Home', 'Bibliothèque': 'Library', 'Explorer': 'Explore', 'Favoris': 'Favorites',
    'Profil': 'Profile', 'Paramètres': 'Settings', 'Déconnexion': 'Log out', 'Mon profil': 'My profile',
    'Bibliothèque numérique': 'Digital library', 'Votre bibliothèque partout.': 'Your library everywhere.',
    'MENU': 'MENU', 'COMPTE': 'ACCOUNT', 'Rechercher un livre, un auteur...': 'Search for a book, an author...',
    'Télécharger': 'Download', 'Retour': 'Back', 'Enregistrer les modifications': 'Save changes',
    'Modifications enregistrées': 'Changes saved', 'Paramètres': 'Settings', 'Langue': 'Language',
    "Choisissez la langue de CONGOLIBS": 'Choose the CONGOLIBS language', 'Langue de l’application': 'Application language',
    'Notifications': 'Notifications', 'Recevoir les nouveautés et recommandations': 'Receive news and recommendations',
    'Confidentialité': 'Privacy', 'Compte privé': 'Private account', 'Limiter la visibilité de votre activité': 'Limit the visibility of your activity',
    'Lecture': 'Reading', 'Préférences de lecture': 'Reading preferences', 'Ma bibliothèque': 'My library',
    'Accéder à vos livres et votre collection': 'Access your books and collection', 'Mon compte': 'My account',
    'Modifier vos informations personnelles': 'Edit your personal information', 'Mot de passe': 'Password',
    'Modifier votre mot de passe': 'Change your password', 'Apparence': 'Appearance',
    'BIENVENUE': 'WELCOME', 'Content de vous revoir.': 'Welcome back.',
    'Connectez-vous pour retrouver votre bibliothèque et continuer vos lectures.': 'Sign in to find your library and continue reading.',
    'Adresse e-mail': 'Email address', 'Mot de passe': 'Password', 'Votre mot de passe': 'Your password',
    'Se connecter': 'Sign in', 'Connexion...': 'Signing in...', 'Créer un compte': 'Create an account',
    'Vous n’avez pas encore de compte ?': 'Do not have an account yet?', 'Inscription': 'Sign up',
    'Prénom et nom': 'First and last name', 'Nom complet': 'Full name', 'Confirmer le mot de passe': 'Confirm password',
    'Créer mon compte': 'Create my account', 'Création...': 'Creating...', 'Déjà un compte ?': 'Already have an account?',
    'Apprendre': 'Learn', 'Progresser': 'Improve', 'Réviser': 'Review', 'Ressources en ligne': 'Online resources',
    'Recherche API': 'API search', 'Commencer maintenant': 'Start now', 'Découvre les': 'Discover',
    'ressources': 'resources', 'livres API': 'API books', 'connectée en ligne': 'connected online',
    'Rechercher': 'Search', 'Tous les livres': 'All books', 'Voir tout': 'See all',
    'Chargement…': 'Loading…', 'Aucun livre': 'No books', 'Aucun résultat': 'No results',
    'DÉCOUVRIR': 'DISCOVER', 'Explorer par catégorie': 'Explore by category', 'Livres disponibles': 'Available books',
    'Recherche': 'Search', 'Résultats': 'Results', 'Retour à la bibliothèque': 'Back to library',
    'Téléchargement…': 'Downloading…', 'Lire / consulter': 'Read / view',
    'Français': 'French', 'English': 'English', 'Lingala': 'Lingala',
  },
  ln: {
    'Accueil': 'Ndako', 'Bibliothèque': 'Libulu ya mikanda', 'Explorer': 'Tala', 'Favoris': 'Oyo olingaka',
    'Profil': 'Profil', 'Paramètres': 'Bobongisi', 'Déconnexion': 'Bima', 'Mon profil': 'Profil na ngai',
    'Bibliothèque numérique': 'Libulu ya mikanda na internet', 'Votre bibliothèque partout.': 'Libulu na yo bisika nyonso.',
    'MENU': 'MENU', 'COMPTE': 'KONTI', 'Rechercher un livre, un auteur...': 'Luka buku to mokomi...',
    'Télécharger': 'Tinda na masini', 'Retour': 'Zonga', 'Enregistrer les modifications': 'Bomba mbongwana',
    'Modifications enregistrées': 'Mbongwana ebombami', 'Paramètres': 'Bobongisi', 'Langue': 'Lokota',
    "Choisissez la langue de CONGOLIBS": 'Pona lokota ya CONGOLIBS', 'Langue de l’application': 'Lokota ya application',
    'Notifications': 'Mayebisi', 'Recevoir les nouveautés et recommandations': 'Zwa bansango ya sika mpe makanisi',
    'Confidentialité': 'Bokɛngi ya makambo', 'Compte privé': 'Konti ya sekele', 'Limiter la visibilité de votre activité': 'Kokitisa bato oyo bamonaka misala na yo',
    'Lecture': 'Kotanga', 'Préférences de lecture': 'Bobongisi ya kotanga', 'Ma bibliothèque': 'Libulu na ngai',
    'Accéder à vos livres et votre collection': 'Kokoma na mikanda mpe biloko na yo', 'Mon compte': 'Konti na ngai',
    'Modifier vos informations personnelles': 'Bongisa makambo na yo', 'Mot de passe': 'Mot de passe',
    'Modifier votre mot de passe': 'Bongisa mot de passe na yo', 'Apparence': 'Lolenge ya komonana',
    'BIENVENUE': 'BOYOKANI', 'Content de vous revoir.': 'Esengo ya komona yo lisusu.',
    'Connectez-vous pour retrouver votre bibliothèque et continuer vos lectures.': 'Kota mpo na kozwa lisusu mikanda na yo mpe kokoba kotanga.',
    'Adresse e-mail': 'Adrɛsi ya e-mail', 'Votre mot de passe': 'Mot de passe na yo',
    'Se connecter': 'Kota', 'Connexion...': 'Kokota...', 'Créer un compte': 'Sala konti',
    'Vous n’avez pas encore de compte ?': 'Ozali naino na konti te ?', 'Inscription': 'Komikomisa',
    'Nom complet': 'Kombo mobimba', 'Confirmer le mot de passe': 'Kondimisa mot de passe',
    'Créer mon compte': 'Sala konti na ngai', 'Création...': 'Kosala...', 'Déjà un compte ?': 'Ozali na konti déjà ?',
    'Apprendre': 'Koyekola', 'Progresser': 'Kokola', 'Réviser': 'Kozongela boyekoli', 'Ressources en ligne': 'Biloko na internet',
    'Recherche API': 'Boluki na API', 'Commencer maintenant': 'Bandá sikoyo', 'Rechercher': 'Luka',
    'Tous les livres': 'Mikanda nyonso', 'Voir tout': 'Tala nyonso', 'Chargement…': 'Ezali kokɔta…',
    'Aucun livre': 'Buku moko te', 'Aucun résultat': 'Eyano moko te', 'Explorer par catégorie': 'Tala na biteni',
    'Livres disponibles': 'Mikanda oyo ezali', 'Retour à la bibliothèque': 'Zonga na libulu', 'Téléchargement…': 'Ezali kotinda…',
    'Lire / consulter': 'Tanga / tala', 'Français': 'Français', 'English': 'English', 'Lingala': 'Lingala',
  },
}

const LanguageContext = createContext(null)

const reverseTranslations = Object.entries(translations).reduce((all, [language, dictionary]) => {
  Object.entries(dictionary).forEach(([source, translated]) => {
    if (translated !== source) all[translated] = source
  })
  return all
}, {})

function translateText(text, language) {
  const source = translations[language]?.[text] ? text : (reverseTranslations[text] || text)
  return translations[language]?.[source] || source
}

function translateDom(language) {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  const nodes = []
  while (walker.nextNode()) nodes.push(walker.currentNode)
  nodes.forEach((node) => {
    const value = node.nodeValue
    const trimmed = value.trim()
    if (!trimmed || node.parentElement?.closest('script,style,textarea')) return
    const translated = translateText(trimmed, language)
    if (translated !== trimmed) node.nodeValue = value.replace(trimmed, translated)
  })
  document.documentElement.lang = language === 'ln' ? 'ln' : language
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => localStorage.getItem(LANGUAGE_KEY) || DEFAULT_LANGUAGE)

  useEffect(() => {
    localStorage.setItem(LANGUAGE_KEY, language)
    translateDom(language)
    const observer = new MutationObserver(() => translateDom(language))
    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [language])

  const value = useMemo(() => ({
    language,
    setLanguage,
    t: (text) => translateText(text, language),
    languages: [
      { value: 'fr', label: 'Français' },
      { value: 'en', label: 'English' },
      { value: 'ln', label: 'Lingala' },
    ],
  }), [language])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage doit être utilisé dans LanguageProvider')
  return context
}
