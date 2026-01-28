import json
import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from bookings.models import Booking
from users.models import User

MCP_URL = "http://127.0.0.1:9000/recommend"


@csrf_exempt
def create_booking(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=405)

    data = json.loads(request.body)

    user_id = data.get("user_id")
    booking_type = data.get("booking_type")
    preferences = data.get("preferences")

    if not user_id or not booking_type or not preferences:
        return JsonResponse({"error": "Invalid payload"}, status=400)

    user = User.objects.get(id=user_id)

    mcp_resp = requests.post(
        MCP_URL,
        json={"booking_type": booking_type, **preferences},
        timeout=5
    )
    mcp_data = mcp_resp.json()

    if not mcp_data.get("success"):
        return JsonResponse({"error": "No recommendations found for this budget"}, status=500)

    booking = Booking.objects.create(
        user=user,
        booking_type=booking_type,
        details=mcp_data,
        amount=mcp_data["recommendation"].get(
            "total_price",
            mcp_data["recommendation"].get("price", preferences["budget"])
        ),
        status="PENDING"
    )

    return JsonResponse({
        "booking_id": str(booking.id),
        "recommendation": mcp_data["recommendation"],
        "alternatives": mcp_data["alternatives"],
        "status": booking.status
    })


@csrf_exempt
def confirm_booking(request):
    data = json.loads(request.body)
    booking = Booking.objects.get(id=data["booking_id"])
    booking.status = "CONFIRMED"
    booking.save()

    return JsonResponse({
        "message": "Booking confirmed",
        "booking_id": str(booking.id),
        "status": booking.status
    })
