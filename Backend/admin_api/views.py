import json
from datetime import datetime

from django.contrib.auth import authenticate, login, logout
from django.db.models import Count, Q
from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.documents.models import Document, Telechargement
from apps.users.models import User
from .permissions import IsAdminUser


class AdminLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        username = (request.data.get('username') or '').strip()
        password = request.data.get('password') or ''

        if not username or not password:
            return Response({'detail': 'Nom d’utilisateur et mot de passe requis.'}, status=400)

        user = authenticate(request, username=username, password=password)
        if user is None or not getattr(user, 'is_active', False):
            return Response({'detail': 'Identifiants invalides.'}, status=401)

        role = 'super_admin' if user.is_superuser else getattr(user, 'role', 'reader')
        if role not in {'super_admin', 'editor'}:
            return Response({'detail': 'Compte non autorisé au panneau d’administration.'}, status=403)

        login(request, user)
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': role,
        })


class AdminLogoutView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, *args, **kwargs):
        logout(request)
        return Response({'detail': 'Déconnexion réussie.'})


class AdminMeView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, *args, **kwargs):
        role = getattr(request.user, 'role', 'reader')
        return Response({
            'id': request.user.id,
            'username': request.user.username,
            'email': request.user.email,
            'role': role,
        })


class AdminDashboardView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, *args, **kwargs):
        today = timezone.now().date()
        documents_by_type = list(
            Document.objects.values('type').annotate(total=Count('id')).order_by('type')
        )
        downloads_by_day = list(
            Telechargement.objects.filter(date_telechargement__date=today)
            .values('document__type')
            .annotate(total=Count('id'))
            .order_by('document__type')
        )
        recent_downloads = list(
            Telechargement.objects.select_related('user', 'document')
            .order_by('-date_telechargement')[:10]
            .values('id', 'date_telechargement', 'user__username', 'document__nom', 'document__type')
        )
        stats = {
            'documents_total': Document.objects.count(),
            'users_total': User.objects.count(),
            'downloads_today': Telechargement.objects.filter(date_telechargement__date=today).count(),
            'documents_by_type': documents_by_type,
            'downloads_by_day': downloads_by_day,
            'recent_downloads': [
                {
                    'id': item['id'],
                    'user': item['user__username'],
                    'document': item['document__nom'],
                    'type': item['document__type'],
                    'date': item['date_telechargement'].isoformat() if item['date_telechargement'] else None,
                }
                for item in recent_downloads
            ],
        }
        return Response(stats)


class AdminUsersView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request, *args, **kwargs):
        q = request.query_params.get('q', '').strip()
        role = request.query_params.get('role', '').strip()
        queryset = User.objects.all().order_by('-date_joined')

        if q:
            queryset = queryset.filter(Q(username__icontains=q) | Q(email__icontains=q))
        if role:
            queryset = queryset.filter(role=role)

        users = [{
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': getattr(user, 'role', 'reader'),
            'date_joined': user.date_joined.isoformat(),
        } for user in queryset[:20]]

        return Response({'results': users, 'count': queryset.count()})
