# PLAN DRM — Congolibs

**Statut :** Plan validé — à ne PAS implémenter aujourd'hui.
**Périmètre actuel :** protection & lecture sur **Android natif** (application Expo).
**Plus tard :** iOS natif (même architecture, Keychain + `react-native-pdf` supporté), site web / PWA gérés par l'équipe site (DRM type YouTube = Widevine / FairPlay côté navigateur, hors périmètre Expo).
**Contrainte :** aucun code du dossier `Backend/` n'est modifié depuis ce projet. L'équipe serveur implémente le contrat d'API §6.

---

## 1. Objectif & modèle de menace

### Objectif
Empêcher qu'un document téléchargé puisse être utilisé hors du cadre défini :
- être lu **sans licence valide** (compte inconnu, abonnement expiré, document révoqué),
- être extrait du disque et **lu pour toujours** hors de l'application,
- être **diffusé** à d'autres personnes sans contrôle.

### Modèle de menace (réaliste)
- L'attaque la plus simple : copier les fichiers du stockage de l'app → les ouvrir ailleurs.
- L'attaque la plus avancée : **décompiler l'APK** (le JS packagé est extractible), extraire les clés, réassembler le flux de déchiffrement, ou dump la mémoire pendant la lecture.
- « Aucun hack possible » **n'existe pas** sur mobile. Un fichier doit être déchiffré quelque part au moment de la lecture. L'objectif est de rendre l'attaque **coûteuse** (root + reverse engineering + dump mémoire), pas gratuite.

### Ce que garantit le plan
- Au repos : le PDF n'existe **jamais en clair** sur disque.
- Enforcement : impossible d'ouvrir sans licence **émise par le serveur** pour *ce* compte et *ce* document.
- Révocabilité : une licence peut être invalidée, une clé de document peut être révoquée.
- Traçage : filigrane (eau-mark) par utilisateur, anti-capture d'écran.

---

## 2. Architecture (2 couches)

### 2.1 Couche serveur (Backend Congolibs) — équipe Plamedi
- Délivrance des **licences signées** (§5, §6).
- (Futur) envoi de PDF **filigranés** par utilisateur lors du téléchargement.
- (Futur) révocation de licence / blacklist.

### 2.2 Couche client (app Expo, Android)
- Chiffrement AES-GCM des documents téléchargés (`expo-crypto`, SDK 57).
- Clé maître non exportable dans le **Android Keystore** (`expo-secure-store`).
- Vérification de licence + expiration **avant** chaque ouverture.
- Lecteur natif `react-native-pdf` avec UI custom, anti-capture d'écran.

---

## 3. Format du fichier protégé `.cbl`

Chaque document téléchargé est stocké dans le dossier privé de l'app :
`<dossier privé>/congolibs/docs/<doc_id>.cbl`

```
┌────────────────────────────────────────────────────┐
│  EN-TÊTE (JSON, non chiffré)                     │
│  magic: "CONGOLIBS-ENC"   version: 1              │
│  alg: "AES-256-GCM"                              │
│  iv: (12 octets, base64)                          │
│  wrappedKey: clé du document chiffrée par la      │
│              clé maître (base64)                  │
├────────────────────────────────────────────────────┤
│  CORPS : ciphertext AES-GCM (PDF brut chiffré)   │
└────────────────────────────────────────────────────┘
```

- Chaque document a sa **propre clé aléatoire** (rotation/ révocation indépendante possible).
- La clé du document est **enveloppée** par la clé maître de l'appareil → un dump des fichiers seuls ne suffit pas.
- Le PDF brut est supprimé **après** chiffrement (jamais laissé sur disque).

---

## 4. Cycle de vie des clés

| Clé | Stockage | Usage |
| --- | --- | --- |
| Clé maître AES-256 par installation | Android Keystore (via `expo-secure-store`) | Chiffre/déchiffre les clés de documents |
| Clé AES-256 par document | Dans l'en-tête `.cbl`, enveloppée | Chiffre le PDF |
| Clé privée de signature de licence | **Serveur uniquement** | Signe les licences (RS256) |
| Clé publique de signature | Embarquée dans l'APK | Vérifie les licences côté client |

