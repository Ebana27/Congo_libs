from rest_framework.permissions import SAFE_METHODS, BasePermission


class IsSuperAdmin(BasePermission):
    message = "Accès réservé au super-admin."

    def has_permission(self, request, view):
        user = getattr(request, "user", None)
        return bool(user and user.is_authenticated and (user.is_superuser or getattr(user, "role", "") == "super_admin"))


class IsAdminOrReadOnly(BasePermission):
    message = "Permissions insuffisantes pour cette action."

    def has_permission(self, request, view):
        user = getattr(request, "user", None)
        if not user or not user.is_authenticated:
            return False
        if user.is_superuser:
            return True
        role = getattr(user, "role", "")
        if role == "super_admin":
            return True
        if request.method in SAFE_METHODS:
            return True
        return role == "editor"


class IsAdminUser(BasePermission):
    message = "Rôle administratif requis."

    def has_permission(self, request, view):
        user = getattr(request, "user", None)
        return bool(user and user.is_authenticated and (user.is_superuser or getattr(user, "role", "") in {"super_admin", "editor"}))
