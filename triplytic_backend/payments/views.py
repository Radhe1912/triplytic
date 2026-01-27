import json
from decimal import Decimal
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from bookings.models import Booking
from payments.models import Payment
from payments.services.stripe_service import create_payment_intent


@csrf_exempt
def create_payment(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST method required"}, status=405)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    booking_id = data.get("booking_id")
    if not booking_id:
        return JsonResponse({"error": "booking_id required"}, status=400)

    try:
        booking = Booking.objects.get(id=booking_id)
    except Booking.DoesNotExist:
        return JsonResponse({"error": "Booking not found"}, status=404)

    if booking.amount <= 0:
        return JsonResponse({"error": "Invalid booking amount"}, status=400)

    # ✅ CONVERT DECIMAL → INTEGER PAISE
    amount_in_paise = int(booking.amount * Decimal("100"))

    intent = create_payment_intent(amount_in_paise)

    payment = Payment.objects.create(
        user=booking.user,
        booking=booking,
        stripe_payment_intent_id=intent.id,
        amount=booking.amount,  # stored in ₹
        status="INITIATED"
    )

    return JsonResponse({
        "client_secret": intent.client_secret,
        "payment_id": str(payment.id)
    })


@csrf_exempt
def confirm_payment(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST method required"}, status=405)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    payment_id = data.get("payment_id")
    if not payment_id:
        return JsonResponse({"error": "payment_id required"}, status=400)

    try:
        payment = Payment.objects.get(id=payment_id)
    except Payment.DoesNotExist:
        return JsonResponse({"error": "Payment not found"}, status=404)

    payment.status = "SUCCESS"
    payment.save()

    booking = payment.booking
    booking.status = "CONFIRMED"
    booking.save()

    return JsonResponse({
        "message": "Payment successful",
        "booking_status": booking.status
    })