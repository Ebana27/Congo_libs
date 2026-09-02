from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLE_CHOICES = [
        ("super_admin", "Super admin"),
        ("editor", "Éditeur"),
        ("reader", "Lecture seule"),
    ]

    telephone = models.CharField(max_length=30, blank=True)
    ville = models.CharField(max_length=100, blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="reader", db_index=True)
