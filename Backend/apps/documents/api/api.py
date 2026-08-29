import json
import os

from django.contrib.auth import authenticate, login, logout
from django.core.files.base import ContentFile
from django.http import FileResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie
from google.oauth2 import service_account
from googleapiclient.discovery import build
from rest_framework import generics, mixins, serializers, status, viewsets
from rest_framework.permissions import SAFE_METHODS, AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response

from apps.documents.models import BacDetail, ConcoursDetail, Document, LivreDetail, Telechargement
from apps.users.api.serializers import UserSerializer

from .serializers import (
    BacDetailSerializer,
    ConcoursDetailSerializer,
    DocumentSerializer,
    LivreDetailSerializer,
    PublicDocumentSerializer,
    TelechargementSerializer,
)


def get_google_drive_service():
    credentials_json = os.environ.get("GOOGLE_SERVICE_ACCOUNT_JSON", "")
    if not credentials_json:
        raise ValueError("GOOGLE_SERVICE_ACCOUNT_JSON is not configured")
    info = json.loads(credentials_json)
    credentials = service_account.Credentials.from_service_account_info(
        info,
        scopes=["https://www.googleapis.com/auth/drive.readonly"],
    )
    return build("drive", "v3", credentials=credentials, cache_discovery=False)


def get_google_drive_file_bytes(file_id):
    service = get_google_drive_service()
    request = service.files().get_media(fileId=file_id)
    return request.execute()


class PublicListMixin(mixins.ListModelMixin, generics.GenericAPIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)


class PublicCreateListMixin(PublicListMixin, mixins.CreateModelMixin):
    def get_permissions(self):
        if self.request.method in SAFE_METHODS:
            return [AllowAny()]
        return [IsAdminUser()]

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)


class PublicDetailMixin(mixins.RetrieveModelMixin, generics.GenericAPIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)


class PublicDetailUpdateDestroyMixin(
    PublicDetailMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
):
    def get_permissions(self):
        if self.request.method in SAFE_METHODS:
            return [AllowAny()]
        return [IsAdminUser()]

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)


class DocumentListView(PublicCreateListMixin):
    serializer_class = PublicDocumentSerializer

    def get_permissions(self):
        if self.request.method in SAFE_METHODS:
            return [AllowAny()]
        return [IsAdminUser()]

    def get_queryset(self):
        queryset = Document.objects.filter(delete=False).order_by("-date_creation")
        if document_type := self.request.query_params.get("type"):
            queryset = queryset.filter(type=document_type)
        if search := self.request.query_params.get("q"):
            queryset = queryset.filter(nom__icontains=search)
        return queryset


class DocumentDetailView(PublicDetailUpdateDestroyMixin):
    queryset = Document.objects.filter(delete=False)
    serializer_class = PublicDocumentSerializer

    def get_permissions(self):
        if self.request.method in SAFE_METHODS:
            return [AllowAny()]
        return [IsAdminUser()]

    def perform_destroy(self, instance):
        instance.delete = True
        instance.save(update_fields=["delete"])


class LivreDetailListView(PublicCreateListMixin):
    queryset = LivreDetail.objects.filter(delete=False, document__delete=False)
    serializer_class = LivreDetailSerializer


class LivreDetailView(PublicDetailUpdateDestroyMixin):
    queryset = LivreDetail.objects.filter(delete=False, document__delete=False)
    serializer_class = LivreDetailSerializer

    def perform_destroy(self, instance):
        instance.delete = True
        instance.save(update_fields=["delete"])


class ConcoursDetailListView(PublicCreateListMixin):
    serializer_class = ConcoursDetailSerializer

    def get_queryset(self):
        queryset = ConcoursDetail.objects.filter(delete=False, document__delete=False)
        if matiere := self.request.query_params.get("matiere"):
            queryset = queryset.filter(matiere__icontains=matiere)
        if concours := self.request.query_params.get("concours"):
            queryset = queryset.filter(ecole__icontains=concours)
        return queryset


class ConcoursDetailView(PublicDetailUpdateDestroyMixin):
    queryset = ConcoursDetail.objects.filter(delete=False, document__delete=False)
    serializer_class = ConcoursDetailSerializer

    def perform_destroy(self, instance):
        instance.delete = True
        instance.save(update_fields=["delete"])


class BacDetailListView(PublicCreateListMixin):
    serializer_class = BacDetailSerializer

    def get_queryset(self):
        queryset = BacDetail.objects.filter(delete=False, document__delete=False)
        for field in ("matiere", "niveau", "serie"):
            if value := self.request.query_params.get(field):
                queryset = queryset.filter(**{f"{field}__icontains": value})
        return queryset


class BacDetailView(PublicDetailUpdateDestroyMixin):
    queryset = BacDetail.objects.filter(delete=False, document__delete=False)
    serializer_class = BacDetailSerializer

    def perform_destroy(self, instance):
        instance.delete = True
        instance.save(update_fields=["delete"])


class DocumentAdminViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all().order_by("-date_creation")
    serializer_class = DocumentSerializer
    permission_classes = [IsAdminUser]

    def perform_destroy(self, instance):
        instance.delete = True
        instance.save(update_fields=["delete"])


class DownloadDocumentView(generics.GenericAPIView):
    queryset = Document.objects.filter(delete=False)
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        document = self.get_object()
        file_id = document.lien_telechargement
        try:
            pdf_bytes = get_google_drive_file_bytes(file_id)
        except Exception as exc:
            return Response({"detail": f"Impossible de récupérer le document: {exc}"}, status=status.HTTP_502_BAD_GATEWAY)

        Telechargement.objects.create(user=request.user, document=document)
        filename = f"{document.nom or 'document'}.pdf"
        response = FileResponse(ContentFile(pdf_bytes, name=filename), as_attachment=True, filename=filename)
        response["Content-Type"] = "application/pdf"
        return response


class DownloadHistoryView(mixins.ListModelMixin, generics.GenericAPIView):
    serializer_class = TelechargementSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Telechargement.objects.filter(user=self.request.user).select_related("document")

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)


class LoginView(generics.GenericAPIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        username = request.data.get("username")
        password = request.data.get("password")
        if not username or not password:
            raise serializers.ValidationError({"detail": "Le nom d'utilisateur et le mot de passe sont requis."})
        user = authenticate(
            request,
            username=username,
            password=password,
        )
        if user is None:
            return Response({"detail": "Identifiants invalides."}, status=status.HTTP_401_UNAUTHORIZED)
        login(request, user)
        return Response({"user": UserSerializer(user).data, "csrfToken": get_token(request)})


class LogoutView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT)


class SessionView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    @ensure_csrf_cookie
    def get(self, request, *args, **kwargs):
        return Response({"user": UserSerializer(request.user).data})
