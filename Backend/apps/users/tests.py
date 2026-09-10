import json
from unittest.mock import patch

from allauth.socialaccount.models import SocialAccount
from django.urls import reverse
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase

from apps.users.models import User


class GoogleAuthTests(APITestCase):
    def _mock_google_payload(self, email="user@example.com"):
        return {
            "email": email,
            "verified_email": True,
            "email_verified": True,
            "given_name": "Google",
            "family_name": "User",
        }

    def test_google_login_invalid_token_returns_400(self):
        with patch("apps.users.views.web.urlopen") as mock_urlopen:
            mock_urlopen.side_effect = Exception("bad token")
            response = self.client.post(
                reverse("google_login"),
                {"access_token": "invalid-token"},
                format="json",
            )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("detail", response.data)

    def test_google_login_links_existing_email_without_duplicate(self):
        existing_user = User.objects.create_user(
            username="classicuser",
            email="existing@example.com",
            password="StrongPass123!",
        )

        with patch("apps.users.views.web.urlopen") as mock_urlopen:
            mock_urlopen.return_value.__enter__.return_value.read.return_value = json.dumps(
                self._mock_google_payload("existing@example.com")
            ).encode("utf-8")

            response = self.client.post(
                reverse("google_login"),
                {"access_token": "valid-google-token"},
                format="json",
            )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(User.objects.filter(email__iexact="existing@example.com").count(), 1)
        self.assertTrue(
            SocialAccount.objects.filter(user=existing_user, provider="google", uid="existing@example.com").exists()
        )
        self.assertEqual(response.data["user"]["email"], "existing@example.com")


class MobileAuthTests(APITestCase):
    def test_mobile_register_returns_token_and_user_profile(self):
        response = self.client.post(
            reverse("mobile_register"),
            {
                "username": "newmobileuser",
                "email": "newmobile@example.com",
                "password1": "StrongPass123!",
                "password2": "StrongPass123!",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("token", response.data)
        self.assertEqual(response.data["user_id"], User.objects.get(username="newmobileuser").id)
        self.assertEqual(response.data["user"]["email"], "newmobile@example.com")

    def test_mobile_register_rejects_duplicate_username_and_email(self):
        User.objects.create_user(
            username="duplicateuser",
            email="duplicate@example.com",
            password="StrongPass123!",
        )

        response = self.client.post(
            reverse("mobile_register"),
            {
                "username": "duplicateuser",
                "email": "other@example.com",
                "password1": "StrongPass123!",
                "password2": "StrongPass123!",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        response = self.client.post(
            reverse("mobile_register"),
            {
                "username": "otheruser",
                "email": "duplicate@example.com",
                "password1": "StrongPass123!",
                "password2": "StrongPass123!",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_mobile_register_rejects_mismatched_passwords(self):
        response = self.client.post(
            reverse("mobile_register"),
            {
                "username": "anotheruser",
                "email": "another@example.com",
                "password1": "StrongPass123!",
                "password2": "DifferentPass123!",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_mobile_login_returns_token_for_valid_user(self):
        user = User.objects.create_user(
            username="mobileuser",
            email="mobile@example.com",
            password="StrongPass123!",
        )

        response = self.client.post(
            reverse("mobile_login"),
            {"username": "mobileuser", "password": "StrongPass123!"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("token", response.data)
        self.assertEqual(response.data["user_id"], user.id)
        self.assertEqual(response.data["user"]["email"], "mobile@example.com")

    def test_mobile_current_user_requires_token_and_returns_401_without_it(self):
        response = self.client.get(reverse("mobile_current_user"))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_mobile_logout_with_token_deletes_server_token(self):
        user = User.objects.create_user(
            username="logoutuser",
            email="logout@example.com",
            password="StrongPass123!",
        )
        token = Token.objects.create(user=user)

        self.client.credentials(HTTP_AUTHORIZATION=f"Token {token.key}")
        response = self.client.post(reverse("mobile_logout"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(Token.objects.filter(user=user).exists())
