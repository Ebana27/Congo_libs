from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

User = get_user_model()


class AdminApiTests(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_user(
            username='adminuser',
            email='admin@example.com',
            password='StrongPass123!',
        )
        self.admin.role = 'super_admin'
        self.admin.save(update_fields=['role'])

    def test_admin_login_success(self):
        response = self.client.post(
            reverse('admin_login'),
            {'username': 'adminuser', 'password': 'StrongPass123!'},
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['role'], 'super_admin')

    def test_admin_dashboard_requires_auth(self):
        response = self.client.get(reverse('admin_dashboard'))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
