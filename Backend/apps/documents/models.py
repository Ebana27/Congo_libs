import uuid

from django.conf import settings
from django.db import models


class Document(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    TYPE_CHOICES = [('livre', 'Livre'), ('concours', 'Concours'), ('bac', 'Bac')]
    type = models.CharField(max_length=10, choices=TYPE_CHOICES, db_index=True)
    nom = models.CharField(max_length=255, db_index=True)
    date_creation = models.DateTimeField(auto_now_add=True, db_index=True)
    lien_telechargement = models.CharField(max_length=500, db_index=True, help_text="Google Drive file ID only")
    delete = models.BooleanField(default=False, db_index=True)


class LivreDetail(models.Model):
    document = models.OneToOneField(Document, on_delete=models.CASCADE, primary_key=True)
    auteur = models.CharField(max_length=255, db_index=True)
    delete = models.BooleanField(default=False, db_index=True)


class ConcoursDetail(models.Model):
    document = models.OneToOneField(Document, on_delete=models.CASCADE, primary_key=True)
    ecole = models.CharField(max_length=255, db_index=True)
    annee = models.IntegerField(db_index=True)
    matiere = models.CharField(max_length=100, db_index=True)
    delete = models.BooleanField(default=False, db_index=True)


class BacDetail(models.Model):
    document = models.OneToOneField(Document, on_delete=models.CASCADE, primary_key=True)
    annee = models.IntegerField(db_index=True)
    matiere = models.CharField(max_length=100, db_index=True)
    niveau = models.CharField(max_length=100, blank=True, db_index=True)
    serie = models.CharField(max_length=10, db_index=True)
    delete = models.BooleanField(default=False, db_index=True)


class Telechargement(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, db_index=True)
    document = models.ForeignKey(Document, on_delete=models.CASCADE, db_index=True)
    date_telechargement = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ["-date_telechargement"]


class Device(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="drm_devices")
    device_uuid = models.UUIDField()
    label = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    last_seen = models.DateTimeField(null=True, blank=True)
    revoked = models.BooleanField(default=False)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["user", "device_uuid"], name="uniq_device_user_uuid"),
        ]


class License(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="document_licenses")
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name="licenses")
    device = models.ForeignKey(Device, on_delete=models.CASCADE, related_name="licenses")
    content_key_wrapped = models.TextField()
    issued_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    revoked = models.BooleanField(default=False)
    last_renewed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=["user", "document", "device"], name="lic_user_doc_device_idx"),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=["user", "document", "device"],
                condition=models.Q(revoked=False),
                name="uniq_active_license_device",
            ),
        ]


class DocumentRead(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="document_reads")
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name="read_events")
    session_id = models.UUIDField()
    page_number = models.PositiveIntegerField()
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    read_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["user", "document", "read_at"], name="read_user_doc_date_idx"),
        ]


class DrmRevocation(models.Model):
    ACTION_CHOICES = [
        ("license", "Licence"),
        ("device", "Appareil"),
        ("document_licenses", "Licences du document"),
    ]

    actor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="drm_revocations",
    )
    action = models.CharField(max_length=24, choices=ACTION_CHOICES)
    license = models.ForeignKey(
        License,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="revocation_events",
    )
    device = models.ForeignKey(
        Device,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="revocation_events",
    )
    document = models.ForeignKey(
        Document,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="revocation_events",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["actor", "created_at"], name="rev_actor_date_idx"),
        ]


class ScreenCaptureEvent(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="screen_capture_events")
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name="screen_capture_events")
    device = models.ForeignKey(Device, on_delete=models.CASCADE, related_name="screen_capture_events")
    license = models.ForeignKey(
        License,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="screen_capture_events",
    )
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    captured_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["user", "document", "captured_at"], name="capture_user_doc_date_idx"),
        ]
