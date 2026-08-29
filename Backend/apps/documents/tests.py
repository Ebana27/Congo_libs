from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.users.models import User
from .models import BacDetail, ConcoursDetail, Document, LivreDetail


class DocumentApiTests(APITestCase):
	def setUp(self):
		self.admin = User.objects.create_superuser(username="admin", email="admin@example.com", password="Admin123!")
		self.client.force_authenticate(user=self.admin)

	def create_document(self, document_type="livre"):
		response = self.client.post(
			reverse("document-list-create"),
			{
				"type": document_type,
				"nom": "Document de test",
				"lien_telechargement": "https://example.com/document.pdf",
			},
			format="json",
		)
		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		return Document.objects.get(pk=response.data["id"])

	def test_document_crud_and_soft_delete(self):
		document = self.create_document()
		detail_url = reverse("document-detail", kwargs={"pk": document.pk})

		self.assertEqual(
			self.client.get(reverse("document-list-create")).status_code,
			status.HTTP_200_OK,
		)
		self.assertEqual(self.client.get(detail_url).status_code, status.HTTP_200_OK)

		response = self.client.patch(
			detail_url,
			{"nom": "Document modifie"},
			format="json",
		)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		document.refresh_from_db()
		self.assertEqual(document.nom, "Document modifie")

		response = self.client.put(
			detail_url,
			{
				"type": "livre",
				"nom": "Document remplace",
				"lien_telechargement": "https://example.com/document-2.pdf",
				"delete": False,
			},
			format="json",
		)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		document.refresh_from_db()
		self.assertEqual(document.nom, "Document remplace")

		response = self.client.delete(detail_url)
		self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
		document.refresh_from_db()
		self.assertTrue(document.delete)
		self.assertEqual(self.client.get(detail_url).status_code, status.HTTP_404_NOT_FOUND)

	def test_livre_detail_crud(self):
		document = self.create_document()
		response = self.client.post(
			reverse("livre-list-create"),
			{"document": str(document.pk), "auteur": "Auteur test"},
			format="json",
		)
		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		url = reverse("livre-detail", kwargs={"pk": document.pk})

		self.assertEqual(self.client.get(reverse("livre-list-create")).status_code, status.HTTP_200_OK)
		self.assertEqual(self.client.get(url).status_code, status.HTTP_200_OK)
		self.assertEqual(
			self.client.patch(url, {"auteur": "Nouvel auteur"}, format="json").status_code,
			status.HTTP_200_OK,
		)
		response = self.client.put(
			url,
			{"document": str(document.pk), "auteur": "Auteur remplace", "delete": False},
			format="json",
		)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(self.client.delete(url).status_code, status.HTTP_204_NO_CONTENT)
		self.assertTrue(LivreDetail.objects.get(pk=document.pk).delete)

	def test_concours_detail_crud(self):
		document = self.create_document("concours")
		response = self.client.post(
			reverse("concours-list-create"),
			{
				"document": str(document.pk),
				"ecole": "Ecole test",
				"annee": 2026,
				"matiere": "Mathematiques",
			},
			format="json",
		)
		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		url = reverse("concours-detail", kwargs={"pk": document.pk})

		self.assertEqual(self.client.get(reverse("concours-list-create")).status_code, status.HTTP_200_OK)
		self.assertEqual(self.client.get(url).status_code, status.HTTP_200_OK)
		self.assertEqual(
			self.client.patch(url, {"matiere": "Physique"}, format="json").status_code,
			status.HTTP_200_OK,
		)
		response = self.client.put(
			url,
			{
				"document": str(document.pk),
				"ecole": "Nouvelle ecole",
				"annee": 2027,
				"matiere": "Physique",
				"delete": False,
			},
			format="json",
		)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(self.client.delete(url).status_code, status.HTTP_204_NO_CONTENT)
		self.assertTrue(ConcoursDetail.objects.get(pk=document.pk).delete)

	def test_bac_detail_crud(self):
		document = self.create_document("bac")
		response = self.client.post(
			reverse("bac-list-create"),
			{
				"document": str(document.pk),
				"annee": 2026,
				"matiere": "Sciences",
				"serie": "A",
			},
			format="json",
		)
		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		url = reverse("bac-detail", kwargs={"pk": document.pk})

		self.assertEqual(self.client.get(reverse("bac-list-create")).status_code, status.HTTP_200_OK)
		self.assertEqual(self.client.get(url).status_code, status.HTTP_200_OK)
		self.assertEqual(
			self.client.patch(url, {"serie": "C"}, format="json").status_code,
			status.HTTP_200_OK,
		)
		response = self.client.put(
			url,
			{
				"document": str(document.pk),
				"annee": 2027,
				"matiere": "Sciences",
				"serie": "C",
				"delete": False,
			},
			format="json",
		)
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(self.client.delete(url).status_code, status.HTTP_204_NO_CONTENT)
		self.assertTrue(BacDetail.objects.get(pk=document.pk).delete)

DocumentApiTests.create_document 
DocumentApiTests.test_document_crud_and_soft_delete
DocumentApiTests.test_livre_detail_crud
DocumentApiTests.test_bac_detail_crud
DocumentApiTests.test_concours_detail_crud