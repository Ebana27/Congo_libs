# Congolibs - Plateforme de recherche et téléchargement de documents éducatifs

> Plateforme numérique de bibliothèque éducative destinée aux élèves et étudiants congolais.

**Congolibs** est un projet de plateforme éducative conçu pour faciliter l'accès aux ressources pédagogiques et documentaires pour les élèves et étudiants du Congo. L'application web permet de rechercher, consulter et télécharger différents types de documents PDF, notamment des livres, sujets de concours et sujets du baccalauréat.

L'objectif est de proposer un espace numérique simple, accessible et organisé permettant de rechercher, consulter et exploiter des ressources éducatives depuis un ordinateur ou un appareil mobile.

## Présentation

### Fonctionnalités principales

- Recherche avancée par titre, auteur, matière, niveau d'étude, catégorie
- Consultation des ressources disponibles
- Fiches détaillées des ressources
- Accès au contenu ou au document associé
- Organisation des ressources par catégories et niveaux d'étude
- Authentification utilisateur
- Espace d'administration pour gérer les ressources

### Types de documents disponibles

- Livres
- Sujets de concours
- Sujets du baccalauréat

## Objectifs du projet

- Centraliser des ressources éducatives dans une même plateforme
- Faciliter la recherche de documents pour les élèves et étudiants
- Améliorer l'accès aux contenus pédagogiques numériques
- Organiser les ressources par catégories et niveaux d'étude
- Construire une expérience utilisateur claire et adaptée au contexte congolais
- Poser les bases d'une bibliothèque numérique évolutive

## Public cible

### Utilisateurs principaux

- Élèves du secondaire
- Étudiants de l'enseignement supérieur
- Enseignants et encadreurs pédagogiques

### Utilisateurs secondaires

- Administrateurs de la plateforme
- Contributeurs chargés d'ajouter ou de gérer les ressources

## Fonctionnalités détaillées

### Recherche

- Rechercher une ressource par titre
- Rechercher par auteur
- Rechercher par matière
- Rechercher par niveau d'étude
- Rechercher par catégorie
- Afficher les résultats de recherche de manière structurée

### Bibliothèque

- Consulter les ressources disponibles
- Parcourir les catégories
- Consulter la fiche détaillée d'une ressource
- Accéder au contenu ou au document associé
- Organiser les ressources selon leur type

### Compte utilisateur

- Créer un compte
- Se connecter
- Gérer son profil
- Consulter ses ressources enregistrées
- Retrouver son historique ou ses interactions avec la bibliothèque

### Administration

- Ajouter une ressource
- Modifier une ressource
- Supprimer une ressource
- Gérer les catégories
- Gérer les utilisateurs
- Contrôler la publication des ressources

## Organisation des ressources

Les ressources sont structurées selon plusieurs critères :

- Niveau scolaire ou universitaire
- Matière
- Type de document
- Auteur
- Année
- Thématique
- Établissement ou contexte académique lorsque cela est pertinent

## MVP (Minimum Viable Product)

La première version se concentre sur la valeur principale du projet :

1. Accueil
2. Catalogue des ressources
3. Recherche
4. Filtres
5. Fiche d'une ressource
6. Consultation ou accès au document
7. Authentification de base
8. Espace d'administration pour gérer les ressources

Les fonctionnalités secondaires seront ajoutées progressivement après validation de l'usage réel de la plateforme.

## Interfaces prévues

Le projet a été conçu autour d'une architecture d'environ **18 écrans**, couvrant notamment :

- Accueil
- Recherche
- Catalogue
- Catégories
- Résultats de recherche
- Fiche ressource
- Lecture/consultation
- Connexion
- Inscription
- Profil
- Ressources enregistrées
- Historique
- Administration
- Gestion des ressources
- Gestion des catégories
- Gestion des utilisateurs

Cette liste constitue une base de travail et pourra être ajustée pendant la conception UX/UI.

## Principes UX/UI

L'interface privilégie :

- La simplicité
- La lisibilité
- Une navigation rapide
- Une hiérarchie visuelle claire
- Une bonne adaptation mobile et desktop
- Des actions compréhensibles sans apprentissage important
- Une identité visuelle moderne, éducative et cohérente

Le design sert l'accès au contenu plutôt que de multiplier les éléments décoratifs.

## Architecture fonctionnelle

