import fitz
from django.core.cache import cache
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from unittest.mock import patch

from apps.users.models import User
from .models import Document, DocumentRead


class DocumentReaderApiTests(APITestCase):
    def setUp(self):
        cache.clear()
        self.user = User.objects.create_user(
            username="reader",
            email="reader@example.com",
            password="test-password",
        )
        self.document = Document.objects.create(
            type="livre",
            nom="Lecture protégée",
            lien_telechargement="private-drive-id",
        )
        self.client.force_authenticate(user=self.user)
        self.pdf_bytes = self.make_pdf()

    def tearDown(self):
        cache.clear()

    def make_pdf(self):
        document = fitz.open()
        document.new_page()
        document.new_page()
        result = document.tobytes()
        document.close()
        return result

    def test_meta_and_page_return_only_readable_metadata_and_watermarked_images(self):
        with patch(
            "apps.documents.api.api.get_google_drive_file_bytes",
            return_value=self.pdf_bytes,
        ) as mocked:
            meta = self.client.get(
                reverse("document-reader-meta", kwargs={"pk": self.document.pk})
            )
            self.assertEqual(meta.status_code, status.HTTP_200_OK)
            self.assertEqual(meta.data["title"], "Lecture protégée")
            self.assertEqual(meta.data["pages"], 2)
            self.assertNotIn("private-drive-id", str(meta.data))

            page_url = reverse(
                "document-reader-page",
                kwargs={"pk": self.document.pk, "page": 1},
            )
            page = self.client.get(
                page_url,
                {"session": meta.data["reading_session"]},
            )

        self.assertEqual(page.status_code, status.HTTP_200_OK)
        self.assertEqual(page["Content-Type"], "image/png")
        self.assertEqual(page["Content-Disposition"], "inline")
        self.assertEqual(page["Cache-Control"], "no-store, private")
        self.assertEqual(page["X-Content-Type-Options"], "nosniff")
        self.assertTrue(page.content.startswith(b"\x89PNG\r\n\x1a\n"))
        mocked.assert_called_once_with("private-drive-id")

        read = DocumentRead.objects.get()
        self.assertEqual(read.user, self.user)
        self.assertEqual(read.document, self.document)
        self.assertEqual(read.page_number, 1)
        self.assertEqual(str(read.session_id), meta.data["reading_session"])

    def test_unauthenticated_reader_receives_401(self):
        self.client.force_authenticate(user=None)

        meta = self.client.get(
            reverse("document-reader-meta", kwargs={"pk": self.document.pk})
        )
        page = self.client.get(
            reverse(
                "document-reader-page",
                kwargs={"pk": self.document.pk, "page": 1},
            )
        )

        self.assertEqual(meta.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(page.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_soft_deleted_document_and_invalid_page_return_404(self):
        self.document.delete = True
        self.document.save(update_fields=["delete"])

        with patch("apps.documents.api.api.get_google_drive_file_bytes") as mocked:
            meta = self.client.get(
                reverse("document-reader-meta", kwargs={"pk": self.document.pk})
            )
            page = self.client.get(
                reverse(
                    "document-reader-page",
                    kwargs={"pk": self.document.pk, "page": 1},
                )
            )

        self.assertEqual(meta.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(page.status_code, status.HTTP_404_NOT_FOUND)
        mocked.assert_not_called()

    def test_page_requests_reuse_cached_source(self):
        with patch(
            "apps.documents.api.api.get_google_drive_file_bytes",
            return_value=self.pdf_bytes,
        ) as mocked:
            for page_number in (1, 2):
                response = self.client.get(
                    reverse(
                        "document-reader-page",
                        kwargs={"pk": self.document.pk, "page": page_number},
                    ),
                    {"session": "12345678-1234-5678-1234-567812345678"},
                )
                self.assertEqual(response.status_code, status.HTTP_200_OK)

        mocked.assert_called_once_with("private-drive-id")
