from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from .models import Account

class AccountsViewTestCase(APITestCase):
    def setUp(self):
        self.url = reverse('accounts')
        self.account1 = Account.objects.create(
            customer_id='CUS-001',
            name='John Doe',
            customer_type=Account.CustomerType.REGULAR
        )
        self.account2 = Account.objects.create(
            customer_id='CUS-002',
            name='Jane Smith',
            customer_type=Account.CustomerType.VIP
        )

    def test_get_all_accounts(self):
        """Test retrieving all accounts (with pagination if applicable)"""
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # If pagination is active, results are in 'results' key
        if 'results' in response.data:
            self.assertEqual(len(response.data['results']), 2)
        else:
            self.assertEqual(len(response.data), 2)

    def test_get_account_by_customer_id(self):
        """Test retrieving a specific account using customer_id"""
        response = self.client.get(self.url, {'customer_id': 'CUS-001'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['customer_id'], 'CUS-001')
        self.assertEqual(response.data['name'], 'John Doe')
        self.assertEqual(response.data['customer_type'], 'REGULAR')

    def test_get_account_by_invalid_customer_id(self):
        """Test retrieving an account with an invalid customer_id returns 404"""
        response = self.client.get(self.url, {'customer_id': 'CUS-999'})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
