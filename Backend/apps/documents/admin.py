from django.contrib import admin

from .models import BacDetail, ConcoursDetail, Document, LivreDetail, Telechargement

admin.site.register([Document, LivreDetail, ConcoursDetail, BacDetail, Telechargement])
