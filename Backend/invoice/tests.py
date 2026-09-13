from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from django.utils import timezone
from datetime import timedelta
from .models import Promotion, Coupon, Invoice, InvoiceItem
from product.models import Category, Product
from accounts.models import Account
from unittest.mock import patch

class InvoiceTestCase(APITestCase):
    def setUp(self):
        self.calculate_url = reverse('calculate')
        self.create_invoice_url = reverse('create-invoice')
        
        self.account = Account.objects.create(
            customer_id="CUS-001",
            name="Test User",
            customer_type=Account.CustomerType.REGULAR
        )
        self.vip_account = Account.objects.create(
            customer_id="CUS-002",
            name="VIP User",
            customer_type=Account.CustomerType.VIP
        )
        
        self.category = Category.objects.create(name="Electronics", is_active=True)
        self.product1 = Product.objects.create(
            name="Laptop",
            sku="SKU-LAP",
            category=self.category,
            price=1000.00,
            is_active=True,
            count=10
        )
        self.product2 = Product.objects.create(
            name="Mouse",
            sku="SKU-MOU",
            category=self.category,
            price=50.00,
            is_active=True,
            count=100
        )
        self.product3 = Product.objects.create(
            name="Keyboard",
            sku="SKU-KEY",
            category=self.category,
            price=100.00,
            is_active=True,
            count=50
        )
        
        self.now = timezone.now()
        # 10% discount on Electronics
        self.promotion = Promotion.objects.create(
            name="10% Off Electronics",
            discount_type="PERCENTAGE",
            discount_value=10.00,
            category=self.category,
            priority=2,
            is_active=True,
            start_date=self.now - timedelta(days=1),
            end_date=self.now + timedelta(days=1),
            is_stackable=True
        )

        # Fixed discount
        self.promo_fixed = Promotion.objects.create(
            name="$5 Off Mouse",
            discount_type="FIXED",
            discount_value=5.00,
            product=self.product2,
            priority=1,
            is_active=True,
            start_date=self.now - timedelta(days=1),
            end_date=self.now + timedelta(days=1),
            is_stackable=True
        )

        # Buy 2 Get 1 Free
        self.promo_bogo = Promotion.objects.create(
            name="B2G1 Keyboard",
            discount_type="BUY_X_GET_Y",
            buy_quantity=2,
            get_quantity=1,
            product=self.product3,
            priority=3,
            is_active=True,
            start_date=self.now - timedelta(days=1),
            end_date=self.now + timedelta(days=1)
        )
        
        # $20 off coupon
        self.coupon = Coupon.objects.create(
            code="SAVE20",
            name="Save 20",
            discount_type="FIXED",
            discount_value=20.00,
            priority=1,
            is_active=True,
            start_date=self.now - timedelta(days=1),
            end_date=self.now + timedelta(days=1),
            usage_limit=10,
            used_count=0,
            minimum_order_amount=50.00,
            customer_type=Account.CustomerType.REGULAR
        )

        # Percentage coupon
        self.coupon_perc = Coupon.objects.create(
            code="SAVE10PERC",
            name="Save 10 Percent",
            discount_type="PERCENTAGE",
            discount_value=10.00,
            priority=2,
            is_active=True,
            start_date=self.now - timedelta(days=1),
            end_date=self.now + timedelta(days=1),
            usage_limit=10,
            used_count=0,
            customer_type=Account.CustomerType.REGULAR
        )

    def test_calculate_amount_no_promos_applied(self):
        # We'll make promotions inactive
        Promotion.objects.update(is_active=False)
        Coupon.objects.update(is_active=False)
        
        payload = {
            "customer_id": self.account.customer_id,
            "items": [
                {"product_id": self.product1.id, "quantity": 1}
            ]
        }
        response = self.client.post(self.calculate_url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['subtotal'], 1000.00)
        self.assertEqual(response.data['promotion_discount'], 0.00)
        self.assertEqual(response.data['coupon_discount'], 0.00)
        self.assertEqual(response.data['final_amount'], 1000.00)
        
    def test_calculate_amount_with_promotion(self):
        self.coupon.is_active = False
        self.coupon.save()
        self.coupon_perc.is_active = False
        self.coupon_perc.save()
        payload = {
            "customer_id": self.account.customer_id,
            "items": [
                {"product_id": self.product1.id, "quantity": 1}
            ]
        }
        response = self.client.post(self.calculate_url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['subtotal'], 1000.00)
        self.assertEqual(response.data['promotion_discount'], 100.00)
        self.assertEqual(response.data['final_amount'], 900.00)

    def test_calculate_amount_buy_x_get_y(self):
        payload = {
            "customer_id": self.account.customer_id,
            "items": [
                {"product_id": self.product3.id, "quantity": 2}
            ]
        }
        response = self.client.post(self.calculate_url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['items'][0]['get_quantity'], 1)
        self.assertEqual(response.data['subtotal'], 200.00)

    def test_calculate_amount_buy_x_get_y_insufficient_stock(self):
        # Only 50 in stock, we try to buy 50, gets 25 free = 75 total (fails)
        payload = {
            "customer_id": self.account.customer_id,
            "items": [
                {"product_id": self.product3.id, "quantity": 50}
            ]
        }
        response = self.client.post(self.calculate_url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)

    def test_calculate_amount_with_coupon_fixed(self):
        # In this endpoint, currently Coupon is not passed through items in the payload, 
        # but the service checks all active coupons and applies the first eligible one.
        payload = {
            "customer_id": self.account.customer_id,
            "items": [
                {"product_id": self.product1.id, "quantity": 1}
            ]
        }
        response = self.client.post(self.calculate_url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Expected:
        # Subtotal: 1000
        # Promo: 10% off -> 100
        # Coupon (SAVE20 is priority 1) -> 20 off
        self.assertEqual(response.data['coupon_discount'], 20.00)
        self.assertEqual(response.data['total_discount'], 120.00)
        self.assertEqual(response.data['final_amount'], 880.00)

    def test_calculate_amount_with_coupon_percentage(self):
        self.coupon.is_active = False
        self.coupon.save()
        payload = {
            "customer_id": self.account.customer_id,
            "items": [
                {"product_id": self.product1.id, "quantity": 1}
            ]
        }
        response = self.client.post(self.calculate_url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Expected: Promo 100 off, Coupon is 10% of 1000 = 100 off
        self.assertEqual(response.data['coupon_discount'], 100.00)
        self.assertEqual(response.data['total_discount'], 200.00)

    def test_create_invoice_success(self):
        self.coupon.is_active = False
        self.coupon.save()
        self.coupon_perc.is_active = False
        self.coupon_perc.save()

        payload = {
            "customer_id": self.account.customer_id,
            "items": [
                {"product_id": self.product2.id, "quantity": 2} # 50 * 2 = 100
            ]
        }
        response = self.client.post(self.create_invoice_url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('invoice_number', response.data)
        
        # Check stock deduction
        self.product2.refresh_from_db()
        self.assertEqual(self.product2.count, 98)
        
        # Check Invoice creation
        invoice = Invoice.objects.get(invoice_number=response.data['invoice_number'])
        self.assertEqual(invoice.subtotal, 100.00)
        # Mouse has $5 fixed off AND 10% off. Priorities: Fixed (1), Perc (2)
        # Discount: 5 + (100 * 10%) = 5 + 10 = 15? Wait, promo logic loops items.
        # Actually $5 fixed off for product2 means $5 off. Then 10% off of 100 = 10 off. Total 15 off.
        # But wait, is it per quantity? The service says item['subtotal'] * discount_value / 100.
        self.assertEqual(invoice.promotion_discount, 15.00)
        self.assertEqual(invoice.final_amount, 85.00)

    def test_create_invoice_insufficient_stock(self):
        payload = {
            "customer_id": self.account.customer_id,
            "items": [
                {"product_id": self.product1.id, "quantity": 20} # only 10 in stock
            ]
        }
        response = self.client.post(self.create_invoice_url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)

    def test_calculate_invalid_customer(self):
        payload = {
            "customer_id": "INVALID",
            "items": [
                {"product_id": self.product1.id, "quantity": 1}
            ]
        }
        response = self.client.post(self.calculate_url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Customer not found", str(response.data.get('error', '')))

    def test_calculate_missing_fields(self):
        response = self.client.post(self.calculate_url, data={"customer_id": "CUS-001"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        response = self.client.post(self.calculate_url, data={"items": [{"product_id": 1}]}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_missing_fields(self):
        response = self.client.post(self.create_invoice_url, data={"customer_id": "CUS-001"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        response = self.client.post(self.create_invoice_url, data={"items": [{"product_id": 1}]}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch('invoice.services.InvoiceCalculationService.calculate')
    def test_internal_server_error_calculate(self, mock_calc):
        mock_calc.side_effect = Exception("DB error")
        payload = {
            "customer_id": self.account.customer_id,
            "items": [{"product_id": self.product1.id, "quantity": 1}]
        }
        response = self.client.post(self.calculate_url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)

    @patch('invoice.services.InvoiceCalculationService.create_invoice')
    def test_internal_server_error_create(self, mock_create):
        mock_create.side_effect = Exception("DB error")
        payload = {
            "customer_id": self.account.customer_id,
            "items": [{"product_id": self.product1.id, "quantity": 1}]
        }
        response = self.client.post(self.create_invoice_url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
