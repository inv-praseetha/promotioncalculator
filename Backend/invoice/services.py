from django.utils import timezone
from .models import Promotion, Coupon
from accounts.models import Account
from product.models import Product

class InvoiceCalculationService:
    @staticmethod
    def calculate(customer_id, items_data):
        customer = Account.objects.filter(customer_id=customer_id).first()
        if not customer:
            raise ValueError("Customer not found")

        cart_items = []
        
        subtotal = 0
        for item in items_data:
            product = Product.objects.filter(id=item.get('product_id')).first()
            if product:
                
                qty = int(item.get('quantity', 1))
                original_quanity =product.count
                if qty>original_quanity:
                    raise ValueError(f"insufficent stock {product.name}can you please delete this product only available")
                item_subtotal = float(product.price) * qty
                cart_items.append({
                    'product': product,
                    'quantity': qty,
                    'unit_price': float(product.price),
                    'subtotal': item_subtotal,
                    'promotion_discount': 0,
                    "coupon_discount":0,
                    'get_quantity': 0
                })
                subtotal += item_subtotal

        now = timezone.now()
        promotions = Promotion.objects.filter(
            is_active=True,
            start_date__lte=now,
            end_date__gte=now
        ).order_by('priority')

        total_promotion_discount = 0
        applied_promotions_list = []

        for promo in promotions:
            if promo.customer_type and promo.customer_type != customer.customer_type:
                continue
            if promo.minimum_order_amount and float(subtotal) < float(promo.minimum_order_amount):
                continue
            
            promo_discount_this_round = 0
            promo_applied = False
            
            for item in cart_items:
                if promo.product and item['product'].id != promo.product.id:
                    continue
                if promo.category and item['product'].category.id != promo.category.id:
                    continue
                if promo.minimum_quantity and item['quantity'] < promo.minimum_quantity:
                    continue

                discount = 0
                if promo.discount_type == 'PERCENTAGE':
                    discount = (item['subtotal'] * float(promo.discount_value)) / 100
                elif promo.discount_type == 'FIXED':
                    discount = float(promo.discount_value)
                elif promo.discount_type == 'BUY_X_GET_Y':
                    if promo.buy_quantity and promo.get_quantity:
                        sets = item['quantity'] // promo.buy_quantity
                        free_items = sets * promo.get_quantity
                        total_quantity = item['quantity'] + free_items
                        if total_quantity > item['product'].count:
                            raise ValueError(f"insufficient stock{item['product'].name}")
                        discount = 0
                        item['get_quantity'] += free_items
                        if free_items > 0:
                            promo_applied = True
                
                if promo.maximum_discount and discount > float(promo.maximum_discount):
                    discount = float(promo.maximum_discount)

                # Cannot discount more than the remaining price of the item
                discount = min(discount, item['subtotal'] - item['promotion_discount'])
                
                if discount > 0:
                    promo_applied = True
                
                item['promotion_discount'] += float(discount)
                promo_discount_this_round += float(discount)

            total_promotion_discount += promo_discount_this_round
            
            if promo_applied:
                applied_promotions_list.append({
                    "id": promo.id,
                    "name": promo.name,
                    "discount_amount": promo_discount_this_round,
                    "priority": promo.priority
                })


            if not promo.is_stackable and promo_discount_this_round > 0:
                break

        coupons = Coupon.objects.filter(is_active=True, start_date__lte=now, end_date__gte=now).order_by('priority')

        total_coupon_discount = 0
        applied_coupon = None

        for coupon in coupons:
                if coupon.customer_type and coupon.customer_type != customer.customer_type:
                    continue
                if coupon.minimum_order_amount and subtotal < float(coupon.minimum_order_amount):
                    continue
                if coupon.usage_limit and coupon.used_count >= coupon.usage_limit:
                    continue

                eligible_items = [
                    item for item in cart_items
                    if (not coupon.product and not coupon.category and not coupon.minimum_quantity)
                    or (coupon.product and item['product'].id == coupon.product_id)
                    or (coupon.category and item['product'].category_id == coupon.category_id)
                    or (coupon.minimum_quantity and item['quantity'] >= coupon.minimum_quantity)
                ]
                if not eligible_items:
                    continue

                eligible_subtotal = sum(item['subtotal'] for item in eligible_items)
                if coupon.discount_type == 'PERCENTAGE':
                    total_coupon_discount = eligible_subtotal * float(coupon.discount_value) / 100
                elif coupon.discount_type == 'FIXED':
                    total_coupon_discount = float(coupon.discount_value)

                if coupon.maximum_discount:
                    total_coupon_discount = min(
                        total_coupon_discount,
                        float(coupon.maximum_discount)
                    )
                total_coupon_discount = min(total_coupon_discount, subtotal - total_promotion_discount)
                
                if eligible_subtotal > 0 and total_coupon_discount > 0:
                    for item in eligible_items:
                        proportion = item['subtotal'] / eligible_subtotal
                        item['coupon_discount'] = float(total_coupon_discount) * proportion
                        
                    applied_coupon = coupon
                    break

        applied_promo_ids = {p['id'] for p in applied_promotions_list}
        not_applied_promotion_list = [
            {
                "id": promo.id,
                "name": promo.name,
                "priority": promo.priority
            }
            for promo in promotions if promo.id not in applied_promo_ids
        ]

        total_discount = total_promotion_discount + total_coupon_discount
        final_amount = float(subtotal) - total_discount

        return {
            "subtotal": round(float(subtotal), 2),
            "promotion_discount": round(total_promotion_discount, 2),
            "coupon_discount": round(total_coupon_discount, 2),
            "coupon": applied_coupon.code if applied_coupon else None,
            "total_discount": round(total_discount, 2),
            "final_amount": round(max(0, final_amount), 2),
            "applied_promotions": applied_promotions_list,
            "not_applied_promotions": not_applied_promotion_list,
            "items": [
                {
                    "product_id": item['product'].id,
                    "product_name": item['product'].name,
                    "quantity": item['quantity'],
                  
                    "coupon_discount": round(item.get('coupon_discount', 0), 2),
                  
                    "get_quantity": item['get_quantity'],
                    "unit_price": round(item['unit_price'], 2),
                    "subtotal": round(item['subtotal'], 2),
                    "promotion_discount": round(item['promotion_discount'], 2)
                } for item in cart_items
            ]
        }

    @staticmethod
    def create_invoice(customer_id, items_data):
        from django.db import transaction
        from .models import Invoice, InvoiceItem, InvoiceAppliedPromotion
        import uuid
        
        customer = Account.objects.filter(customer_id=customer_id).first()
        if not customer:
            raise ValueError("Customer not found")

        result = InvoiceCalculationService.calculate(customer_id, items_data)
        
        with transaction.atomic():
            invoice_number = f"INV-{uuid.uuid4().hex[:8].lower()}"
            
            coupon_obj = None
            if result.get("coupon"):
                coupon_obj = Coupon.objects.select_for_update().filter(code=result["coupon"]).first()
            
            invoice = Invoice.objects.create(
                invoice_number=invoice_number,
                customer=customer,
                customer_type=customer.customer_type,
                subtotal=result["subtotal"],
                promotion_discount=result["promotion_discount"],
                coupon_discount=result["coupon_discount"],
                total_discount=result["total_discount"],
                final_amount=result["final_amount"],
                coupon=coupon_obj
            )
            
            for item in result["items"]:
                product = Product.objects.select_for_update().filter(id=item["product_id"]).first()
                if not product:
                    raise ValueError(f"Product {item['product_name']} not found")
                
                total_qty_to_deduct = item["quantity"] + item["get_quantity"]
                if product.count < total_qty_to_deduct:
                    raise ValueError(f"Insufficient stock for {product.name}")
                
                product.count -= total_qty_to_deduct
                product.save()
                
                InvoiceItem.objects.create(
                    invoice=invoice,
                    product=product,
                    product_name=item["product_name"],
                    category_name=product.category.name if product.category else "Uncategorized",
                    quantity=item["quantity"],
                    unit_price=item["unit_price"],
                    subtotal=item["subtotal"],
                    promotion_discount=item["promotion_discount"],
                    coupon_discount=item["coupon_discount"],
                    final_amount=round(item["subtotal"] - item["promotion_discount"] - item["coupon_discount"], 2),
                    get_quantity=item["get_quantity"]
                )
                
            for promo_data in result.get("applied_promotions", []):
                promo = Promotion.objects.filter(id=promo_data["id"]).first()
                if promo:
                    InvoiceAppliedPromotion.objects.create(
                        invoice=invoice,
                        promotion=promo,
                        promotion_name=promo_data["name"],
                        discount_amount=promo_data["discount_amount"],
                        priority=promo_data["priority"]
                    )
            
            if coupon_obj:
                coupon_obj.used_count += 1
                coupon_obj.save()
                
        return {
            "message": "Invoice created successfully",
            "invoice_number": invoice_number,
            "final_amount": invoice.final_amount
        }
