import json
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from allauth.socialaccount.models import SocialAccount
from django.contrib.auth import login
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect
from rest_framework import serializers, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.users.api.serializers import UserSerializer
from apps.users.models import User


class GoogleAccessTokenSerializer(serializers.Serializer):
    access_token = serializers.CharField(write_only=True, allow_blank=False)


@method_decorator(csrf_protect, name="dispatch")
class GoogleLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        token_serializer = GoogleAccessTokenSerializer(data=request.data)
        token_serializer.is_valid(raise_exception=True)
        access_token = token_serializer.validated_data["access_token"]

        google_request = Request(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            headers={"Authorization": f"Bearer {access_token}"},
        )
        try:
            with urlopen(google_request, timeout=10) as google_response:
                google_user = json.loads(google_response.read().decode("utf-8"))
        except (HTTPError, URLError, TimeoutError, OSError, UnicodeDecodeError, json.JSONDecodeError):
            return Response(
                {"detail": "Le jeton Google est invalide ou expiré."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not isinstance(google_user, dict):
            return Response(
                {"detail": "La réponse de Google est invalide."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        email = google_user.get("email")
        if not isinstance(email, str):
            return Response(
                {"detail": "Google doit fournir une adresse e-mail vérifiée."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        email = email.strip().lower()
        email_verified = google_user.get("email_verified") or google_user.get("verified_email")
        if not email or not email_verified:
            return Response(
                {"detail": "Google doit fournir une adresse e-mail vérifiée."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        google_uid = str(google_user.get("id") or google_user.get("sub") or email)
        social_account = (
            SocialAccount.objects.select_related("user")
            .filter(provider="google", uid=google_uid)
            .first()
        )
        if social_account:
            user = social_account.user
        else:
            user = User.objects.filter(email__iexact=email).first()
            if user is None:
                username_base = email.partition("@")[0][:140] or "googleuser"
                username = username_base
                suffix = 1
                while User.objects.filter(username__iexact=username).exists():
                    username = f"{username_base[:140 - len(str(suffix)) - 1]}_{suffix}"
                    suffix += 1
                user = User.objects.create_user(
                    username=username,
                    email=email,
                    password=None,
                    first_name=google_user.get("given_name", ""),
                    last_name=google_user.get("family_name", ""),
                )
            SocialAccount.objects.create(
                user=user,
                provider="google",
                uid=google_uid,
                extra_data=google_user,
            )

        if not user.is_active:
            return Response(
                {"detail": "Ce compte est désactivé."},
                status=status.HTTP_403_FORBIDDEN,
            )

        login(request, user, backend="django.contrib.auth.backends.ModelBackend")
        return Response({"user": UserSerializer(user).data}, status=status.HTTP_200_OK)
