from rest_framework.generics import ListAPIView
from .models import Product, Category
from rest_framework.exceptions import NotFound
from .serializers import ProductSerializer, CategorySerializer
from .accounts.models import Accounts

class ProductListAPIView(ListAPIView):
    
    serializer_class = ProductSerializer
    def get_query_set(self):
        customer_id=self.request.query_params.get("customer_id")
        if not customer_id:
            raise NotFound("customer_id is needed for product listing")
        customer=Accounts.objects.filter(customer_id=customer_id).first()
        if not customer:
            raise NotFound("customer not exist")
        return Product.objects.filter(is_active=True,count__gt=0).select_related("category")

class CategoryListAPIView(ListAPIView):
    queryset = Category.objects.filter(is_active=True).prefetch_related("product")
    serializer_class = CategorySerializer
