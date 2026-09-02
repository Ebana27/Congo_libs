from django.urls import include, path

from apps.documents.api.api import LoginView, LogoutView, SessionView
from apps.users.views import GoogleLoginView, MobileLoginView

urlpatterns = [
    path("login/", LoginView.as_view(), name="login"),
    path("login-mobile/", MobileLoginView.as_view(), name="mobile_login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("session/", SessionView.as_view(), name="session"),
    path("auth/google/", GoogleLoginView.as_view(), name="google_login"),
    path("auth/", include("dj_rest_auth.urls")),
    path("auth/registration/", include("dj_rest_auth.registration.urls")),
]
