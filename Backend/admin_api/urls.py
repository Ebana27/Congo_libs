from django.urls import path

from .views import AdminDashboardView, AdminLoginView, AdminLogoutView, AdminMeView, AdminUsersView

urlpatterns = [
    path('auth/login/', AdminLoginView.as_view(), name='admin_login'),
    path('auth/logout/', AdminLogoutView.as_view(), name='admin_logout'),
    path('auth/me/', AdminMeView.as_view(), name='admin_me'),
    path('dashboard/', AdminDashboardView.as_view(), name='admin_dashboard'),
    path('users/', AdminUsersView.as_view(), name='admin_users'),
]
