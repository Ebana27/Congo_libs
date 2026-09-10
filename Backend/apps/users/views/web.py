import json
from urllib.parse import quote
from urllib.request import urlopen

from allauth.socialaccount.models import SocialAccount
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from django.contrib.auth import login
from dj_rest_auth.registration.views import SocialLoginView
from django.middleware.csrf import get_token
from rest_framework import serializers
from rest_framework.response import Response

from apps.users.api.serializers import UserSerializer
from apps.users.models import User


class GoogleLoginView(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    callback_url = "http://localhost:3000/auth/google/callback"
    client_class = OAuth2Client

    def post(self, request, *args, **kwargs):
        access_token = request.data.get("access_token") or request.data.get("token")
        if not access_token:
            raise serializers.ValidationError({"detail": "Le token Google est requis."})

        try:
            google_url = f"https://oauth2.googleapis.com/tokeninfo?access_token={quote(access_token)}"
            with urlopen(google_url, timeout=10) as response:
                payload = json.loads(response.read().decode("utf-8"))
        except Exception:
            raise serializers.ValidationError({"detail": "Token Google invalide."})

        email = (payload.get("email") or "").strip().lower()
        if not email or payload.get("email_verified") is not True:
            raise serializers.ValidationError({"detail": "Token Google invalide."})

        existing_user = User.objects.filter(email__iexact=email).first()
        if existing_user is not None:
            if not SocialAccount.objects.filter(user=existing_user, provider="google").exists():
                SocialAccount.objects.create(
                    user=existing_user,
                    provider="google",
                    uid=email,
                    extra_data=payload,
                )
            login(request, existing_user, backend="django.contrib.auth.backends.ModelBackend")
            return Response({"user": UserSerializer(existing_user).data, "csrfToken": get_token(request)})

        base_username = email.split("@")[0]
        username = base_username
        suffix = 1
        while User.objects.filter(username=username).exists():
            username = f"{base_username}{suffix}"
            suffix += 1

        user = User.objects.create_user(
            username=username,
            email=email,
            password=User.objects.make_random_password(),
        )
        user.first_name = payload.get("given_name", "")
        user.last_name = payload.get("family_name", "")
        user.save(update_fields=["first_name", "last_name"])

        SocialAccount.objects.create(
            user=user,
            provider="google",
            uid=email,
            extra_data=payload,
        )
        login(request, user, backend="django.contrib.auth.backends.ModelBackend")
        return Response({"user": UserSerializer(user).data, "csrfToken": get_token(request)})
