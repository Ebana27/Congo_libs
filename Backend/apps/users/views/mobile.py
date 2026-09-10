import re

from django.contrib.auth import authenticate
from django.core.exceptions import ValidationError
from django.db import transaction
from rest_framework import serializers
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_200_OK,
    HTTP_201_CREATED,
    HTTP_400_BAD_REQUEST,
    HTTP_401_UNAUTHORIZED,
)
from rest_framework.views import APIView

from apps.users.api.serializers import UserSerializer
from apps.users.models import User

# Vue mobile : le token DRF est la source d'authentification.
# Les appels authentifiés doivent passer par Authorization: Token <token>.

class MobileAuthSerializer(serializers.Serializer):
    username = serializers.CharField(required=False, allow_blank=False)
    email = serializers.EmailField(required=False)
    password = serializers.CharField(required=False, write_only=True)
    password1 = serializers.CharField(required=False, write_only=True)
    password2 = serializers.CharField(required=False, write_only=True)


def get_or_create_user_token(user):
    # Centralise la création/récupération du token unique côté mobile.
    token, _ = Token.objects.get_or_create(user=user)
    return token


def build_mobile_auth_payload(token, user):
    return {
        "token": token.key,
        "user_id": user.id,
        "user": UserSerializer(user).data,
    }


class MobileLoginView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [AllowAny]
    throttle_scope = "mobile_login"

    def post(self, request, *args, **kwargs):
        username = (request.data.get("username") or "").strip()
        password = request.data.get("password") or ""
        if not username or not password:
            raise serializers.ValidationError({"detail": "Le nom d'utilisateur et le mot de passe sont requis."})

        user = authenticate(request, username=username, password=password)
        if user is None:
            return Response({"detail": "Identifiants invalides."}, status=HTTP_401_UNAUTHORIZED)

        token = get_or_create_user_token(user)
        return Response(build_mobile_auth_payload(token, user), status=HTTP_200_OK)


class MobileRegistrationView(APIView):
    # Inscription mobile publique. Aucune dépendance au cookie CSRF du navigateur web.
    authentication_classes = [TokenAuthentication]
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        username = (request.data.get("username") or "").strip()
        email = (request.data.get("email") or "").strip().lower()
        password1 = request.data.get("password1") or request.data.get("password") or ""
        password2 = request.data.get("password2") or ""

        if not username:
            return Response({"detail": "Le nom d'utilisateur est requis."}, status=HTTP_400_BAD_REQUEST)
        if not email:
            return Response({"detail": "L'email est requis."}, status=HTTP_400_BAD_REQUEST)
        if not password1 or not password2:
            return Response({"detail": "Les deux mots de passe sont requis."}, status=HTTP_400_BAD_REQUEST)
        if password1 != password2:
            return Response({"detail": "Les mots de passe ne correspondent pas."}, status=HTTP_400_BAD_REQUEST)
        if len(password1) < 8:
            return Response({"detail": "Le mot de passe doit contenir au moins 8 caractères."}, status=HTTP_400_BAD_REQUEST)
        if User.objects.filter(username__iexact=username).exists():
            return Response({"detail": "Ce nom d'utilisateur est déjà utilisé."}, status=HTTP_400_BAD_REQUEST)
        if User.objects.filter(email__iexact=email).exists():
            return Response({"detail": "Cet email est déjà utilisé."}, status=HTTP_400_BAD_REQUEST)
        if not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", email):
            return Response({"detail": "Adresse email invalide."}, status=HTTP_400_BAD_REQUEST)

        try:
            with transaction.atomic():
                user = User.objects.create_user(
                    username=username,
                    email=email,
                    password=password1,
                )
                token = get_or_create_user_token(user)
                return Response(build_mobile_auth_payload(token, user), status=HTTP_201_CREATED)
        except ValidationError as exc:
            return Response({"detail": str(exc)}, status=HTTP_400_BAD_REQUEST)


class MobileLogoutView(APIView):
    # La déconnexion mobile doit supprimer le token serveur pour bloquer les anciennes sessions.
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        Token.objects.filter(user=request.user).delete()
        return Response({"detail": "Déconnexion réussie."}, status=HTTP_200_OK)


class MobileCurrentUserView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        return Response({"user": UserSerializer(request.user).data}, status=HTTP_200_OK)
