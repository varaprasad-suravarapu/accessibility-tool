from audits.models import Scan


def update_scan_status(
    scan: Scan,
    status: str,
    results: dict | None = None,
    error_message: str = "",
) -> Scan:
    """Update a scan job's status and optional results."""

    valid_statuses = Scan.Status.values

    if status not in valid_statuses:
        raise ValueError(f"Invalid scan status: {status}")

    scan.status = status

    if results is not None:
        scan.results = results

    scan.error_message = error_message

    scan.save(
        update_fields=[
            "status",
            "results",
            "error_message",
            "updated_at",
        ]
    )

    return scan