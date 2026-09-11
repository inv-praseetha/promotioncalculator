from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .services import InvoiceCalculationService

class CalculateAmountAPIView(APIView):
    def post(self, request, *args, **kwargs):
        customer_id = request.data.get('customer_id')
        items = request.data.get('items', [])
    
    
        
        if not customer_id:
            return Response({"error": "customer_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        if not items:
            return Response({"error": "items are required"}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            result = InvoiceCalculationService.calculate(
                customer_id=customer_id, 
                items_data=items,
              
              
            )
            return Response(result, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": "An internal error occurred during calculation."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)