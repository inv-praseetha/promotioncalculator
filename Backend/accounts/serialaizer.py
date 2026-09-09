from rest_framework import serializers
from .models import Account


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = [
            "customer_id",
            "name",
            "customer_type",
            "is_active",
        ]