# CONGOLIBS — contrat API pour Google Auth

Le frontend utilise Google Identity Services et envoie le `credential` Google au backend.

## Endpoint attendu

`POST /api/v1/users/auth/google/`

Body JSON :

```json
{
  "credential": "<Google ID token>",
  "id_token": "<Google ID token>"
}
```

Le backend doit :

1. Vérifier la signature du token avec Google (ne jamais faire confiance aux données décodées uniquement dans le navigateur).
2. Vérifier `aud` avec le Web Client ID configuré dans Google Cloud.
3. Récupérer au minimum `sub`, `email`, `email_verified`, `name` / `given_name`.
4. Refuser un compte dont l'adresse n'est pas vérifiée.
5. Chercher l'utilisateur par son e-mail ou par son identifiant Google.
6. Créer le compte s'il n'existe pas encore, ou réutiliser le compte existant.
7. Retourner le même format de session que `login-mobile/` :

```json
{
  "token": "<token DRF>",
  "user": {
    "id": 1,
    "username": "prenom.nom@gmail.com",
    "email": "prenom.nom@gmail.com",
    "first_name": "Prenom"
  }
}
```

Le frontend accepte également les clés `key`, `access` ou `auth_token` pour le jeton afin de rester compatible avec différentes implémentations DRF.

## Important pour le déploiement Vercel

Définir dans les variables d'environnement du projet :

- `VITE_API_URL=https://ledevfreelance.pythonanywhere.com/api/v1`
- `VITE_GOOGLE_CLIENT_ID=<Web Client ID Google>`
- `VITE_GOOGLE_AUTH_PATH=/users/auth/google/`

Dans Google Cloud, ajouter le domaine Vercel de CONGOLIBS dans les origines JavaScript autorisées.

Sans `VITE_GOOGLE_CLIENT_ID`, le bouton Google reste visible mais indique clairement que la configuration est manquante au lieu de simuler une connexion.
