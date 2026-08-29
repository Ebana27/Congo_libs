from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
	telephone = models.CharField(max_length=30, blank=True)
	ville = models.CharField(max_length=100, blank=True)
