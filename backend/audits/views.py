from rest_framework.decorators import api_view
from rest_framework.response import Response

from .services.url_validator import validate_public_url

from .models import Scan


@api_view(["GET"])
def health_check(request):
    return Response({
        "status": "success",
        "message": "AccessAble API is running",
    })


@api_view(["POST"])
def validate_url(request):
    url = request.data.get("url", "")

    try:
        validated_url = validate_public_url(url)
    except ValueError as error:
        return Response({
            "status": "error",
            "message": str(error),
        }, status=400)

    return Response({
        "status": "success",
        "message": "URL validation successful.",
        "url": validated_url,
    })


@api_view(["POST"])
def start_scan(request):
    url = request.data.get("url", "")

    try:
        validated_url = validate_public_url(url)
    except ValueError as error:
        return Response({
            "status": "error",
            "message": str(error),
        }, status=400)

    scan = Scan.objects.create(
        url=validated_url,
        status=Scan.Status.PENDING,
    )

    return Response({
        "status": scan.status,
        "message": "Scan job created. The accessibility scanner is not connected yet.",
        "url": scan.url,
        "scan_id": scan.id,
    }, status=202)

@api_view(["GET"])
def scan_status(request, scan_id):
    try:
        scan = Scan.objects.get(id=scan_id)
    except Scan.DoesNotExist:
        return Response({
            "status": "error",
            "message": "Scan not found.",
        }, status=404)

    return Response({
        "scan_id": scan.id,
        "url": scan.url,
        "status": scan.status,
        "results": scan.results,
        "error_message": scan.error_message,
        "created_at": scan.created_at,
        "updated_at": scan.updated_at,
    })