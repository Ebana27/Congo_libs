from datetime import datetime, timezone
from io import BytesIO

import fitz
from django.conf import settings


MAX_PDF_SIZE_BYTES = settings.DRM_MAX_PDF_SIZE


class WatermarkError(Exception):
    """Raised when a PDF cannot be safely watermarked."""


class InvalidPdfPage(WatermarkError):
    """Raised when a requested page does not exist."""


def _validate_pdf_bytes(pdf_bytes):
    if not isinstance(pdf_bytes, bytes) or not pdf_bytes:
        raise WatermarkError("Le document PDF est vide ou invalide.")
    if len(pdf_bytes) > MAX_PDF_SIZE_BYTES:
        raise WatermarkError("Le document PDF dépasse la taille maximale autorisée.")


def _stamp_page(page, *, user_id, email, timestamp_text):
    identifier = f"user:{user_id} | {timestamp_text}"
    watermark_text = f"{email} | {identifier}"
    center = fitz.Point(page.rect.width / 2, page.rect.height / 2)
    baseline = fitz.Point(page.rect.width * 0.08, page.rect.height * 0.55)
    page.insert_text(
        baseline,
        watermark_text,
        fontname="helv",
        fontsize=16,
        color=(0.45, 0.45, 0.45),
        fill_opacity=0.22,
        morph=(center, fitz.Matrix(35)),
        overlay=True,
    )
    page.insert_text(
        fitz.Point(18, page.rect.height - 12),
        identifier,
        fontname="helv",
        fontsize=7,
        color=(0.35, 0.35, 0.35),
        fill_opacity=0.75,
        overlay=True,
    )


def _timestamp_text(timestamp):
    timestamp = timestamp or datetime.now(timezone.utc)
    return timestamp.astimezone(timezone.utc).isoformat(timespec="seconds")


def pdf_page_count(pdf_bytes):
    _validate_pdf_bytes(pdf_bytes)
    try:
        with fitz.open(stream=pdf_bytes, filetype="pdf") as document:
            if document.needs_pass:
                raise WatermarkError("Les PDF protégés par mot de passe ne peuvent pas être affichés.")
            if document.page_count == 0:
                raise WatermarkError("Le PDF ne contient aucune page.")
            return document.page_count
    except WatermarkError:
        raise
    except (fitz.FileDataError, fitz.EmptyFileError, UnicodeError, ValueError, RuntimeError) as exc:
        raise WatermarkError("Le PDF ne peut pas être filigrané.") from exc


def render_pdf_page(pdf_bytes, *, page_number, user_id, email, timestamp=None):
    _validate_pdf_bytes(pdf_bytes)
    timestamp_text = _timestamp_text(timestamp)

    try:
        with fitz.open(stream=pdf_bytes, filetype="pdf") as document:
            if document.needs_pass:
                raise WatermarkError("Les PDF protégés par mot de passe ne peuvent pas être affichés.")
            if page_number < 1 or page_number > document.page_count:
                raise InvalidPdfPage("La page demandée n'existe pas.")
            if document.page_count == 0:
                raise WatermarkError("Le PDF ne contient aucune page.")

            page = document.load_page(page_number - 1)
            _stamp_page(page, user_id=user_id, email=email, timestamp_text=timestamp_text)
            return page.get_pixmap(matrix=fitz.Matrix(1.5, 1.5), alpha=False).tobytes("png")
    except (WatermarkError, InvalidPdfPage):
        raise
    except (fitz.FileDataError, fitz.EmptyFileError, UnicodeError, ValueError, RuntimeError) as exc:
        raise WatermarkError("Le PDF ne peut pas être filigrané.") from exc


def watermark_pdf(pdf_bytes, *, user_id, email, session_id, timestamp=None):
    _validate_pdf_bytes(pdf_bytes)
    timestamp_text = _timestamp_text(timestamp)

    try:
        with fitz.open(stream=pdf_bytes, filetype="pdf") as document:
            if document.needs_pass:
                raise WatermarkError("Les PDF protégés par mot de passe ne peuvent pas être affichés.")
            if document.page_count == 0:
                raise WatermarkError("Le PDF ne contient aucune page.")

            for page in document:
                _stamp_page(page, user_id=user_id, email=email, timestamp_text=timestamp_text)

            metadata = document.metadata
            metadata["producer"] = "Congo Libs DRM"
            metadata["keywords"] = f"reading-session:{session_id}"
            document.set_metadata(metadata)
            return document.tobytes(garbage=4, deflate=True)
    except WatermarkError:
        raise
    except (fitz.FileDataError, fitz.EmptyFileError, UnicodeError, ValueError, RuntimeError) as exc:
        raise WatermarkError("Le PDF ne peut pas être filigrané.") from exc
