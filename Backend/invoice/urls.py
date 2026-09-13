from django.urls import path
from .views import CalculateAmountAPIView, CreateInvoiceAPIView

urlpatterns = [
    path('calculate/', CalculateAmountAPIView.as_view(), name='calculate'),
    path('create/', CreateInvoiceAPIView.as_view(), name='create-invoice'),
]
