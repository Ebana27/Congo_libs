# CongoLibs — App mobile

Client mobile minimaliste (React Native + Expo Router, JavaScript) pour appeler l'API CongoLibs.

## Démarrer

```bash
npm install
npm run android   # ou npm run ios / npm start
```

## API

L'URL de l'API est définie dans `src/app/index.jsx` (`API_URL`, par défaut `http://localhost:8000`).
Elle peut être surchargée via la variable d'environnement `EXPO_PUBLIC_API_URL`.

## Structure

- `src/app/` — pages (une seule page : `index.jsx`)
- `assets/` — icônes et splash screen
- `example/` — ancien template Expo (ignoré par git, conservé en référence locale)