```text
Congolibs
├── Accueil
├── Bibliothèque
│   ├── Catalogue
│   ├── Catégories
│   ├── Recherche
│   └── Fiche ressource
├── Compte
│   ├── Profil
│   ├── Ressources enregistrées
│   └── Historique
└── Administration
    ├── Tableau de bord
    ├── Ressources
    ├── Catégories
    └── Utilisateurs
```

## Stack technique

### Architecture actuelle

L'environnement initial repose sur une architecture basée sur Docker pour assurer un environnement de développement reproductible et facilement déployable.

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

### Technologies

**Actuellement :**
- Docker
- Docker Compose
- PostgreSQL

**À venir :**
- Python
- Django
- Django REST Framework
- Authentification
- Gestion des documents
- Tests automatisés
- Déploiement

### Stack frontend

- HTML, CSS, JavaScript
- Évolution possible vers React.js

### Stack backend

- Django (Python)
- Django REST Framework pour l'API
- PostgreSQL comme base de données

### Hébergement

Solutions web telles que Netlify pour les parties compatibles avec un hébergement statique.

## Prérequis

Avant de lancer le projet, il est nécessaire d'avoir installé :

- Docker
- Docker Compose

Vérifier l'installation :

```bash
docker --version
docker compose version
```

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

## Structure du projet

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

## Développement

Le développement est réalisé sur une branche dédiée afin de ne pas modifier directement la branche principale.

Branche principale :

```
main
```

Branche de développement :

```
backend
```

Les nouvelles fonctionnalités sont développées et testées sur `backend` avant d'être intégrées à `main`.

## Roadmap

### Phase 1 — Infrastructure

- [x] Initialisation du dépôt Git
- [ ] Configuration de Docker
- [ ] Configuration de Docker Compose
- [ ] Création de l'image Django
- [ ] Configuration de PostgreSQL
- [ ] Connexion Django ↔ PostgreSQL

### Phase 2 — Base de données

- [ ] Création des modèles Django
- [ ] Création des migrations
- [ ] Création des relations entre les modèles
- [ ] Vérification de la base de données

### Phase 3 — API

- [ ] Configuration de Django REST Framework
- [ ] API des documents
- [ ] Recherche
- [ ] Filtres
- [ ] Pagination

### Phase 4 — UX/UI

- Architecture de l'information
- Parcours utilisateurs
- Wireframes
- Design des écrans
- Prototype

### Phase 5 — Développement frontend

- Mise en place du frontend
- Intégration avec l'API backend
- Authentification utilisateur
- Interface de recherche et consultation

### Phase 6 — Développement backend

- Mise en place du backend
- Base de données
- Gestion des ressources
- Système de téléchargement

### Phase 7 — Tests

- Tests fonctionnels
- Tests responsive
- Tests utilisateurs
- Correction des problèmes UX
- Optimisation des performances

### Phase 8 — Déploiement

- Mise en production
- Configuration du domaine
- SEO
- Suivi des performances
- Collecte des retours utilisateurs

## Vision

Congolibs ne doit pas être uniquement un site qui stocke des PDF. La vision à long terme est de construire un véritable **écosystème documentaire et éducatif numérique congolais**, capable d'accompagner l'élève et l'étudiant dans ses recherches et son apprentissage.

Le projet doit donc être construit progressivement : un MVP utile, simple et fiable d'abord, puis des fonctionnalités plus ambitieuses une fois que les besoins réels des utilisateurs sont connus.

## Modèle économique

Le projet peut commencer comme une plateforme gratuite d'accès aux ressources.

À plus long terme, plusieurs pistes peuvent être étudiées :

- Partenariats avec des établissements
- Mise en avant de ressources ou services éducatifs
- Comptes institutionnels
- Services premium
- Partenariats avec des éditeurs ou producteurs de contenus

Aucune de ces pistes ne doit cependant prendre le dessus sur la mission principale : rendre les ressources éducatives plus accessibles.

## Prochaines décisions à prendre

- Finaliser le périmètre exact du MVP
- Définir le modèle de données
- Définir les rôles et permissions
- Déterminer les formats de ressources acceptés
- Définir les règles de publication et de modération
- Finaliser les 18 écrans
- Finaliser l'architecture backend
- Préparer le prototype UX/UI

## Licence

Projet en cours de développement.