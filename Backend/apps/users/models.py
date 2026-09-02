from django.contrib.auth.models import AbstractUser, UserManager as DjangoUserManager
from django.db import models


class UserManager(DjangoUserManager):
    def create_superuser(self, username, email=None, password=None, **extra_fields):
        extra_fields.setdefault("role", "super_admin")
        return super().create_superuser(username, email, password, **extra_fields)


class User(AbstractUser):
    ROLE_CHOICES = [
        ("super_admin", "Super admin"),
        ("editor", "Éditeur"),
        ("reader", "Lecture seule"),
    ]

    telephone = models.CharField(max_length=30, blank=True)
    ville = models.CharField(max_length=100, blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="reader", db_index=True)

    objects = UserManager()
