from rest_framework.generics import ListAPIView
from .models import Product, Category
from .serializers import ProductSerializer, CategorySerializer

class ProductListAPIView(ListAPIView):
    queryset = Product.objects.filter(is_active=True,count__gt=0).select_related("category")
    serializer_class = ProductSerializer

class CategoryListAPIView(ListAPIView):
    queryset = Category.objects.filter(is_active=True).prefetch_related("product")
    serializer_class = CategorySerializer
