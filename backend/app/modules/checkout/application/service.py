from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modules.cart.application.service import clear_cart, get_cart
from app.modules.inventory.application.service import commit_inventory
from app.modules.notifications.application.service import create_notification
from app.modules.orders.domain.models import Order, OrderItem, OrderStatusHistory
from app.modules.payments.application.service import create_captured_payment
from app.modules.pricing.application.service import get_active_price
from app.modules.promotions.application.service import apply_coupon
from app.modules.settlements.application.service import create_settlement_for_order_items
from app.modules.shipping.application.service import create_shipment


def place_order_from_cart(
    db: Session,
    *,
    user_id: str,
    shipping_name: str,
    address_line1: str,
    city: str,
    state: str,
    postal_code: str,
    payment_method: str,
    payment_reference: str,
    idempotency_key: str,
    coupon_code: str | None = None,
) -> Order:
    existing = db.scalar(select(Order).where(Order.user_id == user_id, Order.idempotency_key == idempotency_key))
    if existing is not None:
        return existing

    cart = get_cart(db, user_id=user_id)
    if not cart.items:
        raise ValueError("Cart is empty.")

    subtotal = Decimal("0.00")
    order = Order(
        user_id=user_id,
        order_number=f"ORD-{idempotency_key[-8:].upper()}",
        status="confirmed",
        currency=cart.currency,
        subtotal=Decimal("0.00"),
        shipping_name=shipping_name,
        address_line1=address_line1,
        city=city,
        state=state,
        postal_code=postal_code,
        idempotency_key=idempotency_key,
    )
    db.add(order)
    db.flush()

    created_items: list[OrderItem] = []
    commission_rate = Decimal("0.1000")
    for cart_item in cart.items:
        variant = cart_item.variant
        price = get_active_price(db, variant_id=variant.id)
        unit_price = price.amount if price is not None else variant.price
        line_total = (unit_price * cart_item.quantity).quantize(Decimal("0.01"))
        commission_amount = (line_total * commission_rate).quantize(Decimal("0.01"))
        seller_payout_amount = (line_total - commission_amount).quantize(Decimal("0.01"))
        subtotal += line_total
        created_item = OrderItem(
            order_id=order.id,
            product_id=variant.product_id,
            variant_id=variant.id,
            seller_id=variant.product.seller_id,
            product_name=variant.product.name,
            variant_name=variant.name,
            sku=variant.sku,
            quantity=cart_item.quantity,
            unit_price=unit_price,
            line_total=line_total,
            commission_rate=commission_rate,
            commission_amount=commission_amount,
            seller_payout_amount=seller_payout_amount,
        )
        db.add(created_item)
        created_items.append(created_item)
        commit_inventory(db, variant_id=variant.id, quantity=cart_item.quantity)

    if coupon_code:
        _, discount = apply_coupon(db, code=coupon_code, subtotal=subtotal)
        subtotal -= discount

    order.subtotal = subtotal
    db.add(OrderStatusHistory(order_id=order.id, status="confirmed", note="Order placed"))
    create_captured_payment(
        db,
        order_id=order.id,
        provider="manual",
        method=payment_method,
        amount=subtotal,
        currency=cart.currency,
        reference=payment_reference,
    )
    create_shipment(db, order_id=order.id)
    create_settlement_for_order_items(db, order_items=created_items)
    create_notification(
        db,
        user_id=user_id,
        title=f"Order {order.order_number} placed",
        message=f"Your order totaling INR {subtotal} has been confirmed.",
    )
    clear_cart(db, user_id=user_id, release_inventory_items=False)
    return order
