from django.urls import path
from .views import recommend_booking

urlpatterns = [
    path("recommend/", recommend_booking),
]
