from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.documents.api.api import (
    BacDetailListView,
    BacDetailView,
    ConcoursDetailListView,
    ConcoursDetailView,
    DocumentAdminViewSet,
    DocumentDetailView,
    DocumentListView,
    DownloadDocumentView,
    DownloadHistoryView,
    LivreDetailListView,
    LivreDetailView,
)

router = DefaultRouter()
router.register("documents", DocumentAdminViewSet, basename="admin-document")

urlpatterns = [
    path("", DocumentListView.as_view(), name="document-list"),
    path("", DocumentListView.as_view(), name="document-list-create"),
    path("<uuid:pk>/", DocumentDetailView.as_view(), name="document-detail"),
    path("livres/", LivreDetailListView.as_view(), name="livre-list"),
    path("livres/", LivreDetailListView.as_view(), name="livre-list-create"),
    path("livres/<uuid:pk>/", LivreDetailView.as_view(), name="livre-detail"),
    path("concours/", ConcoursDetailListView.as_view(), name="concours-list"),
    path("concours/", ConcoursDetailListView.as_view(), name="concours-list-create"),
    path("concours/<uuid:pk>/", ConcoursDetailView.as_view(), name="concours-detail"),
    path("bac/", BacDetailListView.as_view(), name="bac-list"),
    path("bac/", BacDetailListView.as_view(), name="bac-list-create"),
    path("bac/<uuid:pk>/", BacDetailView.as_view(), name="bac-detail"),
    path("<uuid:pk>/telecharger/", DownloadDocumentView.as_view(), name="document-download"),
    path("telechargements/", DownloadHistoryView.as_view(), name="download-history"),
    path("admin/", include(router.urls)),
]
