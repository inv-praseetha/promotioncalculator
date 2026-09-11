from django.urls import path
from .views import CalculateAmountAPIView

urlpatterns = [
    path('calculate/', CalculateAmountAPIView.as_view(), name='calculate'),
]
