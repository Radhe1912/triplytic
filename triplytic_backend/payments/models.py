import uuid
from django.db import models
from users.models import User
from bookings.models import Booking

class Payment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE)
    stripe_payment_intent_id = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, default="INITIATED")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "payments"
