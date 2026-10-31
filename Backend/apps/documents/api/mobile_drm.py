import base64
import os
import uuid
from datetime import timedelta

from cryptography.fernet import Fernet, InvalidToken
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from django.conf import settings
from django.db import transaction
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import serializers, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from apps.documents.api.api import DocumentSourceUnavailable, get_cached_document_pdf
from apps.documents.models import Device, Document, License, ScreenCaptureEvent, Telechargement
from apps.documents.services.watermark import WatermarkError, watermark_pdf


class DrmConfigurationError(Exception):
    pass


def _master_fernet():
    if not settings.DRM_MASTER_KEY:
        raise DrmConfigurationError
    try:
        return Fernet(settings.DRM_MASTER_KEY.encode("ascii"))
    except (UnicodeError, TypeError, ValueError) as exc:
        raise DrmConfigurationError from exc


def _content_key_response(license, content_key):
    return {
        "license_id": str(license.pk),
        "document_id": str(license.document_id),
        "device_uuid": str(license.device.device_uuid),
        "content_key": base64.urlsafe_b64encode(content_key).decode("ascii"),
        "expires_at": license.expires_at.isoformat(),
        "server_time": timezone.now().isoformat(),
    }


def _secure_response(response):
    response["Cache-Control"] = "no-store, private"
    response["X-Content-Type-Options"] = "nosniff"
    return response


class DrmAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    @staticmethod
    def require_tls(request):
        if not request.is_secure():
            return Response(
                {"detail": "Une connexion HTTPS est requise."},
                status=status.HTTP_403_FORBIDDEN,
            )
        return None


class DeviceRegisterSerializer(serializers.Serializer):
    device_uuid = serializers.UUIDField()
    label = serializers.CharField(required=False, allow_blank=True, max_length=255)


class DeviceRegisterView(DrmAPIView):
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "drm_device_register"

    def post(self, request):
        tls_error = self.require_tls(request)
        if tls_error:
            return tls_error

        serializer = DeviceRegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        device_uuid = serializer.validated_data["device_uuid"]
        label = serializer.validated_data.get("label", "")

        with transaction.atomic():
            request.user.__class__.objects.select_for_update().get(pk=request.user.pk)
            device = Device.objects.select_for_update().filter(
                user=request.user,
                device_uuid=device_uuid,
            ).first()
            if device and device.revoked:
                return Response(
                    {"detail": "Cet appareil a été révoqué."},
                    status=status.HTTP_403_FORBIDDEN,
                )
            created = device is None
            if created:
                active_devices = Device.objects.filter(user=request.user, revoked=False).count()
                if active_devices >= settings.DRM_MAX_DEVICES:
                    return Response(
                        {"detail": "Le nombre maximal d’appareils est atteint."},
                        status=status.HTTP_403_FORBIDDEN,
                    )
                device = Device.objects.create(
                    user=request.user,
                    device_uuid=device_uuid,
                    label=label,
                )
            else:
                device.label = label
                device.last_seen = timezone.now()
                device.save(update_fields=["label", "last_seen"])

        return _secure_response(
            Response(
                {
                    "device_uuid": str(device.device_uuid),
                    "label": device.label,
                    "created_at": device.created_at.isoformat(),
                },
                status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
            )
        )


class LicenseRequestSerializer(serializers.Serializer):
    device_uuid = serializers.UUIDField()


