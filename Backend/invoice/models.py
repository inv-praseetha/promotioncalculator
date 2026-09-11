
from django.db import models
class Promotion(models.db.models.Model):
    DISCOUNT_TYPES = (
        ('PERCENTAGE', 'Percentage'),
        ('FIXED', 'Fixed'),
        ('BUY_X_GET_Y', 'Buy X Get Y'),
    )

    name = models.CharField(max_length=150)
    description = models.TextField(null=True, blank=True)
    discount_type = models.CharField(max_length=20, choices=DISCOUNT_TYPES)
    discount_value = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    buy_quantity = models.IntegerField(null=True, blank=True)
    get_quantity = models.IntegerField(null=True, blank=True)
    customer_type = models.CharField(max_length=20, choices=CUSTOMER_TYPES, null=True, blank=True)
    category = models.ForeignKey('product.Category', on_delete=models.SET_NULL, null=True, blank=True)
    product = models.ForeignKey('product.Product', on_delete=models.SET_NULL, null=True, blank=True)
    minimum_order_amount = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    minimum_quantity = models.IntegerField(null=True, blank=True)
    priority = models.IntegerField(default=1, unique=True)
    maximum_discount = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    is_stackable = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Coupon(models.db.models.Model):
    DISCOUNT_TYPES = (
        ('PERCENTAGE', 'Percentage'),
        ('FIXED', 'Fixed'),
    )
 

    code = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=150)
    description = models.TextField(null=True, blank=True)
    discount_type = models.CharField(max_length=20, choices=DISCOUNT_TYPES)
    discount_value = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    customer_type = models.CharField(max_length=20, choices=CUSTOMER_TYPES, null=True, blank=True)
    category = models.ForeignKey('product.Category', on_delete=models.SET_NULL, null=True, blank=True)
    product = models.ForeignKey('product.Product', on_delete=models.SET_NULL, null=True, blank=True)
    minimum_order_amount = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    minimum_quantity = models.IntegerField(null=True, blank=True)
    maximum_discount = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    usage_limit = models.IntegerField(null=True, blank=True)
    used_count = models.IntegerField(default=0)
    is_stackable = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    priority = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.code

class Invoice(models.db.models.Model):
    CUSTOMER_TYPES = (
        ('REGULAR', 'Regular'),
        ('PREMIUM', 'Premium'),
        ('VIP', 'VIP'),
    )

    invoice_number = models.CharField(max_length=50, unique=True)
    customer = models.ForeignKey('accounts.Account', on_delete=models.PROTECT) # Assuming accounts app and Account model exist
    customer_type = models.CharField(max_length=20, choices=CUSTOMER_TYPES)
    subtotal = models.DecimalField(max_digits=12, decimal_places=2)
    promotion_discount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    coupon_discount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    total_discount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    final_amount = models.DecimalField(max_digits=12, decimal_places=2)
    coupon = models.ForeignKey(Coupon, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.invoice_number

class InvoiceItem(models.db.models.Model):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey('product.Product', on_delete=models.PROTECT)
    product_name = models.CharField(max_length=150)
    category_name = models.CharField(max_length=100)
    quantity = models.IntegerField()
    unit_price = models.DecimalField(max_digits=12, decimal_places=2)
    subtotal = models.DecimalField(max_digits=12, decimal_places=2)
    promotion_discount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    coupon_discount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    final_amount = models.DecimalField(max_digits=12, decimal_places=2)
    get_quantity = models.IntegerField(null=True, blank=True, help_text="Used for BUY_X_GET_Y tracking")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.product_name} ({self.invoice.invoice_number})"
