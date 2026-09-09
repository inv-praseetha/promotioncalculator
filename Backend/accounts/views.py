from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.exceptions import NotFound
from rest_framework.response import Response

from django.shortcuts import get_object_or_404

from .models import Account
from .serializers import AccountSerializer
class AccountsView(ListAPIView):
    """
    Optimized GET endpoint with pagination, and fast querying.
    """
    serializer_class = AccountSerializer
    queryset = Account.objects.all()

    def get(self, request, *args, **kwargs):
        customer_id = request.query_params.get("customer_id")

        if customer_id:
            # Optimal lookup with single database query, auto-handles 404
            customer = get_object_or_404(Account, customer_id=customer_id)
            return Response(AccountSerializer(customer).data)

        # Uses ListAPIView's built-in pagination, ordering, and optimization
        return super().get(request, *args, **kwargs)


