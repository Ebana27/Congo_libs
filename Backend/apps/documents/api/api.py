from django.contrib.auth import authenticate, login, logout
from django.middleware.csrf import get_token
from rest_framework import generics, mixins, serializers, status, viewsets
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response

from apps.documents.models import BacDetail, ConcoursDetail, Document, LivreDetail, Telechargement
from apps.users.api.serializers import UserSerializer

from .serializers import (
    BacDetailSerializer,
    ConcoursDetailSerializer,
    DocumentSerializer,
    LivreDetailSerializer,
    TelechargementSerializer,
)


class PublicListMixin(mixins.ListModelMixin, generics.GenericAPIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)


class PublicDetailMixin(mixins.RetrieveModelMixin, generics.GenericAPIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)


class DocumentListView(PublicListMixin):
    serializer_class = DocumentSerializer

    def get_queryset(self):
        queryset = Document.objects.filter(delete=False).order_by("-date_creation")
        if document_type := self.request.query_params.get("type"):
            queryset = queryset.filter(type=document_type)
        if search := self.request.query_params.get("q"):
            queryset = queryset.filter(nom__icontains=search)
        return queryset


class DocumentDetailView(PublicDetailMixin):
    queryset = Document.objects.filter(delete=False)
    serializer_class = DocumentSerializer


class LivreDetailListView(PublicListMixin):
    queryset = LivreDetail.objects.filter(delete=False, document__delete=False)
    serializer_class = LivreDetailSerializer


class LivreDetailView(PublicDetailMixin):
    queryset = LivreDetail.objects.filter(delete=False, document__delete=False)
    serializer_class = LivreDetailSerializer


class ConcoursDetailListView(PublicListMixin):
    serializer_class = ConcoursDetailSerializer

    def get_queryset(self):
        queryset = ConcoursDetail.objects.filter(delete=False, document__delete=False)
        if matiere := self.request.query_params.get("matiere"):
            queryset = queryset.filter(matiere__icontains=matiere)
        if concours := self.request.query_params.get("concours"):
            queryset = queryset.filter(ecole__icontains=concours)
        return queryset


class ConcoursDetailView(PublicDetailMixin):
    queryset = ConcoursDetail.objects.filter(delete=False, document__delete=False)
    serializer_class = ConcoursDetailSerializer


class BacDetailListView(PublicListMixin):
    serializer_class = BacDetailSerializer

    def get_queryset(self):
        queryset = BacDetail.objects.filter(delete=False, document__delete=False)
        for field in ("matiere", "niveau", "serie"):
            if value := self.request.query_params.get(field):
                queryset = queryset.filter(**{f"{field}__icontains": value})
        return queryset


class BacDetailView(PublicDetailMixin):
    queryset = BacDetail.objects.filter(delete=False, document__delete=False)
    serializer_class = BacDetailSerializer


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
        Telechargement.objects.create(user=request.user, document=document)
        return Response({"lien_telechargement": document.lien_telechargement})


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

    def get(self, request, *args, **kwargs):
        return Response({"user": UserSerializer(request.user).data})
