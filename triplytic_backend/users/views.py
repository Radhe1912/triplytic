import json
import hashlib
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from users.models import User

@csrf_exempt
def register(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=405)

    data = json.loads(request.body)

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return JsonResponse({"error": "Email and password required"}, status=400)

    if User.objects.filter(email=email).exists():
        return JsonResponse({"error": "User already exists"}, status=400)

    password_hash = hashlib.sha256(password.encode()).hexdigest()

    user = User.objects.create(
        email=email,
        password_hash=password_hash
    )

    return JsonResponse({
        "message": "User registered successfully",
        "user_id": str(user.id)
    })
    
@csrf_exempt
def login(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=405)

    data = json.loads(request.body)

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return JsonResponse({"error": "Email and password required"}, status=400)

    password_hash = hashlib.sha256(password.encode()).hexdigest()

    try:
        user = User.objects.get(email=email, password_hash=password_hash)
    except User.DoesNotExist:
        return JsonResponse({"error": "Invalid credentials"}, status=401)

    return JsonResponse({
        "message": "Login successful",
        "user_id": str(user.id)
    })