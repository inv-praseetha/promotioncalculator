from django.utils import timezone
from datetime import timedelta
from invoice.models import Promotion, Coupon
from product.models import Category, Product

now = timezone.now()

# Clear existing test promos (optional, to avoid unique constraint issues on rerun)
Promotion.objects.all().delete()
Coupon.objects.all().delete()

electronics = Category.objects.filter(name="Electronics").first()
laptop = Product.objects.filter(name="Wireless Mouse").first()
rice = Product.objects.filter(name="Basmati Rice 5kg").first()

# 1. 10% Off on all Electronics
if electronics:
    Promotion.objects.create(
        name="10% Off Electronics",
        discount_type="PERCENTAGE",
        discount_value=10.00,
        category=electronics,
        priority=2,
        is_stackable=True,
        is_active=True,
        start_date=now - timedelta(days=1),
        end_date=now + timedelta(days=30)
    )

# 2. Buy 2 Get 2 Free on the wireless mouse
Promotion.objects.create(
    name="Buy 2 Get 2 Free",
    discount_type="BUY_X_GET_Y",
    buy_quantity=2,
    get_quantity=2,
    product=laptop,
    priority=3,
    is_stackable=True,
    is_active=True,
    start_date=now - timedelta(days=1),
    end_date=now + timedelta(days=30)
)

# 3. Buy 1 Get 1 Free on Basmati Rice
if rice:
    Promotion.objects.create(
        name="Buy 1 Get 1 Free - Basmati Rice",
        discount_type="BUY_X_GET_Y",
        buy_quantity=1,
        get_quantity=1,
        product=rice,
        priority=1,
        is_stackable=True,
        is_active=True,
        start_date=now - timedelta(days=1),
        end_date=now + timedelta(days=30)
    )

# 4. Flat 500 discount on orders above 5000
Promotion.objects.create(
    name="Flat 500 Off (Min 5000)",
    discount_type="FIXED",
    discount_value=500.00,
    minimum_order_amount=5000.00,
    priority=4,
    is_stackable=False,
    is_active=True,
    start_date=now - timedelta(days=1),
    end_date=now + timedelta(days=30)
)

# 5. VIP Customer 15% Off
Promotion.objects.create(
    name="VIP 15% Discount",
    discount_type="PERCENTAGE",
    discount_value=15.00,
    customer_type="VIP",
    priority=5,
    is_stackable=True,
    is_active=True,
    start_date=now - timedelta(days=1),
    end_date=now + timedelta(days=30)
)

# 6. Add a product-based coupon for the wireless mouse
Coupon.objects.create(
    code="MOUSE10",
    name="10% Off Wireless Mouse",
    discount_type="PERCENTAGE",
    discount_value=10.00,
    product=laptop,
    priority=1,
    is_stackable=False,
    is_active=True,
    start_date=now - timedelta(days=1),
    end_date=now + timedelta(days=30)
)

# 7. Add a category-based coupon for groceries
Coupon.objects.create(
    code="GROCERY15",
    name="15% Off Groceries",
    discount_type="PERCENTAGE",
    discount_value=15.00,
    category=Category.objects.filter(name="Groceries").first(),
    priority=2,
    is_stackable=False,
    is_active=True,
    start_date=now - timedelta(days=1),
    end_date=now + timedelta(days=30)
)

# 8. Add a general fixed-value coupon
Coupon.objects.create(
    code="SAVE500",
    name="Save 500 Coupon",
    discount_type="FIXED",
    discount_value=500.00,
    is_stackable=True,
    is_active=True,
    priority=3,
    start_date=now - timedelta(days=1),
    end_date=now + timedelta(days=30)
)

print("Test Promotions and Coupons inserted successfully!")
