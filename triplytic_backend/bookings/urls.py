from django.urls import path
from bookings.views import create_booking, confirm_booking

urlpatterns = [
    path("create/", create_booking),
    path("confirm/", confirm_booking),
]