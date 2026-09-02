# Congolibs

> Plateforme numérique de bibliothèque éducative destinée aux élèves et étudiants congolais.

## 1. Présentation

**Congolibs** est un projet de plateforme éducative conçu pour faciliter l'accès aux ressources pédagogiques et documentaires pour les élèves et étudiants du Congo.

L'objectif est de proposer un espace numérique simple, accessible et organisé permettant de rechercher, consulter et exploiter des ressources éducatives depuis un ordinateur ou un appareil mobile.

## 2. Objectifs du projet

- Centraliser des ressources éducatives dans une même plateforme.
- Faciliter la recherche de documents pour les élèves et étudiants.
- Améliorer l'accès aux contenus pédagogiques numériques.
- Organiser les ressources par catégories et niveaux d'étude.
- Construire une expérience utilisateur claire et adaptée au contexte congolais.
- Poser les bases d'une bibliothèque numérique évolutive.

## 3. Public cible

### Utilisateurs principaux

- Élèves du secondaire.
- Étudiants de l'enseignement supérieur.
- Enseignants et encadreurs pédagogiques.

### Utilisateurs secondaires

- Administrateurs de la plateforme.
- Contributeurs chargés d'ajouter ou de gérer les ressources.

## 4. Fonctionnalités envisagées

### Recherche

- Rechercher une ressource par titre.
- Rechercher par auteur.
- Rechercher par matière.
- Rechercher par niveau d'étude.
- Rechercher par catégorie.
- Afficher les résultats de recherche de manière structurée.

### Bibliothèque

- Consulter les ressources disponibles.
- Parcourir les catégories.
- Consulter la fiche détaillée d'une ressource.
- Accéder au contenu ou au document associé.
- Organiser les ressources selon leur type.

### Compte utilisateur

- Créer un compte.
- Se connecter.
- Gérer son profil.
- Consulter ses ressources enregistrées.
- Retrouver son historique ou ses interactions avec la bibliothèque.

### Administration

- Ajouter une ressource.
- Modifier une ressource.
- Supprimer une ressource.
- Gérer les catégories.
- Gérer les utilisateurs.
- Contrôler la publication des ressources.

## 5. Organisation des ressources

Les ressources pourront être structurées selon plusieurs critères :

- Niveau scolaire ou universitaire.
- Matière.
- Type de document.
- Auteur.
- Année.
- Thématique.
- Établissement ou contexte académique lorsque cela est pertinent.

## 6. MVP

La première version doit rester volontairement simple et se concentrer sur la valeur principale du projet :

1. Accueil.
2. Catalogue des ressources.
3. Recherche.
4. Filtres.
5. Fiche d'une ressource.
6. Consultation ou accès au document.
7. Authentification de base.
8. Espace d'administration pour gérer les ressources.

Les fonctionnalités secondaires pourront être ajoutées progressivement après validation de l'usage réel de la plateforme.

## 7. Interfaces prévues

Le projet a déjà été envisagé autour d'une conception d'environ **18 écrans**, couvrant notamment :

- Accueil.
- Recherche.
- Catalogue.
- Catégories.
- Résultats de recherche.
- Fiche ressource.
- Lecture/consultation.
- Connexion.
- Inscription.
- Profil.
- Ressources enregistrées.
- Historique.
- Administration.
- Gestion des ressources.
- Gestion des catégories.
- Gestion des utilisateurs.

Cette liste constitue une base de travail et pourra être ajustée pendant la conception UX/UI.

## 8. Principes UX/UI

L'interface doit privilégier :

- La simplicité.
- La lisibilité.
- Une navigation rapide.
- Une hiérarchie visuelle claire.
- Une bonne adaptation mobile et desktop.
- Des actions compréhensibles sans apprentissage important.
- Une identité visuelle moderne, éducative et cohérente.

Le design doit servir l'accès au contenu plutôt que multiplier les éléments décoratifs.

## 9. Architecture fonctionnelle

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

## 10. Stack technique

Le projet s'inscrit dans l'écosystème de développement web utilisé pour les projets de la plateforme :

- **Frontend :** HTML, CSS, JavaScript.
- **Évolution possible :** React.js.
- **Backend :** à définir selon l'architecture retenue.
- **Base de données :** à définir selon les besoins du MVP.
- **Hébergement :** solutions web telles que Netlify pour les parties compatibles avec un hébergement statique.

La stack définitive doit être choisie en fonction de la simplicité de maintenance, du coût, des performances et de la capacité d'évolution.

## 11. Modèle économique potentiel

Le projet peut commencer comme une plateforme gratuite d'accès aux ressources.

À plus long terme, plusieurs pistes peuvent être étudiées :

- Partenariats avec des établissements.
- Mise en avant de ressources ou services éducatifs.
- Comptes institutionnels.
- Services premium.
- Partenariats avec des éditeurs ou producteurs de contenus.

Aucune de ces pistes ne doit cependant prendre le dessus sur la mission principale : rendre les ressources éducatives plus accessibles.

## 12. Roadmap indicative

### Phase 1 — Cadrage

- Définition précise du périmètre.
- Identification des utilisateurs.
- Définition du MVP.
- Modélisation des données.

### Phase 2 — UX/UI

- Architecture de l'information.
- Parcours utilisateurs.
- Wireframes.
- Design des écrans.
- Prototype.

### Phase 3 — Développement

- Mise en place du frontend.
- Mise en place du backend.
- Base de données.
- Authentification.
- Gestion des ressources.

### Phase 4 — Tests

- Tests fonctionnels.
- Tests responsive.
- Tests utilisateurs.
- Correction des problèmes UX.
- Optimisation des performances.

### Phase 5 — Déploiement

- Mise en production.
- Configuration du domaine.
- SEO.
- Suivi des performances.
- Collecte des retours utilisateurs.

## 13. Vision

Congolibs ne doit pas être uniquement un site qui stocke des PDF. La vision à long terme est de construire un véritable **écosystème documentaire et éducatif numérique congolais**, capable d'accompagner l'élève et l'étudiant dans ses recherches et son apprentissage.

Le projet doit donc être construit progressivement : un MVP utile, simple et fiable d'abord, puis des fonctionnalités plus ambitieuses une fois que les besoins réels des utilisateurs sont connus.

## 14. Prochaines décisions à prendre

- Finaliser le périmètre exact du MVP.
- Définir le modèle de données.
- Définir les rôles et permissions.
- Déterminer les formats de ressources acceptés.
- Définir les règles de publication et de modération.
- Finaliser les 18 écrans.
- Choisir l'architecture backend.
- Préparer le prototype UX/UI.
