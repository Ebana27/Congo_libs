## POST /api/v1/documents/<uuid>/telecharger/

- Crée systématiquement une entrée `Telechargement`, même si l'utilisateur a déjà téléchargé ce document avant (pas de déduplication — chaque appel = une ligne d'historique).
- Retourne 401 si non authentifié, jamais 403 — distinction volontaire pour que le frontend sache s'il doit rediriger vers le login ou afficher un message d'accès refusé.
- Le contenu du PDF est renvoyé via le champ `lien_telechargement`, mais uniquement par l'endpoint authentifié de téléchargement.

## GET /api/v1/documents/?q=

- La recherche est effectuée avec `icontains` sur le champ `nom`.
- Elle est donc insensible à la casse, mais elle n'applique pas de normalisation explicite des accents ; le comportement réel dépend du backend de base de données.
- La recherche ne cible pas les champs de détail (`matiere`, `ecole`, etc.) — pour ça, il faut utiliser les filtres dédiés comme `?matiere=`, `?ecole=` ou `?niveau=` selon le type.