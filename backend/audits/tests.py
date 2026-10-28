from unittest.mock import patch

from django.test import SimpleTestCase, TestCase

from .services.url_validator import validate_public_url

from .services.scanner import validate_browser_request

from audits.models import Scan
from audits.services.scan_service import update_scan_status

from rest_framework.test import APIClient

class URLValidatorTests(SimpleTestCase):

    def test_rejects_empty_url(self):
        with self.assertRaises(ValueError):
            validate_public_url("")

    def test_rejects_unsupported_scheme(self):
        with self.assertRaises(ValueError):
            validate_public_url("ftp://example.com")

    def test_rejects_localhost(self):
        with self.assertRaises(ValueError):
            validate_public_url("http://localhost")

    def test_rejects_private_ip(self):
        with self.assertRaises(ValueError):
            validate_public_url("http://127.0.0.1")

    @patch("audits.services.url_validator.socket.getaddrinfo")
    def test_accepts_public_website(self, mock_getaddrinfo):
        mock_getaddrinfo.return_value = [
            (2, 1, 6, "", ("93.184.216.34", 443))
        ]

        result = validate_public_url("https://example.com")

        self.assertEqual(result, "https://example.com")

    def test_rejects_localhost_subdomain(self):
        with self.assertRaises(ValueError):
            validate_public_url("http://admin.localhost")

    def test_rejects_local_hostname(self):
        with self.assertRaises(ValueError):
            validate_public_url("http://printer.local")

    def test_rejects_url_with_credentials(self):
        with self.assertRaises(ValueError):
            validate_public_url("https://user:pass@example.com")

    def test_rejects_invalid_port(self):
        with self.assertRaises(ValueError):
            validate_public_url("https://example.com:invalid")

    def test_rejects_url_without_hostname(self):
        with self.assertRaises(ValueError):
            validate_public_url("https:///path")

    @patch("audits.services.url_validator.socket.getaddrinfo")
    def test_rejects_hostname_resolving_to_private_ip(self, mock_getaddrinfo):
        mock_getaddrinfo.return_value = [
            (2, 1, 6, "", ("192.168.1.10", 443))
        ]

        with self.assertRaises(ValueError):
            validate_public_url("https://example.com")

class BrowserRequestTests(SimpleTestCase):

    @patch("audits.services.scanner.validate_public_url")
    def test_allows_validated_public_url(self, mock_validate):
        mock_validate.return_value = "https://example.com"

        result = validate_browser_request("https://example.com")

        self.assertTrue(result)
        mock_validate.assert_called_once_with("https://example.com")

    @patch("audits.services.scanner.validate_public_url")
    def test_rejects_invalid_url(self, mock_validate):
        mock_validate.side_effect = ValueError("Private IP not allowed")

        result = validate_browser_request("http://127.0.0.1")

        self.assertFalse(result)

    @patch("audits.services.scanner.validate_public_url")
    def test_rejects_url_when_dns_resolution_fails(self, mock_validate):
        mock_validate.side_effect = OSError("DNS resolution failed")

        result = validate_browser_request("https://example.com")

        self.assertFalse(result)

class ScanServiceTests(SimpleTestCase):

    def test_rejects_invalid_status(self):
        scan = Scan(
            url="https://example.com",
            status=Scan.Status.PENDING,
        )

        with self.assertRaises(ValueError):
            update_scan_status(scan, "invalid")

    def test_accepts_valid_status_values(self):
        self.assertEqual(
            Scan.Status.values,
            ["pending", "running", "completed", "failed"],)

    def test_preserves_existing_results_when_not_provided(self):
        scan = Scan(
            id=1,
            url="https://example.com",
            status=Scan.Status.PENDING,
            results={"violation_count": 3},
        )

        with patch.object(Scan, "save") as mock_save:
            update_scan_status(scan, Scan.Status.RUNNING)

        self.assertEqual(
            scan.results,
            {"violation_count": 3},)
        mock_save.assert_called_once()

class ScanServiceDatabaseTests(TestCase):

    def test_saves_status_and_results(self):
        scan = Scan.objects.create(
            url="https://example.com",
            status=Scan.Status.PENDING,
        )

        update_scan_status(
            scan,
            Scan.Status.COMPLETED,
            results={
                "violation_count": 2,
                "passes_count": 10,
            },
        )

        scan.refresh_from_db()

        self.assertEqual(scan.status, Scan.Status.COMPLETED)
        self.assertEqual(
            scan.results,
            {
                "violation_count": 2,
                "passes_count": 10,
            },
        )

class ScanAPITests(TestCase):

    def setUp(self):
        self.client = APIClient()

    @patch("audits.views.validate_public_url")
    def test_validate_url_success(self, mock_validate):
        mock_validate.return_value = "https://example.com"

        response = self.client.post(
            "/api/validate-url/",
            {"url": "https://example.com"},
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["status"], "success")
        self.assertEqual(response.data["url"], "https://example.com")

    @patch("audits.views.validate_public_url")
    def test_validate_url_failure(self, mock_validate):
        mock_validate.side_effect = ValueError("Invalid URL.")

        response = self.client.post(
            "/api/validate-url/",
            {"url": "http://localhost"},
            format="json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["status"], "error")

    @patch("audits.views.validate_public_url")
    def test_start_scan_creates_pending_scan(self, mock_validate):
        mock_validate.return_value = "https://example.com"

        response = self.client.post(
            "/api/scan/",
            {"url": "https://example.com"},
            format="json",
        )

        self.assertEqual(response.status_code, 202)
        self.assertEqual(response.data["status"], Scan.Status.PENDING)

        scan = Scan.objects.get(id=response.data["scan_id"])
        self.assertEqual(scan.url, "https://example.com")
        self.assertEqual(scan.status, Scan.Status.PENDING)

    def test_scan_status_returns_scan_details(self):
        scan = Scan.objects.create(
            url="https://example.com",
            status=Scan.Status.PENDING,
        )

        response = self.client.get(f"/api/scan/{scan.id}/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["scan_id"], scan.id)
        self.assertEqual(response.data["status"], Scan.Status.PENDING)
        self.assertEqual(response.data["url"], "https://example.com")

    def test_scan_status_returns_404_for_missing_scan(self):
        response = self.client.get("/api/scan/999999/")

        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data["message"], "Scan not found.")