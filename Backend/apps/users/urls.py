from django.urls import path

from apps.documents.api.api import LoginView, LogoutView, SessionView

urlpatterns = [
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("session/", SessionView.as_view(), name="session"),
]
