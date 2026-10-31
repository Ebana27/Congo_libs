import base64
import fitz
import uuid
from datetime import timedelta
from unittest.mock import patch

from cryptography.fernet import Fernet
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from django.core.cache import cache
from django.test import override_settings
from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase, APIClient

from apps.documents.models import Device, Document, License, Telechargement
from apps.users.models import User


@override_settings(
    DRM_MASTER_KEY=Fernet.generate_key().decode("ascii"),
    DRM_MAX_DEVICES=2,
    DRM_LICENSE_DAYS=7,
    DRM_MAX_OFFLINE_LICENSES=10,
)
class MobileDrmApiTests(APITestCase):
    def setUp(self):
        cache.clear()
        self.user = User.objects.create_user(
            username="mobile-reader",
            email="mobile@example.com",
            password="test-password",
        )
        self.document = self.create_document("Livre mobile")
        self.client.force_authenticate(user=self.user)
        self.device_uuid = uuid.uuid4()
        self.pdf_bytes = self.make_pdf()

    def tearDown(self):
        cache.clear()

    def create_document(self, title):
        return Document.objects.create(
            type="livre",
            nom=title,
            lien_telechargement=f"private-{uuid.uuid4()}",
        )

    def make_pdf(self):
        document = fitz.open()
        page = document.new_page()
        page.insert_text((72, 72), "Document chiffré")
        result = document.tobytes()
        document.close()
        return result

    def register_device(self, device_uuid=None):
        response = self.client.post(
            reverse("drm-device-register"),
            {
                "device_uuid": str(device_uuid or self.device_uuid),
                "label": "Téléphone test",
            },
            format="json",
            secure=True,
        )
        return response

    def issue_license(self, document=None, device_uuid=None):
        return self.client.post(
            reverse(
                "drm-document-license",
                kwargs={"document_id": (document or self.document).pk},
            ),
            {"device_uuid": str(device_uuid or self.device_uuid)},
            format="json",
            secure=True,
        )

    def test_device_limit_and_authenticated_registration(self):
        self.assertEqual(self.register_device().status_code, status.HTTP_201_CREATED)
        self.assertEqual(self.register_device().status_code, status.HTTP_200_OK)
        self.assertEqual(self.register_device(uuid.uuid4()).status_code, status.HTTP_201_CREATED)
        self.assertEqual(self.register_device(uuid.uuid4()).status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Device.objects.filter(user=self.user, revoked=False).count(), 2)

    def test_license_is_tls_only_and_stores_only_wrapped_key(self):
        non_tls = self.client.post(
            reverse("drm-document-license", kwargs={"document_id": self.document.pk}),
            {"device_uuid": str(self.device_uuid)},
            format="json",
        )
        self.assertEqual(non_tls.status_code, status.HTTP_403_FORBIDDEN)

        self.assertEqual(self.register_device().status_code, status.HTTP_201_CREATED)
        response = self.issue_license()

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        issued = License.objects.get()
        self.assertNotEqual(
            issued.content_key_wrapped,
            response.data["content_key"],
        )
        self.assertEqual(response.data["device_uuid"], str(self.device_uuid))
        self.assertEqual(response["Cache-Control"], "no-store, private")
        self.assertEqual(Telechargement.objects.filter(user=self.user, document=self.document).count(), 1)
        self.assertAlmostEqual(
            (issued.expires_at - issued.issued_at).total_seconds(),
            timedelta(days=7).total_seconds(),
            delta=2,
        )

    def test_download_is_encrypted_and_uses_a_fresh_nonce(self):
        self.register_device()
        issue = self.issue_license()
        self.assertEqual(issue.status_code, status.HTTP_201_CREATED)
        license_id = issue.data["license_id"]
        content_key = base64.urlsafe_b64decode(issue.data["content_key"])
        url = reverse(
            "drm-document-download",
            kwargs={"document_id": self.document.pk},
        )

        with patch(
            "apps.documents.api.api.get_google_drive_file_bytes",
            return_value=self.pdf_bytes,
        ):
            first = self.client.get(url, {"license": license_id}, secure=True)
            second = self.client.get(url, {"license": license_id}, secure=True)

        self.assertEqual(first.status_code, status.HTTP_200_OK)
        self.assertEqual(first["Content-Type"], "application/octet-stream")
        self.assertNotEqual(first.content[:12], second.content[:12])
        plaintext = AESGCM(content_key).decrypt(first.content[:12], first.content[12:], None)
        watermarked = fitz.open(stream=plaintext, filetype="pdf")
        self.assertIn("mobile@example.com", watermarked[0].get_text())

    def test_user_cannot_use_another_users_device_or_license(self):
        self.register_device()
        issue = self.issue_license()
        other_user = User.objects.create_user(username="other-reader", password="test-password")
        other_client = APIClient()
        other_client.force_authenticate(user=other_user)

        rejected_device = other_client.post(
            reverse("drm-document-license", kwargs={"document_id": self.document.pk}),
            {"device_uuid": str(self.device_uuid)},
            format="json",
            secure=True,
        )
        rejected_license = other_client.get(
            reverse("drm-document-download", kwargs={"document_id": self.document.pk}),
            {"license": issue.data["license_id"]},
            secure=True,
        )

        self.assertEqual(rejected_device.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(rejected_license.status_code, status.HTTP_404_NOT_FOUND)

    def test_screen_capture_event_is_audited_for_the_valid_license(self):
        from apps.documents.models import ScreenCaptureEvent

        self.register_device()
        issue = self.issue_license()
        response = self.client.post(
            reverse("drm-screen-capture", kwargs={"document_id": self.document.pk}),
            {
                "device_uuid": str(self.device_uuid),
                "license_id": issue.data["license_id"],
            },
            format="json",
            secure=True,
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        event = ScreenCaptureEvent.objects.get()
        self.assertEqual(event.user, self.user)
        self.assertEqual(event.document, self.document)
        self.assertEqual(event.device.device_uuid, self.device_uuid)

    def test_license_quota_and_renewal_after_soft_delete(self):
        self.register_device()
        self.assertEqual(self.issue_license().status_code, status.HTTP_201_CREATED)
        next_document = self.create_document("Second book")

        with override_settings(DRM_MAX_OFFLINE_LICENSES=1):
            quota_response = self.issue_license(next_document)
        self.assertEqual(quota_response.status_code, status.HTTP_403_FORBIDDEN)

        license = License.objects.get()
        license.expires_at = timezone.now() - timedelta(days=1)
        license.save(update_fields=["expires_at"])
        self.document.delete = True
        self.document.save(update_fields=["delete"])

        renewal = self.client.post(
            reverse("drm-license-renew", kwargs={"license_id": license.pk}),
            secure=True,
        )
        self.assertEqual(renewal.status_code, status.HTTP_404_NOT_FOUND)

    def test_unauthenticated_mobile_drm_route_returns_401(self):
        self.client.force_authenticate(user=None)
        response = self.client.post(
            reverse("drm-device-register"),
            {"device_uuid": str(self.device_uuid)},
            format="json",
            secure=True,
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
