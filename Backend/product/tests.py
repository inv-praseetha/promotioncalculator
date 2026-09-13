from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from .models import Category, Product
from accounts.models import Account

class ProductViewsTestCase(APITestCase):
    def setUp(self):
        self.category = Category.objects.create(name="Electronics", is_active=True)
        self.product = Product.objects.create(
            name="Laptop",
            sku="SKU-LAP",
            category=self.category,
            price=1000.00,
            is_active=True,
            count=10
        )
        self.account = Account.objects.create(
            customer_id="CUS-001",
            name="Test User",
            customer_type=Account.CustomerType.REGULAR
        )
        self.product_url = reverse('product-list')
        self.category_url = reverse('category-list')

    def test_get_categories(self):
        """Test retrieving all active categories"""
        response = self.client.get(self.category_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Results might be paginated
        if 'results' in response.data:
            self.assertGreaterEqual(len(response.data['results']), 1)
        else:
            self.assertGreaterEqual(len(response.data), 1)

    def test_get_products_without_customer_id(self):
        """Test retrieving products without providing customer_id returns 404"""
        response = self.client.get(self.product_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn("customer_id is needed", str(response.data.get('detail', '')))

    def test_get_products_with_invalid_customer_id(self):
        """Test retrieving products with invalid customer_id returns 404"""
        response = self.client.get(self.product_url, {'customer_id': 'INVALID'})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn("customer not exist", str(response.data.get('detail', '')))

    def test_get_products_with_valid_customer_id(self):
        """Test retrieving products with valid customer_id"""
        response = self.client.get(self.product_url, {'customer_id': self.account.customer_id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Verify product is in response
        results = response.data.get('results', response.data)
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['name'], "Laptop")
