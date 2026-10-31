import logging
import json
import os
import uuid
from datetime import timedelta

from django.core.cache import cache
from django.utils.decorators import method_decorator
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse
from django.middleware.csrf import get_token
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie
from django.utils.cache import patch_vary_headers
from google.auth.exceptions import GoogleAuthError
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from rest_framework import generics, mixins, serializers, status, viewsets
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import SAFE_METHODS, AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle

from apps.documents.models import BacDetail, ConcoursDetail, Document, DocumentRead, LivreDetail, Telechargement
from apps.users.api.serializers import UserSerializer
from apps.users.models import User
from apps.documents.services.watermark import (
    InvalidPdfPage,
    WatermarkError,
    pdf_page_count,
    render_pdf_page,
)

from .serializers import (
    BacDetailSerializer,
    ConcoursDetailSerializer,
    DocumentSerializer,
    LivreDetailSerializer,
    PublicDocumentSerializer,
    TelechargementSerializer,
)

logger = logging.getLogger(__name__)


class DocumentSourceUnavailable(Exception):
    pass


def get_cached_document_pdf(document, user):
    key = f"drm:source:{user.pk}:{document.pk}"
    pdf_bytes = cache.get(key)
    if pdf_bytes is not None:
        return pdf_bytes

    try:
        pdf_bytes = get_google_drive_file_bytes(document.lien_telechargement)
    except (GoogleAuthError, HttpError, OSError, ValueError) as exc:
        logger.warning("Unable to load DRM source for document %s and user %s", document.pk, user.pk)
        raise DocumentSourceUnavailable from exc

    if not isinstance(pdf_bytes, bytes) or not pdf_bytes:
        logger.warning("Empty DRM source for document %s and user %s", document.pk, user.pk)
        raise DocumentSourceUnavailable

    cache.set(key, pdf_bytes, timeout=60)
    return pdf_bytes


class ReadingSessionQuerySerializer(serializers.Serializer):
    session = serializers.UUIDField(required=False)


class DocumentReaderMetaView(generics.GenericAPIView):
    queryset = Document.objects.filter(delete=False)
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication, SessionAuthentication]

    def get(self, request, *args, **kwargs):
        document = get_object_or_404(self.get_queryset(), pk=kwargs["pk"])
        query = ReadingSessionQuerySerializer(data=request.query_params)
        query.is_valid(raise_exception=True)
        session_id = query.validated_data.get("session", uuid.uuid4())

        try:
            page_count = pdf_page_count(get_cached_document_pdf(document, request.user))
        except DocumentSourceUnavailable:
            return Response(
                {"detail": "Le document est temporairement indisponible."},
                status=status.HTTP_502_BAD_GATEWAY,
            )
        except WatermarkError:
            return Response(
                {"detail": "Le document PDF ne peut pas être lu."},
                status=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

        response = Response(
            {
                "title": document.nom,
                "pages": page_count,
                "reading_session": str(session_id),
            }
        )
        response["Cache-Control"] = "no-store, private"
        response["X-Content-Type-Options"] = "nosniff"
        return response


class DocumentReaderPageView(generics.GenericAPIView):
    queryset = Document.objects.filter(delete=False)
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication, SessionAuthentication]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "drm_pages"

    def get(self, request, *args, **kwargs):
        document = get_object_or_404(self.get_queryset(), pk=kwargs["pk"])
        query = ReadingSessionQuerySerializer(data=request.query_params)
        query.is_valid(raise_exception=True)
        session_id = query.validated_data.get("session", uuid.uuid4())

        try:
            image = render_pdf_page(
                get_cached_document_pdf(document, request.user),
                page_number=kwargs["page"],
                user_id=request.user.pk,
                email=request.user.email,
            )
        except DocumentSourceUnavailable:
            return Response(
                {"detail": "Le document est temporairement indisponible."},
                status=status.HTTP_502_BAD_GATEWAY,
            )
        except InvalidPdfPage:
            return Response({"detail": "Page introuvable."}, status=status.HTTP_404_NOT_FOUND)
        except WatermarkError:
            return Response(
                {"detail": "Le document PDF ne peut pas être lu."},
                status=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

        DocumentRead.objects.create(
            user=request.user,
            document=document,
            session_id=session_id,
            page_number=kwargs["page"],
            ip_address=request.META.get("REMOTE_ADDR"),
        )
        response = HttpResponse(image, content_type="image/png")
        response["Cache-Control"] = "no-store, private"
        response["Content-Disposition"] = "inline"
        response["X-Content-Type-Options"] = "nosniff"
        patch_vary_headers(response, ("Cookie", "Authorization"))
        return response


def get_google_drive_service():
    credentials_json = os.environ.get("GOOGLE_SERVICE_ACCOUNT_JSON", "")
    if not credentials_json:
        credentials_file = os.environ.get("GOOGLE_SERVICE_ACCOUNT_FILE", "")
        if credentials_file:
            with open(credentials_file, "r", encoding="utf-8") as fh:
                credentials_json = fh.read()
        if not credentials_json:
            raise ValueError("GOOGLE_SERVICE_ACCOUNT_JSON or GOOGLE_SERVICE_ACCOUNT_FILE is not configured")
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


class DownloadHistoryView(mixins.ListModelMixin, generics.GenericAPIView):
    serializer_class = TelechargementSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Telechargement.objects.filter(user=self.request.user).select_related("document")

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)


@method_decorator(csrf_protect, name="dispatch")
class LoginView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    throttle_scope = "login"

    def post(self, request, *args, **kwargs):
        username = request.data.get("username") or request.data.get("email")
        password = request.data.get("password")
        if not isinstance(username, str) or not username.strip() or not isinstance(password, str) or not password:
            raise serializers.ValidationError({"detail": "Le nom d'utilisateur et le mot de passe sont requis."})
        username = username.strip()
        if "@" in username:
            user_by_email = User.objects.filter(email__iexact=username).only("username").first()
            if user_by_email:
                username = user_by_email.username
        user = authenticate(
            request,
            username=username,
            password=password,
        )
        if user is None:
            return Response({"detail": "Identifiants invalides."}, status=status.HTTP_401_UNAUTHORIZED)
        login(request, user)
        return Response({"user": UserSerializer(user).data, "csrfToken": get_token(request)})


class CsrfTokenView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    @method_decorator(ensure_csrf_cookie)
    def get(self, request, *args, **kwargs):
        return Response({"csrfToken": get_token(request)})


class LogoutView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT)


class SessionView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    @method_decorator(ensure_csrf_cookie)
    def get(self, request, *args, **kwargs):
        return Response({"user": UserSerializer(request.user).data})
