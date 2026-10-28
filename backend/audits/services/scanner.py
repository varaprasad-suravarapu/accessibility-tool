from pathlib import Path

from playwright.sync_api import sync_playwright

from .url_validator import validate_public_url


AXE_SCRIPT_PATH = Path(__file__).with_name("axe.min.js")

def validate_browser_request(url: str) -> bool:
    """Return whether a browser request passes URL validation."""
    try:
        validate_public_url(url)
    except (ValueError, OSError):
        return False

    return True


def scan_website(url: str) -> dict:
    """Run axe-core checks on a validated public website."""

    url = validate_public_url(url)

    if not AXE_SCRIPT_PATH.exists():
        raise FileNotFoundError("axe.min.js was not found.")

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch()

        try:
            context = browser.new_context()

            def handle_route(route):
                if not validate_browser_request(route.request.url):
                    route.abort()
                    return

                route.continue_()

            context.route("**/*", handle_route)

            page = context.new_page()
            page.set_default_timeout(15000)
            page.set_default_navigation_timeout(20000)

            page.goto(
                url,
                wait_until="domcontentloaded",
                timeout=20000,
            )

            page.add_script_tag(path=str(AXE_SCRIPT_PATH))

            results = page.evaluate(
                """async () => await axe.run(document, {
                    runOnly: {
                        type: "tag",
                        values: [
                            "wcag2a",
                            "wcag2aa",
                            "wcag21a",
                            "wcag21aa",
                            "wcag22aa",
                            "best-practice"
                        ]
                    }
                })"""
            )

            return {
                "url": page.url,
                "page_title": page.title(),
                "violations": results["violations"],
                "violation_count": len(results["violations"]),
                "passes_count": len(results["passes"]),
                "incomplete_count": len(results["incomplete"]),
            }

        finally:
            browser.close()