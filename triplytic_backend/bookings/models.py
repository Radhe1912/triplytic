import uuid
from django.db import models
from users.models import User

class Booking(models.Model):
    BOOKING_TYPE_CHOICES = [
        ("HOTEL", "Hotel"),
        ("FLIGHT", "Flight"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    booking_type = models.CharField(max_length=10, choices=BOOKING_TYPE_CHOICES)
    details = models.JSONField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, default="PENDING")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "bookings"