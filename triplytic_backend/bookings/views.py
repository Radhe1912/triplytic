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
        return JsonResponse({"error": "POST method required"}, status=405)

    # ---------- PARSE JSON ----------
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    user_id = data.get("user_id")
    booking_type = data.get("booking_type")
    preferences = data.get("preferences")

    if not user_id or not booking_type or not preferences:
        return JsonResponse(
            {"error": "user_id, booking_type and preferences are required"},
            status=400
        )

    if booking_type not in ["HOTEL", "FLIGHT"]:
        return JsonResponse({"error": "Invalid booking type"}, status=400)

    # ---------- VALIDATE USER ----------
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)

    # ---------- VALIDATE PREFERENCES ----------
    if booking_type == "HOTEL":
        required_fields = [
            "location", "check_in", "check_out",
            "rooms", "guests", "budget", "priority"
        ]
    else:  # FLIGHT
        required_fields = [
            "from_city", "to_city", "travel_date",
            "passengers", "budget", "priority"
        ]

    missing = []
    for f in required_fields:
        if f not in preferences or preferences[f] in ["", None]:
            missing.append(f)

    if missing:
        return JsonResponse(
            {"error": "Missing fields", "fields": missing},
            status=400
        )

    # ---------- CALL MCP SERVER ----------
    mcp_payload = {
        "booking_type": booking_type,
        **preferences
    }

    try:
        mcp_response = requests.post(
            MCP_URL,
            json=mcp_payload,
            timeout=5
        )
    except requests.exceptions.RequestException:
        return JsonResponse(
            {"error": "MCP server not reachable"},
            status=500
        )

    if mcp_response.status_code != 200:
        return JsonResponse(
            {
                "error": "MCP failed",
                "details": mcp_response.text
            },
            status=500
        )

    recommendation = mcp_response.json()

    # ---------- SAVE BOOKING ----------
    booking = Booking.objects.create(
        user=user,
        booking_type=booking_type,
        details={
            **preferences,
            "recommendation": recommendation
        },
        amount=recommendation.get("price", preferences["budget"]),
        status="PENDING"
    )

    # ---------- RESPONSE ----------
    return JsonResponse({
        "booking_id": str(booking.id),
        "recommendation": recommendation,
        "status": booking.status
    })
    
@csrf_exempt
def confirm_booking(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST only"}, status=405)

    data = json.loads(request.body)
    booking_id = data.get("booking_id")

    if not booking_id:
        return JsonResponse({"error": "booking_id required"}, status=400)

    try:
        booking = Booking.objects.get(id=booking_id)
    except Booking.DoesNotExist:
        return JsonResponse({"error": "Booking not found"}, status=404)

    booking.status = "CONFIRMED"
    booking.save()

    return JsonResponse({
        "message": "Booking confirmed",
        "booking_id": str(booking.id),
        "status": booking.status
    })