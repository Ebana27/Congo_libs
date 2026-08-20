# Plateforme de recherche et téléchargement de documents

## Présentation

Application web permettant de rechercher, consulter et télécharger différents types de documents PDF, notamment :

* Livres
* Sujets de concours
* Sujets du baccalauréat

Le projet est développé avec une architecture basée sur Docker afin de rendre l'environnement de développement reproductible et facilement déployable.

> **État actuel du projet :** configuration de l'environnement Docker et de la base de données PostgreSQL.

---

## Technologies

### Actuellement

* Docker
* Docker Compose
* PostgreSQL

### À venir

* Python
* Django
* Django REST Framework
* Authentification
* Gestion des commandes
* Gestion des paiements
* Gestion des téléchargements
* Tests automatisés
* Déploiement

---

## Prérequis

Avant de lancer le projet, il est nécessaire d'avoir installé :

* Docker
* Docker Compose

Vérifier l'installation :

```bash
docker --version
docker compose version
```

---

## Installation

Cloner le dépôt :

```bash
git clone <URL_DU_DEPOT>
cd <NOM_DU_PROJET>
```

Créer et configurer le fichier `.env` à partir du modèle fourni :

```bash
cp .env.example .env
```

Puis renseigner les variables nécessaires.

---

## Configuration PostgreSQL

PostgreSQL est exécuté dans un conteneur Docker.

Les paramètres de connexion sont définis à travers les variables d'environnement afin de ne pas enregistrer directement les informations sensibles dans le code source.

Exemple de configuration :

```env
POSTGRES_DB=nom_de_la_base
POSTGRES_USER=nom_utilisateur
POSTGRES_PASSWORD=mot_de_passe
POSTGRES_HOST=db
POSTGRES_PORT=5432
```

> Le fichier `.env` contenant les informations sensibles ne doit pas être envoyé sur GitHub.

---

## Lancement avec Docker

Construire les images :

```bash
docker compose build
```

Lancer les conteneurs :

```bash
docker compose up
```

Pour lancer les conteneurs en arrière-plan :

```bash
docker compose up -d
```

Vérifier les conteneurs actifs :

```bash
docker compose ps
```

Arrêter les conteneurs :

```bash
docker compose down
```

---

## Architecture actuelle

L'environnement initial repose sur deux services principaux :

```text
┌──────────────────────┐
│       Docker         │
│                      │
│  ┌────────────────┐  │
│  │ Django / App   │  │
│  └───────┬────────┘  │
│          │            │
│          ▼            │
│  ┌────────────────┐  │
│  │   PostgreSQL   │  │
│  └────────────────┘  │
│                      │
└──────────────────────┘
```

Le service Django communiquera avec PostgreSQL à travers le réseau Docker.

---

## Structure du projet

La structure initiale prévue est :

```text
project/
│
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
├── .gitignore
├── .env
├── .env.example
├── requirements.txt
├── README.md
│
├── manage.py
│
└── config/
    ├── settings.py
    ├── urls.py
    ├── asgi.py
    └── wsgi.py
```

Cette structure évoluera au fur et à mesure du développement.

---

## Développement

Le développement est réalisé sur une branche dédiée afin de ne pas modifier directement la branche principale.

Branche principale :

```text
main
```

Branche de développement :

```text
backend
```

Les nouvelles fonctionnalités sont développées et testées sur `backend` avant d'être intégrées à `main`.

---

## Roadmap

### Phase 1 — Infrastructure

* [x] Initialisation du dépôt Git
* [ ] Configuration de Docker
* [ ] Configuration de Docker Compose
* [ ] Création de l'image Django
* [ ] Configuration de PostgreSQL
* [ ] Connexion Django ↔ PostgreSQL

### Phase 2 — Base de données

* [ ] Création des modèles Django
* [ ] Création des migrations
* [ ] Création des relations entre les modèles
* [ ] Vérification de la base de données

### Phase 3 — API

* [ ] Configuration de Django REST Framework
* [ ] API des documents
* [ ] Recherche
* [ ] Filtres
* [ ] Pagination

### Phase 4 — Authentification

* [ ] Gestion des utilisateurs
* [ ] Inscription
* [ ] Connexion
* [ ] Authentification JWT
* [ ] Permissions

### Phase 5 — Commandes

* [ ] Création des commandes
* [ ] Gestion des statuts
* [ ] Gestion des transactions

### Phase 6 — Paiements

* [ ] Intégration du moyen de paiement
* [ ] Gestion des paiements
* [ ] Webhooks
* [ ] Validation des transactions

### Phase 7 — Téléchargements

* [ ] Vérification du paiement
* [ ] Autorisation du téléchargement
* [ ] Historique des téléchargements

### Phase 8 — Tests et déploiement

* [ ] Tests automatisés
* [ ] Optimisation des requêtes
* [ ] Sécurité
* [ ] CI/CD
* [ ] Déploiement

---

## Licence

Projet en cours de développement.
