from rest_framework import serializers

from apps.documents.models import (
	BacDetail,
	ConcoursDetail,
	Document,
	LivreDetail,
	Telechargement,
)


class PublicDocumentSerializer(serializers.ModelSerializer):
	class Meta:
		model = Document
		fields = [
			"id",
			"type",
			"nom",
			"date_creation",
			"delete",
		]
		read_only_fields = ["id", "date_creation", "delete"]


class DocumentSerializer(PublicDocumentSerializer):
	class Meta(PublicDocumentSerializer.Meta):
		fields = [
			"id",
			"type",
			"nom",
			"date_creation",
			"lien_telechargement",
			"delete",
		]
		read_only_fields = ["id", "date_creation", "delete"]


class LivreDetailSerializer(serializers.ModelSerializer):
	class Meta:
		model = LivreDetail
		fields = ["document", "auteur"]
		read_only_fields = []

	def validate_document(self, document):
		if document.type != "livre":
			raise serializers.ValidationError("Le document doit être de type livre.")
		return document


class ConcoursDetailSerializer(serializers.ModelSerializer):
	class Meta:
		model = ConcoursDetail
		fields = ["document", "ecole", "annee", "matiere"]
		read_only_fields = []

	def validate_document(self, document):
		if document.type != "concours":
			raise serializers.ValidationError("Le document doit être de type concours.")
		return document


class BacDetailSerializer(serializers.ModelSerializer):
	class Meta:
		model = BacDetail
		fields = ["document", "annee", "matiere", "niveau", "serie"]
		read_only_fields = []

	def validate_document(self, document):
		if document.type != "bac":
			raise serializers.ValidationError("Le document doit être de type bac.")
		return document


class TelechargementSerializer(serializers.ModelSerializer):
	class Meta:
		model = Telechargement
		fields = ["id", "document", "date_telechargement"]
		read_only_fields = fields
