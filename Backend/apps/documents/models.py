import uuid

from django.conf import settings
from django.db import models

class Document(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    TYPE_CHOICES = [('livre', 'Livre'), ('concours', 'Concours'), ('bac', 'Bac')]
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    nom = models.CharField(max_length=255)
    date_creation = models.DateTimeField(auto_now_add=True)
    lien_telechargement = models.URLField()
    delete = models.BooleanField(default=False)

class LivreDetail(models.Model):
    document = models.OneToOneField(Document, on_delete=models.CASCADE, primary_key=True)
    auteur = models.CharField(max_length=255)
    delete = models.BooleanField(default=False)

class ConcoursDetail(models.Model):
    document = models.OneToOneField(Document, on_delete=models.CASCADE, primary_key=True)
    ecole = models.CharField(max_length=255)
    annee = models.IntegerField()
    matiere = models.CharField(max_length=100)
    delete = models.BooleanField(default=False)

class BacDetail(models.Model):
    document = models.OneToOneField(Document, on_delete=models.CASCADE, primary_key=True)
    annee = models.IntegerField()
    matiere = models.CharField(max_length=100)
    niveau = models.CharField(max_length=100, blank=True)
    serie = models.CharField(max_length=10)
    delete = models.BooleanField(default=False)


class Telechargement(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    document = models.ForeignKey(Document, on_delete=models.CASCADE)
    date_telechargement = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-date_telechargement"]
