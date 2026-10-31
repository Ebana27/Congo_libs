from django.contrib import admin

from .models import (
    BacDetail,
    ConcoursDetail,
    Device,
    Document,
    DocumentRead,
    DrmRevocation,
    License,
    LivreDetail,
    ScreenCaptureEvent,
    Telechargement,
)


DRM_ADMIN_ROLES = {"super_admin", "editor"}
READ_ONLY_ADMIN_ROLES = DRM_ADMIN_ROLES | {"reader"}


def can_revoke_drm(user):
    return user.is_superuser or getattr(user, "role", None) in DRM_ADMIN_ROLES


class DrmAdminMixin:
    def has_module_permission(self, request):
        return request.user.is_staff and getattr(request.user, "role", None) in READ_ONLY_ADMIN_ROLES

    def has_view_permission(self, request, obj=None):
        return request.user.is_staff and getattr(request.user, "role", None) in READ_ONLY_ADMIN_ROLES

    def has_change_permission(self, request, obj=None):
        return request.user.is_staff and can_revoke_drm(request.user)

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    def get_actions(self, request):
        actions = super().get_actions(request)
        if not can_revoke_drm(request.user):
            actions.pop("revoke_selected", None)
            actions.pop("revoke_all_for_users", None)
            actions.pop("revoke_document_licenses", None)
        return actions


class DrmReadOnlyAdmin:
    def has_module_permission(self, request):
        return request.user.is_staff and getattr(request.user, "role", None) in READ_ONLY_ADMIN_ROLES

    def has_view_permission(self, request, obj=None):
        return request.user.is_staff and getattr(request.user, "role", None) in READ_ONLY_ADMIN_ROLES

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(Device)
class DeviceAdmin(DrmAdminMixin, admin.ModelAdmin):
    list_display = ("user", "device_uuid", "label", "created_at", "last_seen", "revoked")
    list_filter = ("revoked",)
    search_fields = ("user__username", "user__email", "device_uuid")
    readonly_fields = ("user", "device_uuid", "label", "created_at", "last_seen")
    actions = ("revoke_all_for_users",)

    @admin.action(description="Révoquer tous les appareils des utilisateurs sélectionnés")
    def revoke_all_for_users(self, request, queryset):
        user_ids = queryset.values_list("user_id", flat=True).distinct()
        devices = Device.objects.filter(user_id__in=user_ids, revoked=False)
        for device in devices.select_related("user"):
            device.revoked = True
            device.save(update_fields=["revoked"])
            DrmRevocation.objects.create(
                actor=request.user,
                action="device",
                device=device,
            )
        License.objects.filter(device__user_id__in=user_ids, revoked=False).update(revoked=True)
        self.message_user(request, "Les appareils et licences concernés ont été révoqués.")

    def save_model(self, request, obj, form, change):
        was_revoked = Device.objects.filter(pk=obj.pk).values_list("revoked", flat=True).first()
        super().save_model(request, obj, form, change)
        if obj.revoked and was_revoked is False:
            DrmRevocation.objects.create(actor=request.user, action="device", device=obj)


@admin.register(License)
class LicenseAdmin(DrmAdminMixin, admin.ModelAdmin):
    list_display = ("user", "document", "device", "issued_at", "expires_at", "revoked")
    list_filter = ("revoked", "issued_at", "expires_at")
    search_fields = ("user__username", "user__email", "document__nom", "device__device_uuid")
    readonly_fields = (
        "user",
        "document",
        "device",
        "content_key_wrapped",
        "issued_at",
        "expires_at",
        "last_renewed_at",
    )
    actions = ("revoke_selected",)

    @admin.action(description="Révoquer les licences sélectionnées")
    def revoke_selected(self, request, queryset):
        licenses = queryset.filter(revoked=False).select_related("document")
        for license in licenses:
            license.revoked = True
            license.save(update_fields=["revoked"])
            DrmRevocation.objects.create(
                actor=request.user,
                action="license",
                license=license,
                document=license.document,
            )
        self.message_user(request, "Les licences sélectionnées ont été révoquées.")

    def save_model(self, request, obj, form, change):
        was_revoked = License.objects.filter(pk=obj.pk).values_list("revoked", flat=True).first()
        super().save_model(request, obj, form, change)
        if obj.revoked and was_revoked is False:
            DrmRevocation.objects.create(
                actor=request.user,
                action="license",
                license=obj,
                document=obj.document,
            )


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ("nom", "type", "date_creation", "delete")
    list_filter = ("type", "delete")
    search_fields = ("nom",)
    actions = ("revoke_document_licenses",)

    def has_module_permission(self, request):
        return request.user.is_staff and getattr(request.user, "role", None) in READ_ONLY_ADMIN_ROLES

    def has_view_permission(self, request, obj=None):
        return request.user.is_staff and getattr(request.user, "role", None) in READ_ONLY_ADMIN_ROLES

    def has_add_permission(self, request):
        return request.user.is_staff and can_revoke_drm(request.user)

    def has_change_permission(self, request, obj=None):
        return request.user.is_staff and can_revoke_drm(request.user)

    def has_delete_permission(self, request, obj=None):
        return False

    def get_actions(self, request):
        actions = super().get_actions(request)
        if not can_revoke_drm(request.user):
            actions.pop("revoke_document_licenses", None)
        return actions

    @admin.action(description="Révoquer toutes les licences des documents sélectionnés")
    def revoke_document_licenses(self, request, queryset):
        for document in queryset:
            licenses = License.objects.filter(document=document, revoked=False)
            for license in licenses:
                DrmRevocation.objects.create(
                    actor=request.user,
                    action="document_licenses",
                    license=license,
                    document=document,
                )
            licenses.update(revoked=True)
        self.message_user(request, "Les licences des documents sélectionnés ont été révoquées.")


@admin.register(DocumentRead)
class DocumentReadAdmin(DrmReadOnlyAdmin, admin.ModelAdmin):
    list_display = ("user", "document", "page_number", "read_at", "ip_address")
    list_filter = ("read_at",)
    search_fields = ("user__username", "user__email", "document__nom")
    readonly_fields = ("user", "document", "session_id", "page_number", "ip_address", "read_at")


@admin.register(Telechargement)
class TelechargementAdmin(DrmReadOnlyAdmin, admin.ModelAdmin):
    list_display = ("user", "document", "date_telechargement")
    list_filter = ("date_telechargement",)
    search_fields = ("user__username", "user__email", "document__nom")
    readonly_fields = ("user", "document", "date_telechargement")


@admin.register(DrmRevocation)
class DrmRevocationAdmin(DrmReadOnlyAdmin, admin.ModelAdmin):
    list_display = ("actor", "action", "license", "device", "document", "created_at")
    list_filter = ("action", "created_at")
    search_fields = ("actor__username", "actor__email", "document__nom", "device__device_uuid")
    readonly_fields = ("actor", "action", "license", "device", "document", "created_at")


@admin.register(ScreenCaptureEvent)
class ScreenCaptureEventAdmin(DrmReadOnlyAdmin, admin.ModelAdmin):
    list_display = ("user", "document", "device", "captured_at", "ip_address")
    list_filter = ("captured_at",)
    search_fields = ("user__username", "user__email", "document__nom", "device__device_uuid")
    readonly_fields = ("user", "document", "device", "license", "ip_address", "captured_at")


admin.site.register([LivreDetail, ConcoursDetail, BacDetail])
