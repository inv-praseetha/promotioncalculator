import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from product.models import Product

for p in Product.objects.all():
    prefix = p.category.name[:3].upper() if p.category else "GEN"
    sku = f"{prefix}-{p.id:04d}"
    p.sku = sku
    p.save()
    print(f"Updated product {p.name} with SKU {sku}")

print("Successfully updated SKUs for all products!")
