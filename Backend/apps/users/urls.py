from django.urls import include, path

from apps.documents.api.api import LoginView, LogoutView, SessionView
from apps.users.views.mobile import (
    MobileCurrentUserView,
    MobileLoginView,
    MobileLogoutView,
    MobileRegistrationView,
)
from apps.users.views.web import GoogleLoginView

urlpatterns = [
    # Endpoints web classiques : session + cookie + CSRF.
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("session/", SessionView.as_view(), name="session"),
    path("auth/google/", GoogleLoginView.as_view(), name="google_login"),

    # Endpoints mobile token-only. On les place avant le bloc dj-rest-auth pour
    # éviter qu'une vue générique Web prenne la route /auth/user/.
    path("auth/login-mobile/", MobileLoginView.as_view(), name="mobile_login"),
    path("auth/register-mobile/", MobileRegistrationView.as_view(), name="mobile_register"),
    path("auth/logout-mobile/", MobileLogoutView.as_view(), name="mobile_logout"),
    path("auth/user/", MobileCurrentUserView.as_view(), name="mobile_current_user"),

    # Bloc Web DRF standards conservé.
    path("auth/", include("dj_rest_auth.urls")),
    path("auth/registration/", include("dj_rest_auth.registration.urls")),

    # Alias de compatibilité temporaire pour les anciens clients mobiles.
    path("login-mobile/", MobileLoginView.as_view(), name="mobile_login_legacy"),
    path("register-mobile/", MobileRegistrationView.as_view(), name="mobile_register_legacy"),
    path("logout-mobile/", MobileLogoutView.as_view(), name="mobile_logout_legacy"),
]
