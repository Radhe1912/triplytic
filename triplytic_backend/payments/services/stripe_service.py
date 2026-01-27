import stripe
from django.conf import settings

stripe.api_key = settings.STRIPE_SECRET_KEY


def create_payment_intent(amount_in_paise):
    return stripe.PaymentIntent.create(
        amount=amount_in_paise,
        currency="inr"
    )
