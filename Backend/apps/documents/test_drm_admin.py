from datetime import timedelta
from unittest.mock import Mock

from django.contrib.admin.sites import AdminSite
from django.test import RequestFactory, TestCase
from django.utils import timezone

from apps.documents.admin import DeviceAdmin, DocumentAdmin, LicenseAdmin
from apps.documents.models import Device, Document, DrmRevocation, License
from apps.users.models import User


class DrmAdminTests(TestCase):
    def setUp(self):
        self.site = AdminSite()
        self.factory = RequestFactory()
        self.editor = User.objects.create_user(
            username="editor",
            password="test-password",
            role="editor",
            is_staff=True,
        )
        self.reader = User.objects.create_user(
            username="reader",
            password="test-password",
            role="reader",
            is_staff=True,
        )
        self.user = User.objects.create_user(username="license-owner", password="test-password")
        self.document = Document.objects.create(
            type="livre",
            nom="Document admin",
            lien_telechargement="private-drive-id",
        )
        self.device = Device.objects.create(user=self.user, device_uuid="11111111-1111-1111-1111-111111111111")
        self.license = License.objects.create(
            user=self.user,
            document=self.document,
            device=self.device,
            content_key_wrapped="encrypted-key",
            expires_at=timezone.now() + timedelta(days=7),
        )

    def admin_request(self, user):
        request = self.factory.post("/admin/")
        request.user = user
        request._messages = Mock()
        return request

    def test_only_editors_and_super_admins_can_revoke(self):
        license_admin = LicenseAdmin(License, self.site)
        editor_request = self.admin_request(self.editor)
        reader_request = self.admin_request(self.reader)

        self.assertTrue(license_admin.has_change_permission(editor_request))
        self.assertFalse(license_admin.has_change_permission(reader_request))
        self.assertIn("revoke_selected", license_admin.get_actions(editor_request))
        self.assertNotIn("revoke_selected", license_admin.get_actions(reader_request))

    def test_license_revocation_records_actor_and_target(self):
        license_admin = LicenseAdmin(License, self.site)
        license_admin.revoke_selected(
            self.admin_request(self.editor),
            License.objects.filter(pk=self.license.pk),
        )

        self.license.refresh_from_db()
        event = DrmRevocation.objects.get()
        self.assertTrue(self.license.revoked)
        self.assertEqual(event.actor, self.editor)
        self.assertEqual(event.action, "license")
        self.assertEqual(event.license, self.license)
        self.assertEqual(event.document, self.document)

    def test_device_action_revokes_every_device_and_license_for_selected_users(self):
        second_device = Device.objects.create(
            user=self.user,
            device_uuid="22222222-2222-2222-2222-222222222222",
        )
        second_license = License.objects.create(
            user=self.user,
            document=self.document,
            device=second_device,
            content_key_wrapped="encrypted-key",
            expires_at=timezone.now() + timedelta(days=7),
        )
        DeviceAdmin(Device, self.site).revoke_all_for_users(
            self.admin_request(self.editor),
            Device.objects.filter(pk=self.device.pk),
        )

        self.device.refresh_from_db()
        second_device.refresh_from_db()
        self.license.refresh_from_db()
        second_license.refresh_from_db()
        self.assertTrue(self.device.revoked)
        self.assertTrue(second_device.revoked)
        self.assertTrue(self.license.revoked)
        self.assertTrue(second_license.revoked)
        self.assertEqual(DrmRevocation.objects.filter(action="device", actor=self.editor).count(), 2)

    def test_document_action_revokes_and_audits_all_licenses(self):
        DocumentAdmin(Document, self.site).revoke_document_licenses(
            self.admin_request(self.editor),
            Document.objects.filter(pk=self.document.pk),
        )

        self.license.refresh_from_db()
        event = DrmRevocation.objects.get()
        self.assertTrue(self.license.revoked)
        self.assertEqual(event.actor, self.editor)
        self.assertEqual(event.action, "document_licenses")
        self.assertEqual(event.document, self.document)
