# AGENTS.md — Application mobile Congolibs (App/)

Instructions pour les agents de code / collaborateurs travaillant sur l'application mobile.

## Projet
@AGENTS : Use './API_DOC.md' for to Access the API documentation.
- **Stack :** Expo SDK 57, React Native 0.86, React 19.2, **JavaScript** (pas de TypeScript).
- **Navigation :** expo-router. Chaque fichier du dossier `app/` est une route.
- **Icônes :** `lucide-react-native`.
- **Safe area :** `react-native-safe-area-context`.

## Structure

```
App/
├── app/                 # écrans + layouts (expo-router)
│   ├── _layout.js       # layout racine (Stack + splash)
│   ├── (tabs)/          # navigation par onglets + header custom
│   │   ├── _layout.js   # onglets (Accueil, Bibliothèque, Découverte, Profil…)
│   │   ├── index.js     # Accueil « Congolibs »
│   │   ├── library.js   # Bibliothèque
│   │   ├── discovery.js # Découverte
│   │   ├── add.js       # Ajouter un document (bientôt disponible)
│   │   └── profil.js    # Profil
│   ├── auth/            # Connexion / inscription / mot de passe
│   ├── onboarding/      # Slides d'introduction (index = splash + check API)
│   ├── document/        # Vue détail d'un document ([id].js)
│   └── *.js             # Écrans autonomes (settings, notifications, help, webview)
├── src/
│   ├── components/      # composants regroupés par feature
│   │   ├── shared/      #   réutilisables (ErrorModal, SuccessModal, Header…)
│   │   ├── books/       #   livraison de contenus (BookCard, Filter, CollectionCard)
│   │   ├── discovery/   #   Découverte (DiscoveryCard)
│   │   ├── profil/      #   Profil (ConfirmModal)
│   │   └── onboarding/  #   Onboarding (OnboardingIllustrations)
│   ├── constants/       # themes.js, fonts.js
│   ├── context/         # React Context (auth, thème…)
│   ├── hooks/           # hooks personnalisés
│   ├── services/        # client API (voir API_DOC.md)
│   └── utils/           # fonctions utilitaires
├── assets/             # organisés par feature
│   ├── fonts/           # polices Poppins / Inter (.ttf)
│   ├── icons/           # icônes de l'app (icon, adaptive…) + external_icons/
│   ├── images/          # images par feature (auth/, home/…)
│   ├── onboarding/      # visuels des slides d'introduction
│   └── splash/          # image du splash screen
└── API_DOC.md           # documentation de l'API backend
```

## Règles de contribution

1. Ne jamais modifier `Backend/` depuis ce projet.
2. Toujours importer les couleurs et la typographie depuis `src/constants/themes.js`.
3. Ajouter un écran = créer un fichier dans `app/` + le déclarer dans le layout concerné.
4. Polices : placer les `.ttf` dans `assets/fonts/` puis les enregistrer via `src/constants/fonts.js`.
5. Icônes : utiliser `lucide-react-native`, taille/color passées en props.
6. Composants : les mettre dans `src/components/<feature>/` (jamais directement dans `src/components/`).
7. Assets : les ranger par feature dans `assets/<feature>/` (ex. `assets/onboarding/`).
8. Pas de commentaires dans le code sauf demande explicite de l'utilisateur.
9. Pas de fichiers générés (`.expo/`, `node_modules/`) : ils sont dans `.gitignore`.

## Commandes

```bash
cd App
npm install       # installer les dépendances (première fois)
npm start         # démarrer Expo
npm run android   # démarrer sur Android
npm run ios       # démarrer sur iOS
npm run web       # démarrer sur le web
npm run icons     # générer toutes les icônes de l'app à partir de assets/images/logo.png
```