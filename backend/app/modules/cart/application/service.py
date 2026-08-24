from datetime import datetime, timezone
from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.modules.cart.application.schemas import CartLineResponse, CartResponse
from app.modules.cart.domain.models import Cart, CartItem
from app.modules.catalog.domain.models import ProductVariant
from app.modules.inventory.application.service import get_inventory_item, release_inventory, reserve_inventory
from app.modules.pricing.application.service import get_active_price


ACTIVE_CART_STATUS = "active"
PURCHASED_CART_STATUS = "purchased"


def get_or_create_cart(db: Session, *, user_id: str) -> Cart:
    cart = db.scalar(
        select(Cart)
        .options(selectinload(Cart.items).selectinload(CartItem.variant).selectinload(ProductVariant.product))
        .where(Cart.user_id == user_id)
    )
    if cart is not None:
        return cart

    cart = Cart(user_id=user_id, currency="INR")
    db.add(cart)
    db.flush()
    return cart


def get_cart(db: Session, *, user_id: str) -> Cart:
    return get_or_create_cart(db, user_id=user_id)


def add_item_to_cart(db: Session, *, user_id: str, variant_id: str, quantity: int) -> Cart:
    cart = get_or_create_cart(db, user_id=user_id)
    item = db.scalar(
        select(CartItem).where(
            CartItem.cart_id == cart.id,
            CartItem.variant_id == variant_id,
            CartItem.status == ACTIVE_CART_STATUS,
        )
    )
    previous_quantity = item.quantity if item is not None else 0
    desired_quantity = previous_quantity + quantity
    delta = desired_quantity - previous_quantity

    if item is None:
        item = CartItem(cart_id=cart.id, variant_id=variant_id, quantity=0)
        db.add(item)

    if delta > 0:
        reserve_inventory(db, variant_id=variant_id, quantity=delta)

    item.quantity = desired_quantity
    db.commit()
    return get_cart(db, user_id=user_id)


def update_cart_item(db: Session, *, user_id: str, variant_id: str, quantity: int) -> Cart:
    cart = get_or_create_cart(db, user_id=user_id)
    item = db.scalar(
        select(CartItem).where(
            CartItem.cart_id == cart.id,
            CartItem.variant_id == variant_id,
            CartItem.status == ACTIVE_CART_STATUS,
        )
    )
    if item is None:
        raise ValueError("Cart item not found.")

    if quantity == 0:
        release_inventory(db, variant_id=variant_id, quantity=item.quantity)
        db.delete(item)
        db.commit()
        return get_cart(db, user_id=user_id)

    if quantity > item.quantity:
        reserve_inventory(db, variant_id=variant_id, quantity=quantity - item.quantity)
    elif quantity < item.quantity:
        release_inventory(db, variant_id=variant_id, quantity=item.quantity - quantity)

    item.quantity = quantity
    db.commit()
    return get_cart(db, user_id=user_id)


def clear_cart(db: Session, *, user_id: str, release_inventory_items: bool = True) -> None:
    cart = get_or_create_cart(db, user_id=user_id)
    for item in [cart_item for cart_item in list(cart.items) if cart_item.status == ACTIVE_CART_STATUS]:
        if release_inventory_items:
            release_inventory(db, variant_id=item.variant_id, quantity=item.quantity)
        db.delete(item)
    db.flush()
    db.expire_all()
    db.commit()


def mark_active_cart_items_purchased(
    db: Session,
    *,
    user_id: str,
    checkout_session_id: str,
    order_id: str | None = None,
) -> int:
    cart = get_or_create_cart(db, user_id=user_id)
    changed = 0
    for item in [cart_item for cart_item in list(cart.items) if cart_item.status == ACTIVE_CART_STATUS]:
        item.status = PURCHASED_CART_STATUS
        item.checkout_session_id = checkout_session_id
        item.order_id = order_id
        item.purchased_at = datetime.now(timezone.utc)
        changed += 1
    db.commit()
    return changed


def build_cart_response(db: Session, *, cart: Cart) -> CartResponse:
    db.refresh(cart)
    cart = get_cart(db, user_id=cart.user_id)
    lines: list[CartLineResponse] = []
    subtotal = Decimal("0.00")

    active_items = [cart_item for cart_item in cart.items if cart_item.status == ACTIVE_CART_STATUS]

    for item in active_items:
        variant = item.variant
        price = get_active_price(db, variant_id=variant.id)
        inventory = get_inventory_item(db, variant_id=variant.id)
        unit_price = price.amount if price is not None else variant.price
        currency = price.currency if price is not None else variant.currency
        available_quantity = inventory.available if inventory is not None else variant.quantity_available
        line_total = unit_price * item.quantity
        subtotal += line_total
        lines.append(
            CartLineResponse(
                id=item.id,
                variant_id=variant.id,
                product_name=variant.product.name,
                variant_name=variant.name,
                sku=variant.sku,
                quantity=item.quantity,
                unit_price=unit_price,
                currency=currency,
                line_total=line_total,
                available_quantity=available_quantity,
            )
        )

    return CartResponse(
        id=cart.id,
        currency=cart.currency,
        total_items=sum(item.quantity for item in active_items),
        subtotal=subtotal,
        items=lines,
    )
