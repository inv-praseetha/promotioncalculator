from django.db import models

# Create your models here.
class Account(models.Model):

    class CustomerType(models.TextChoices):
        VIP = "VIP", "VIP"
        REGULAR = "REGULAR", "Regular"
        PREMIUM = "PREMIUM", "Premium"

    customer_id = models.CharField(
        max_length=25,
        unique=True
    )

    name = models.CharField(
        max_length=50
    )

    customer_type = models.CharField(
        max_length=10,
        choices=CustomerType.choices,
        default=CustomerType.REGULAR
    )

    is_active = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return f"{self.customer_id} - {self.name}"
    