import ipaddress
import socket
from urllib.parse import urlparse


def validate_public_url(url: str) -> str:
    """
    Validate a URL before allowing an accessibility audit.

    Reject unsupported schemes, local/internal hostnames,
    and private or non-public IP addresses.
    """
    if not isinstance(url, str) or not url.strip():
        raise ValueError("A website URL is required.")

    url = url.strip()
    parsed = urlparse(url)

    if parsed.scheme.lower() not in ("http", "https"):
        raise ValueError("Only HTTP and HTTPS URLs are allowed.")

    if not parsed.hostname:
        raise ValueError("Please provide a valid website URL.")

    if parsed.username or parsed.password:
        raise ValueError("URLs containing credentials are not allowed.")

    hostname = parsed.hostname.rstrip(".").lower()

    if hostname == "localhost" or hostname.endswith(".localhost"):
        raise ValueError("Localhost URLs are not allowed.")

    if hostname.endswith(".local") or "." not in hostname:
        raise ValueError("Local or internal hostnames are not allowed.")

    try:
        port = parsed.port
    except ValueError:
        raise ValueError("The URL contains an invalid port.") from None

    if port is not None and not 1 <= port <= 65535:
        raise ValueError("The URL contains an invalid port.")

    # Resolve the hostname and reject non-public IP addresses.
    try:
        addresses = socket.getaddrinfo(
            hostname,
            port or (443 if parsed.scheme == "https" else 80),
            type=socket.SOCK_STREAM,
        )
    except socket.gaierror:
        raise ValueError("The website hostname could not be resolved.") from None

    if not addresses:
        raise ValueError("The website hostname could not be resolved.")

    for address in {item[4][0] for item in addresses}:
        try:
            ip = ipaddress.ip_address(address.split("%")[0])
        except ValueError:
            raise ValueError("The website has an invalid IP address.") from None

        if not ip.is_global:
            raise ValueError("URLs resolving to non-public IP addresses are not allowed.")

    return url