- Perte de la clé maître = documents illisibles (comportement assumé ; la licence seule ne rend pas le PDF lisible).
- Révocation d'un document = le serveur n'émet plus de licence → illisible.
- La clé privée Ne Quitte Jamais le serveur → impossible de forger une licence même en décompilant l'app.

---

## 5. Format de la licence

### 5.1 Obtention
```
POST /api/v1/documents/{id}/licence/   →   200
{
  "licence": "<JWT RS256>"
}
```

### 5.2 Payload (claims)
```json
{
  "jti": "lic-9a8b...",
  "doc_id": "9f3c017e-5406-413b-9b42-...",
  "user_id": 12,
  "type_document": "livre",
  "droits": "achat",
  "issued_at": "2026-09-13T10:00:00Z",
  "expires_at": null,
  "watermark": "user@mail.com",
  "nb_appareils": 1
}
```

### 5.3 Droits d'accès (= leviers de monétisation)
| `droits` | `expires_at` | Comportement |
| --- | --- | --- |
| `gratuit` | null ou courte date | accès offert (marketing, aperçu) |
| `apercu` | imposée | lecture limitée (ex. 10 premières pages) — à implémenter via un PDF tronqué ou un flag lecteur |
| `achat` | null | perpétuel, lié au compte (relogin OK) |
| `abonnement` | date = fin d'abonnement | re-validation au serveur ; expiration = illisible |

### 5.4 Vérification côté client (avant chaque ouverture)
1. Signature **RS256** vérifiée avec la clé publique embarquée (rejet si invalide → fichier altéré/forgé).
2. `user_id` == utilisateur connecté.
3. `doc_id` == document demandé.
4. `expires_at` non dépassé.
5. `nb_appareils` (optionnel) contrôlé côté serveur.

Signature recommandée : **RS256** (clé privée serveur, publique dans l'app). HS256 est à éviter (secret extractible depuis l'APK). Détail d'implémentation de la vérif en JS (lib `jose`/crypto native) à trancher à l'implémentation.

---

## 6. Contrat API backend

À implémenter par l'équipe serveur (Backend Congolibs). Base : `https://ledevfreelance.pythonanywhere.com/api/v1`

### `POST /documents/{id}/licence/`
- **Auth :** `Authorization: Token <token>` (obligatoire)
- **Réponses**
  - `200` → `{ "licence": "<JWT>" }`
  - `401` → token absent/invalide/expiré
  - `403` → compte sans droit (pas d'achat, pas d'abonnement actif)
  - `404` → document inconnu ou soft-deleted
  - `402` → paiement requis / renouvellement d'abonnement attendu
  - `410` → licence révoquée (`jti` blacklisté) / document retiré
- **Politique de révocation (recommandée) :** blacklist des `jti` + horodatage `revoked_at` consultés le temps de vérifier l'expiration.

### Évolution de `POST /documents/{id}/telecharger/`
- (Option 1) Restreindre l'accès : seul un détenteur de licence `achat`/`abonnement` reçoit le PDF (sinon 403/402).
- (Option 2) Activer le **filigrane** : le serveur sert un PDF sur-imprimé (`watermark`, email/id utilisateur) — traçage forensique en cas de fuite.

---

## 7. Flux de lecture (Android)

1. Écran liste (« Documents les plus connus », bibliothèque…) → tap « Lire ».
2. **Licence :** lire la licence en cache (`<dossier privé>/congolibs/licenses/<doc_id>.lic`, chiffrée) → si absente/expirée/invalide → `POST /documents/{id}/licence/`.
3. Si la licence manquante est **définitivement refusée** (402/403/410) → écran de blocage (abonnement requis / document retiré), pas d'ouverture.
4. **Fichier :** si `<doc_id>.cbl` absent → télécharger via `telecharger/` puis chiffrer (§3).
5. **Déchiffrer en mémoire** : clé maître (Keystore) → clé document → ciphertext → PDF brut **en mémoire**.
6. Écrire le PDF brut dans `Paths.cache` (temporaire).
7. `expo-screen-capture` `preventScreenCapture` → ouvrir le lecteur (`react-native-pdf`, UI custom : retour, titre, page X/Y, zoom, pagination).
8. **Fermeture :** supprimer le PDF temporaire + `allowScreenCapture`.

Jamais de PDF en clair en dehors du tampon cache éphémère.

---

