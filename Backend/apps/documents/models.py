import uuid

from django.conf import settings
from django.db import models


class Document(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    TYPE_CHOICES = [('livre', 'Livre'), ('concours', 'Concours'), ('bac', 'Bac')]
    type = models.CharField(max_length=10, choices=TYPE_CHOICES, db_index=True)
    nom = models.CharField(max_length=255, db_index=True)
    date_creation = models.DateTimeField(auto_now_add=True, db_index=True)
    lien_telechargement = models.CharField(max_length=500, db_index=True, help_text="Google Drive file ID only")
    delete = models.BooleanField(default=False, db_index=True)


class LivreDetail(models.Model):
    document = models.OneToOneField(Document, on_delete=models.CASCADE, primary_key=True)
    auteur = models.CharField(max_length=255, db_index=True)
    delete = models.BooleanField(default=False, db_index=True)


class ConcoursDetail(models.Model):
    document = models.OneToOneField(Document, on_delete=models.CASCADE, primary_key=True)
    ecole = models.CharField(max_length=255, db_index=True)
    annee = models.IntegerField(db_index=True)
    matiere = models.CharField(max_length=100, db_index=True)
    delete = models.BooleanField(default=False, db_index=True)


class BacDetail(models.Model):
    document = models.OneToOneField(Document, on_delete=models.CASCADE, primary_key=True)
    annee = models.IntegerField(db_index=True)
    matiere = models.CharField(max_length=100, db_index=True)
    niveau = models.CharField(max_length=100, blank=True, db_index=True)
    serie = models.CharField(max_length=10, db_index=True)
    delete = models.BooleanField(default=False, db_index=True)


class Telechargement(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, db_index=True)
    document = models.ForeignKey(Document, on_delete=models.CASCADE, db_index=True)
    date_telechargement = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ["-date_telechargement"]
