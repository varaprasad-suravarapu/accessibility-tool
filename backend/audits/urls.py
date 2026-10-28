from django.urls import path
from .views import health_check, validate_url, start_scan, scan_status

urlpatterns = [
    path("health/", health_check, name="health-check"),
    path("validate-url/", validate_url, name="validate-url"),
    path("scan/", start_scan, name="start-scan"),
    path("scan/<int:scan_id>/", scan_status, name="scan-status"),
]