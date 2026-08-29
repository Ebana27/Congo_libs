## État actuel du lien PDF public

**Contexte** : les endpoints de recherche (`/documents/`, `/documents/<uuid>/`) sont publics, sans auth.
**État réel** : le serializer public `DocumentSerializer` contient encore le champ `lien_telechargement` ; il n'est donc pas exclu dans l'implémentation actuelle.
**Conséquence** : cette protection n'est pas encore entièrement appliquée côté code, même si le design métier souhaite la restreindre à l'endpoint d'authentification.
**Décision technique recommandée** : créer un serializer public distinct sans `lien_telechargement` et l'utiliser sur les routes publiques, tout en gardant le serializer complet pour les vues admin / téléchargement autorisé.

## Typage des détails d'un document

**Contexte** : `LivreDetail`, `ConcoursDetail`, `BacDetail` sont en 1-1 avec `Document`.
**État réel** : le code valide le bon type côté serializer (`validate_document`), donc un `LivreDetail` ne peut pas être rattaché à un document de type `concours`.
**Limite actuelle** : cette règle n'est pas renforcée au niveau de la base de données pour interdire les associations croisées entre plusieurs modèles de détail sur un même `Document`.
**Décision métier** : le modèle doit au minimum garantir `Document` = 1 type précis et un seul détail associé, mais ce contrôle est encore partiellement à la charge de l'application plutôt qu'à la base.