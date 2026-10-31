from django.urls import path

from .api.mobile_drm import (
    DeviceRegisterView,
    DocumentLicenseView,
    EncryptedDocumentDownloadView,
    LicenseRenewView,
    ScreenCaptureEventView,
)

urlpatterns = [
    path("devices/register/", DeviceRegisterView.as_view(), name="drm-device-register"),
    path(
        "documents/<uuid:document_id>/license/",
        DocumentLicenseView.as_view(),
        name="drm-document-license",
    ),
    path(
        "documents/<uuid:document_id>/download/",
        EncryptedDocumentDownloadView.as_view(),
        name="drm-document-download",
    ),
    path(
        "documents/<uuid:document_id>/screen-capture/",
        ScreenCaptureEventView.as_view(),
        name="drm-screen-capture",
    ),
    path("licenses/<uuid:license_id>/renew/", LicenseRenewView.as_view(), name="drm-license-renew"),
]
