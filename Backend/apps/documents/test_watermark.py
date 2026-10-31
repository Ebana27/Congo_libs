import fitz
from django.test import SimpleTestCase
from unittest.mock import patch

from .services.watermark import WatermarkError, watermark_pdf


class WatermarkPdfTests(SimpleTestCase):
    def make_pdf(self, *, encrypted=False):
        document = fitz.open()
        for _ in range(2):
            page = document.new_page()
            page.insert_text((72, 72), "Document test")
        if encrypted:
            result = document.tobytes(
                encryption=fitz.PDF_ENCRYPT_AES_256,
                owner_pw="owner-password",
                user_pw="user-password",
            )
        else:
            result = document.tobytes()
        document.close()
        return result

    def watermark(self, pdf_bytes):
        return watermark_pdf(
            pdf_bytes,
            user_id=42,
            email="élodie@example.com",
            session_id="session-uuid",
        )

    def test_each_page_contains_email_and_discreet_identifier(self):
        source = self.make_pdf()
        document = fitz.open(stream=self.watermark(source), filetype="pdf")

        self.assertEqual(document.page_count, 2)
        for page in document:
            page_text = page.get_text()
            self.assertIn("élodie@example.com", page_text)
            self.assertIn("user:42", page_text)
        self.assertEqual(document.metadata["producer"], "Congo Libs DRM")
        self.assertEqual(document.metadata["keywords"], "reading-session:session-uuid")

    def test_empty_corrupt_and_password_protected_pdfs_are_rejected(self):
        for invalid_pdf in (b"", b"not a PDF", self.make_pdf(encrypted=True)):
            with self.subTest(pdf=invalid_pdf[:12]), self.assertRaises(WatermarkError):
                self.watermark(invalid_pdf)

    def test_oversized_pdf_is_rejected(self):
        with patch("apps.documents.services.watermark.MAX_PDF_SIZE_BYTES", 8):
            with self.assertRaises(WatermarkError):
                self.watermark(self.make_pdf())
