# Panel d’administration custom

## 1. Architecture

- Backend Django : application `admin_api`
- Frontend : React + Vite + Tailwind CSS
- Authentification : session Django sur le backend admin, avec gestion d’un rôle explicite sur le modèle `User`

## 2. Rôles par défaut

Le modèle `User` expose désormais le champ `role` avec les valeurs suivantes :

- `super_admin` : accès total
- `editor` : création / édition / lecture
- `reader` : lecture seule

## 3. Ajout d’un nouveau modèle au panel

1. Créer un serializer DRF pour le modèle.
2. Créer une vue dédiée ou une vue générique basée sur le modèle.
3. Ajouter une route dans [Backend/admin_api/urls.py](../Backend/admin_api/urls.py).
4. Créer l’écran frontend dans le dossier `client/src/admin`.
5. Renseigner les permissions via `IsAdminUser` ou `IsSuperAdmin` selon le besoin.

### Pattern minimal

```python
from rest_framework import serializers
from rest_framework.generics import ListCreateAPIView
from rest_framework.permissions import IsAuthenticated

class MyModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = MyModel
        fields = '__all__'

class MyModelListView(ListCreateAPIView):
    queryset = MyModel.objects.all()
    serializer_class = MyModelSerializer
    permission_classes = [IsAdminUser]
```

## 4. Sécurité

- Les permissions sont vérifiées côté API.
- Les endpoints admin sont séparés de la partie publique.
- Le frontend n’accède pas à l’admin sans session valable.

## 5. Extension future

- pagination côté serveur
- filtres et tri
- export CSV
- audit historique
- actions groupées
- composants graphiques plus avancés
