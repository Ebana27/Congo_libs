# CONGOLIBS — Connexion API

Le frontend web utilise l'API Django/DRF en ligne :

- API : `https://ledevfreelance.pythonanywhere.com/api/v1`
- Documentation Swagger : `https://ledevfreelance.pythonanywhere.com/api/docs/`
- Schéma OpenAPI : `https://ledevfreelance.pythonanywhere.com/api/schema/`

## Authentification classique

- `POST /users/auth/register-mobile/`
- `POST /users/auth/login-mobile/`
- `POST /users/auth/logout-mobile/`
- `GET /users/auth/user/`

Le token est envoyé avec `Authorization: Token <token>`.

Le frontend ne considère plus une copie locale du profil comme une authentification valide : au démarrage, le token est vérifié par `GET /users/auth/user/`. Les anciens tokens de test sont purgés une fois grâce à une version de session locale. Cela évite qu'un ancien compte reste connecté automatiquement après un déploiement.

## Google

Le frontend est préparé pour Google Identity Services via :

- `POST /users/auth/google/`
- body : `{ "credential": "<Google ID token>", "id_token": "<Google ID token>" }`

Le backend doit vérifier le token Google côté serveur puis renvoyer le même format que `login-mobile/` :

```json
{
  "token": "<token>",
  "user": { "id": 1, "username": "user@gmail.com", "email": "user@gmail.com" }
}
```

Voir `GOOGLE-AUTH-BACKEND.md` pour le contrat complet.

## Documents

- `GET /documents/`
- `GET /documents/{id}/`
- `GET /documents/livres/`
- `GET /documents/livres/{id}/`
- `GET /documents/concours/`
- `GET /documents/concours/{id}/`
- `GET /documents/bac/`
- `GET /documents/bac/{id}/`
- `POST /documents/{id}/telecharger/`
- `GET /documents/telechargements/`

## Déploiement Vercel

Le dossier à déployer est `client/`.

Variables Vercel :

```text
VITE_API_URL=https://ledevfreelance.pythonanywhere.com/api/v1
VITE_GOOGLE_CLIENT_ID=<Web Client ID Google>
VITE_GOOGLE_AUTH_PATH=/users/auth/google/
```

Le fichier `vercel.json` assure le fallback des routes React (`/connexion`, `/inscription`, `/profile`, etc.) vers `index.html`.
