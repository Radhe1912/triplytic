from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import requests

@csrf_exempt
def recommend_booking(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST only"}, status=405)

    data = json.loads(request.body)

    # FOR NOW: stub response
    # Later you will forward to MCP server via HTTP
    return JsonResponse({
        "status": "ok",
        "received_preferences": data,
        "note": "Forwarding to MCP server will be added next"
    })