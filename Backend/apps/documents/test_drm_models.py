import uuid
from datetime import timedelta

from django.db import IntegrityError, transaction
from django.test import TestCase
from django.utils import timezone

from apps.users.models import User
from .models import Device, Document, License


class DrmModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="reader", password="test-password")
        self.document = Document.objects.create(
            type="livre",
            nom="Document DRM",
            lien_telechargement="private-drive-id",
        )
        self.device = Device.objects.create(user=self.user, device_uuid=uuid.uuid4(), label="Téléphone")

    def create_license(self, **overrides):
        values = {
            "user": self.user,
            "document": self.document,
            "device": self.device,
            "content_key_wrapped": "encrypted-key",
            "expires_at": timezone.now() + timedelta(days=14),
        }
        values.update(overrides)
        return License.objects.create(**values)

    def test_device_uuid_is_unique_per_user(self):
        device_uuid = uuid.uuid4()
        Device.objects.create(user=self.user, device_uuid=device_uuid)

        with self.assertRaises(IntegrityError), transaction.atomic():
            Device.objects.create(user=self.user, device_uuid=device_uuid)

        another_user = User.objects.create_user(username="reader-two", password="test-password")
        Device.objects.create(user=another_user, device_uuid=device_uuid)

    def test_only_one_non_revoked_license_exists_per_user_document_device(self):
        license = self.create_license()

        with self.assertRaises(IntegrityError), transaction.atomic():
            self.create_license()

        license.revoked = True
        license.save(update_fields=["revoked"])
        replacement = self.create_license()
        self.assertFalse(replacement.revoked)

    def test_deleting_user_document_or_device_cascades_to_licenses(self):
        license = self.create_license()
        Document.objects.filter(pk=self.document.pk).delete()
        self.assertFalse(License.objects.filter(pk=license.pk).exists())

        replacement_document = Document.objects.create(
            type="livre",
            nom="Second document DRM",
            lien_telechargement="another-private-drive-id",
        )
        license = self.create_license(document=replacement_document)
        self.device.delete()
        self.assertFalse(License.objects.filter(pk=license.pk).exists())

        replacement_device = Device.objects.create(user=self.user, device_uuid=uuid.uuid4())
        license = self.create_license(device=replacement_device)
        self.user.delete()
        self.assertFalse(License.objects.filter(pk=license.pk).exists())