## 8. Anti-capture & filigrane
- **Android :** `expo-screen-capture` (FLAG_SECURE) pendant la lecture — bloque captures d'écran et enregistrements.
- **iOS (plus tard) :** impossible de bloquer entièrement les captures ; mesures d'appoint (masquer l'app dans le fond, filigrane).
- **Filigrane (futur) :** PDF servi avec `watermark` = email/id utilisateur → dissuasion + traçage.

---

## 9. Lecteur intégré

- **Choix validé :** `react-native-pdf` v7 + `react-native-blob-util` + config plugins Expo
  (`@config-plugins/react-native-pdf`, `@config-plugins/react-native-blob-util`).
- Pinch/zoom, double-tap zoom, pagination verticale/horizontale, saut de page — natif.
- UI custom autour : barre de retour, titre, indicateur « page X/Y », zoom, luminosité.
- **Conséquence :** du code natif → **build de développement requis** (`npm run android`) ; plus de lecture en Expo Go.

---

## 10. Plateformes

| Cible | Statut | Notes |
| --- | --- | --- |
| Android natif | **Implanté en priorité** | Keystore, FLAG_SECURE, `react-native-pdf` |
| iOS natif | Plus tard, même code | `expo-secure-store` = Keychain ; `react-native-pdf` supporté ; anti-capture limité |
| Web / PWA | Hors périmètre Expo | Équipe site : DRM type YouTube (Widevine/FairPlay). Une PWA ne peut pas exécuter `expo-crypto`/`react-native-pdf` natifs |

---

## 11. Roadmap

| Étape | Contenu | Dépend de |
| --- | --- | --- |
| 0 | Contrat API validé par l'équipe serveur (implanté §6) | Plamedi / équipe Backend |
| 1 | `expo-crypto`, `expo-screen-capture`, `react-native-pdf` + config plugins | — |
| 2 | Module `documentCrypto` : clé maître Keystore, chiffrement/déchiffrement `.cbl` | — |
| 3 | Module `license` : demande, vérif RS256, cache, expiration | Étape 0 |
| 4 | `downloadDocument` → télécharge + chiffre + supprime le brut | — |
| 5 | Écran lecteur custom + nettoyage du tampon + anti-capture | — |
| 6 | Branchement « Télécharger / Lire » dans la fiche document et les listes | Étapes 2-5 |
| 7 | (Futur) filigrane serveur, PDF tronqué pour `apercu`, révocation | Équipe Backend |

---

## 12. Risques & limites assumées
- Décompilation du JS : le flux peut être étudié → on compense par la licence **serveur** (RS256) et les clés Keystore.
- Dump mémoire durant la lecture : possible sur appareil rooté ; pas de parade parfaite (compromis inévitable), le filigrane limite la diffusion.
- Perte/restauration d'appareil : les clés Keystore ne migrent pas → redownload + nouvelle licence requise (comportement à documenter).
- Verrouillage utilisateur : une licence est liée à `user_id` → un compte partagé reste vulnérable (politique produit à définir, `nb_appareils`).

---

## 13. Pistes de monétisation (Congo-Brazzaville) — section de travail

Adossées aux types de licence (§5.3), à compléter pendant la réflexion :
- **Achat à l'unité** (`achat`) : paiement mobile (Mobile Money / M-Pesa / carte) pour un document.
- **Abonnement** (`abonnement`) : accès illimité mensuel/trimestriel à une catégorie (livres, concours, bac).
- **Aperçu payant** (`apercu`) : premières pages gratuites → achat de la suite.
- **Quota gratuit** : X documents gratuits/année pour acquisition.
- **Pack écoles/concours** (`droits` étendus, licence « groupe ») : B2B, licence liée à un établissement.
- **Annonces** en complément pour la partie gratuite (à équilibrer avec l'expérience lecteur).

---

## 14. Points à valider (équipe serveur / Plamedi)
- Signature : RS256 retenu (index/implémentation JS précis à choisir) — ou JWT existant si déjà en place.
- Endpoint `licence/` (§6) : dates, codes erreur, politique révocation.
- Processus de (re)signature : clé privée unique ou par type de licence.
- Filigrane : activer maintenant ou en v2.
- Politique multi-appareils (`nb_appareils`) : valeur réelle en prod.
- Comportement hors-ligne : le PDF reste lisible jusqu'à expiration de la licence ; ré-ouverture hors-ligne acceptée ?