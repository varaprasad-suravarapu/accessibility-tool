from unittest.mock import patch

from django.test import SimpleTestCase

from audits.services.scanner import validate_browser_request


class BrowserRequestValidationTests(SimpleTestCase):

    @patch("audits.services.scanner.validate_public_url")
    def test_allows_validated_url(self, mock_validate):
        mock_validate.return_value = "https://example.com"

        result = validate_browser_request("https://example.com")

        self.assertTrue(result)
        mock_validate.assert_called_once_with("https://example.com")

    @patch("audits.services.scanner.validate_public_url")
    def test_rejects_invalid_url(self, mock_validate):
        mock_validate.side_effect = ValueError("Invalid URL.")

        result = validate_browser_request("http://localhost")

        self.assertFalse(result)

    @patch("audits.services.scanner.validate_public_url")
    def test_rejects_dns_errors(self, mock_validate):
        mock_validate.side_effect = OSError("DNS error")

        result = validate_browser_request("https://example.com")

        self.assertFalse(result)