class DocumentLicenseView(DrmAPIView):
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "drm_license"

    def post(self, request, document_id):
        tls_error = self.require_tls(request)
        if tls_error:
            return tls_error

        serializer = LicenseRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            fernet = _master_fernet()
        except DrmConfigurationError:
            return Response(
                {"detail": "Le service de licences n’est pas configuré."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        document = get_object_or_404(Document.objects.filter(delete=False), pk=document_id)
        now = timezone.now()

        with transaction.atomic():
            device = get_object_or_404(
                Device.objects.select_for_update().filter(user=request.user, revoked=False),
                device_uuid=serializer.validated_data["device_uuid"],
            )
            existing = License.objects.filter(
                user=request.user,
                document=document,
                device=device,
                revoked=False,
            ).first()
            has_document_license = License.objects.filter(
                user=request.user,
                document=document,
                revoked=False,
                expires_at__gt=now,
                device__revoked=False,
            ).exists()
            active_document_count = (
                License.objects.filter(
                    user=request.user,
                    revoked=False,
                    expires_at__gt=now,
                    device__revoked=False,
                )
                .values("document_id")
                .distinct()
                .count()
            )
            if not has_document_license and active_document_count >= settings.DRM_MAX_OFFLINE_LICENSES:
                return Response(
                    {"detail": "Le quota de documents hors ligne est atteint."},
                    status=status.HTTP_403_FORBIDDEN,
                )

            content_key = AESGCM.generate_key(bit_length=256)
            if existing:
                existing.revoked = True
                existing.save(update_fields=["revoked"])
            license = License.objects.create(
                user=request.user,
                document=document,
                device=device,
                content_key_wrapped=fernet.encrypt(content_key).decode("ascii"),
                expires_at=now + timedelta(days=settings.DRM_LICENSE_DAYS),
            )
            Telechargement.objects.create(user=request.user, document=document)
            device.last_seen = now
            device.save(update_fields=["last_seen"])

        return _secure_response(
            Response(_content_key_response(license, content_key), status=status.HTTP_201_CREATED)
        )


class LicenseIdQuerySerializer(serializers.Serializer):
    license = serializers.UUIDField()


class EncryptedDocumentDownloadView(DrmAPIView):
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "drm_download"

    def get(self, request, document_id):
        tls_error = self.require_tls(request)
        if tls_error:
            return tls_error

        query = LicenseIdQuerySerializer(data=request.query_params)
        query.is_valid(raise_exception=True)
        document = get_object_or_404(Document.objects.filter(delete=False), pk=document_id)
        license = get_object_or_404(
            License.objects.select_related("device", "document").filter(
                user=request.user,
                document=document,
                device__user=request.user,
                device__revoked=False,
                revoked=False,
                expires_at__gt=timezone.now(),
            ),
            pk=query.validated_data["license"],
        )

        try:
            content_key = _master_fernet().decrypt(license.content_key_wrapped.encode("ascii"))
        except (DrmConfigurationError, InvalidToken, UnicodeError):
            return Response(
                {"detail": "La licence ne peut pas être vérifiée."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        try:
            pdf_bytes = get_cached_document_pdf(document, request.user)
            watermarked_pdf = watermark_pdf(
                pdf_bytes,
                user_id=request.user.pk,
                email=request.user.email,
                session_id=uuid.uuid4(),
            )
        except DocumentSourceUnavailable:
            return Response(
                {"detail": "Le document est temporairement indisponible."},
                status=status.HTTP_502_BAD_GATEWAY,
            )
        except WatermarkError:
            return Response(
                {"detail": "Le document PDF ne peut pas être préparé."},
                status=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

        nonce = os.urandom(12)
        encrypted_pdf = nonce + AESGCM(content_key).encrypt(nonce, watermarked_pdf, None)
        response = _secure_response(HttpResponse(encrypted_pdf, content_type="application/octet-stream"))
        response["Content-Disposition"] = f'attachment; filename="{document.pk}.pdf.enc"'
        license.device.last_seen = timezone.now()
        license.device.save(update_fields=["last_seen"])
        return response


class LicenseRenewView(DrmAPIView):
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "drm_license_renew"

    def post(self, request, license_id):
        tls_error = self.require_tls(request)
        if tls_error:
            return tls_error

        license = get_object_or_404(
            License.objects.select_related("document", "device").filter(
                user=request.user,
                document__delete=False,
                device__user=request.user,
                device__revoked=False,
                revoked=False,
            ),
            pk=license_id,
        )
        try:
            content_key = _master_fernet().decrypt(license.content_key_wrapped.encode("ascii"))
        except (DrmConfigurationError, InvalidToken, UnicodeError):
            return Response(
                {"detail": "La licence ne peut pas être vérifiée."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        now = timezone.now()
        license.expires_at = now + timedelta(days=settings.DRM_LICENSE_DAYS)
        license.last_renewed_at = now
        license.save(update_fields=["expires_at", "last_renewed_at"])
        license.device.last_seen = now
        license.device.save(update_fields=["last_seen"])
        return _secure_response(Response(_content_key_response(license, content_key)))


class ScreenCaptureEventSerializer(serializers.Serializer):
    device_uuid = serializers.UUIDField()
    license_id = serializers.UUIDField()


class ScreenCaptureEventView(DrmAPIView):
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "drm_screenshot_event"

    def post(self, request, document_id):
        tls_error = self.require_tls(request)
        if tls_error:
            return tls_error

        serializer = ScreenCaptureEventSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        document = get_object_or_404(Document.objects.filter(delete=False), pk=document_id)
        license = get_object_or_404(
            License.objects.select_related("device").filter(
                user=request.user,
                document=document,
                device__user=request.user,
                device__device_uuid=serializer.validated_data["device_uuid"],
                device__revoked=False,
                revoked=False,
                expires_at__gt=timezone.now(),
            ),
            pk=serializer.validated_data["license_id"],
        )
        event = ScreenCaptureEvent.objects.create(
            user=request.user,
            document=document,
            device=license.device,
            license=license,
            ip_address=request.META.get("REMOTE_ADDR"),
        )
        return _secure_response(
            Response({"captured_at": event.captured_at.isoformat()}, status=status.HTTP_201_CREATED)
        )
