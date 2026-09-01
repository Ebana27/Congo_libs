# API_DOC — Documentation de l'API Congolibs

Documentation de l'API Django REST Framework pour l'application mobile Congolibs.

- **Base URL (local) :** `http://127.0.0.1:8000/api/v1`
- **Sur un téléphone :** `http://<IP_DU_PC>:8000/api/v1` (ex. `http://192.168.1.25:8000/api/v1`)
- **Swagger UI :** `http://127.0.0.1:8000/api/docs/`
- **Schéma OpenAPI :** `http://127.0.0.1:8000/api/schema/`

---

## 1. Authentification

L'API utilise la **session Django** (cookie). Le frontend doit :
- envoyer `credentials: "include"` sur chaque requête (pour envoyer/recevoir les cookies),
- envoyer l'en-tête `X-CSRFToken` sur les requêtes qui modifient des données (POST / PUT / PATCH / DELETE).

### Créer le client API (src/services/api.js)

```js
const API_BASE = "http://127.0.0.1:8000/api/v1";

async function apiRequest(path, { method = "GET", body } = {}) {
  const options = {
    method,
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  };

  // envoi du token CSRF (obligatoire pour POST/PUT/PATCH/DELETE)
  const csrf = getCookie("csrftoken");
  if (csrf) options.headers["X-CSRFToken"] = csrf;

  if (body !== undefined) options.body = JSON.stringify(body);

  const res = await fetch(`${API_BASE}${path}`, options);
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return res.status === 204 ? null : res.json();
}

// lit un cookie (ex. csrftoken) côté client
function getCookie(name) {
  const cookies = document.cookie.split("; ");
  const found = cookies.find((c) => c.startsWith(`${name}=`));
  return found ? decodeURIComponent(found.split("=")[1]) : null;
}

export default apiRequest;
```

> En React Native, il n'y a pas de `document.cookie`. Le cookie CSRF est renvoyé dans la réponse de `/users/login/` et `/users/session/` : on le stocke en mémoire (state) et on le réutilise dans l'en-tête `X-CSRFToken`.

---

## 2. Utilisateurs

### 2.1 Connexion
`POST /users/login/` — public

```js
const data = await apiRequest("/users/login/", {
  method: "POST",
  body: { username: "ebana", password: "motdepasse" },
});
// → { user: { id, username, email, first_name, last_name, telephone, ville } }
```

| Paramètre | Type | Requis |
|-----------|------|--------|
| `username` | string | oui (accepte aussi l'email) |
| `password` | string | oui |

### 2.2 Session courante
`GET /users/session/` — authentifié

```js
const me = await apiRequest("/users/session/");
// → { user: { id, username, email, telephone, ville } }
```

### 2.3 Déconnexion
`POST /users/logout/` — authentifié → réponse `204` (rien à retourner).

### 2.4 Login Google
`POST /users/auth/google/` — public

```js
const data = await apiRequest("/users/auth/google/", {
  method: "POST",
  body: { access_token: "TOKEN_RECU_DE_GOOGLE" },
});
// → { user: {...} }
```

| Paramètre | Type | Requis |
|-----------|------|--------|
| `access_token` | string | oui (token OAuth2 obtenu côté mobile) |

### 2.5 Inscription / mot de passe
Routes standard `dj_rest_auth` sous :
- `POST /users/auth/registration/` — création de compte
- `POST /users/auth/password/reset/` — réinitialisation de mot de passe

---

## 3. Documents

### 3.1 Liste des documents (public)
`GET /documents/`

```js
const docs = await apiRequest("/documents/?type=bac&q=math");
// → { results: [ { id, type, nom, date_creation, delete } ] }
```

| Query param | Type | Description |
|-------------|------|-------------|
| `type` | string | filtre : `livre`, `concours` ou `bac` |
| `q` | string | recherche par nom |

> Le champ `lien_telechargement` **n'apparaît pas** en public. Il n'est renvoyé qu'aux administrateurs. C'est voulu (sécurité).

### 3.2 Détail d'un document (public)
`GET /documents/<uuid>/`

```js
const doc = await apiRequest("/documents/3f9c.../");
// → { id, type, nom, date_creation }
```

### 3.3 Détails spécifiques par type (public)

| Endpoint | Filtres |
|----------|---------|
| `GET /documents/livres/` | `?auteur=` |
| `GET /documents/concours/` | `?matiere=&concours=` |
| `GET /documents/bac/` | `?matiere=&niveau=&serie=` |

```js
const sujets = await apiRequest("/documents/bac/?matiere=Physique&serie=C");
// → { results: [ { document, annee, matiere, niveau, serie } ] }
```

### 3.4 Télécharger un document (authentifié)
`POST /documents/<uuid>/telecharger/`

```js
const res = await fetch(`${API_BASE}/documents/${id}/telecharger/`, {
  method: "POST",
  credentials: "include",
});
const blob = await res.blob();
// enregistrer le blob comme PDF (exposition / partage via cache de fichier)
```

> Le backend **reverse le fichier PDF** depuis Google Drive et crée un enregistrement `Telechargement` (historique). L'application ne doit jamais afficher un lien Drive brut.

### 3.5 Historique de téléchargements (authentifié)
`GET /documents/telechargements/`

```js
const history = await apiRequest("/documents/telechargements/");
// → { results: [ { id, document, date_telechargement } ] }
```

---

## 4. Endpoints administrateur

Accès réservé aux administrateurs (`IsAdminUser`) :

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET / POST | `/documents/` | liste / création |
| GET / PUT-PATCH / DELETE | `/documents/<uuid>/` | détail / modification / suppression (soft-delete) |
| CRUD complet | `/documents/admin/documents/` | gestion incluant `lien_telechargement` |

> Les DELETEs sont des **suppressions logiques** (`delete=true`) : la ligne reste en base.

---

## 5. Codes d'erreur fréquents

| Statut | Signification | À faire |
|--------|---------------|---------|
| `401` | non authentifié | rediriger vers la connexion |
| `403` | droits insuffisants (ou CSRF manquant) | vérifier le header `X-CSRFToken` |
| `404` | ressource introuvable ou supprimée | afficher un message |
| `400` | requête invalide | afficher les erreurs du champ |

## 6. Rappels CORS

Le backend accepte (par défaut) : `http://localhost:3000` et `http://localhost:19006`.
Si tu utilises Expo Go sur un appareil, l'origine affichée par Expo peut différer — le nom de machine doit être ajouté dans `CORS_ALLOWED_ORIGINS` du backend (dans `Backend/config/settings.py`).