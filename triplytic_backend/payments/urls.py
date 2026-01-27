from django.urls import path
from payments.views import create_payment, confirm_payment

urlpatterns = [
    path("create/", create_payment),
    path("confirm/", confirm_payment),
]
