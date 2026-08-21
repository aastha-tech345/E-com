from decimal import Decimal

from sqlalchemy.orm import Session

from app.core.config import settings
from app.modules.catalog.application.schemas import CategoryCreateRequest, ProductCreateRequest, ProductVariantPayload
from app.modules.catalog.application.service import create_category, create_product
from app.modules.checkout.application.service import place_order_from_cart
from app.modules.identity.application.schemas import UserRegisterRequest
from app.modules.identity.application.service import ensure_default_admin, register_user
from app.modules.inventory.application.service import reserve_inventory
from app.modules.notifications.application.service import list_notifications, mark_all_notifications_read
from app.modules.orders.application.service import list_order_items_for_seller
from app.modules.payments.application.service import get_payment_for_order
from app.modules.search.application.service import search_products
from app.modules.settlements.application.service import (
    get_seller_settlement_summary,
    list_settlements_for_seller,
    mark_settlement_paid,
)
from app.modules.shipping.application.service import get_shipment_for_user, update_shipment_status
from app.shared.enums.roles import SystemRole


def test_seller_finance_tracking_and_notifications(db_session: Session) -> None:
    ensure_default_admin(db_session, settings.admin_email, settings.admin_password)
    seller = register_user(
        db_session,
        UserRegisterRequest(email="seller-phase1115@example.com", full_name="Seller Owner", password="Password123!"),
        role=SystemRole.SELLER_OWNER,
    )
    customer = register_user(
        db_session,
        UserRegisterRequest(email="buyer-phase1115@example.com", full_name="Buyer", password="Password123!"),
    )
    category = create_category(db_session, CategoryCreateRequest(name="Home Office", slug="home-office"))
    product = create_product(
        db_session,
        ProductCreateRequest(
            seller_id=seller.user.id,
            category_id=category.id,
            brand_id=None,
            name="Seller Desk",
            slug="seller-desk",
            short_description="Ergonomic desk",
            description="Height-adjustable desk",
            is_published=True,
            variants=[
                ProductVariantPayload(
                    name="Standard",
                    sku="SELLER-DESK-STD",
                    price=Decimal("12000.00"),
                    currency="INR",
                    quantity_available=4,
                    is_default=True,
                )
            ],
            media=[],
        ),
    )
    cart = search_products(db_session, query="desk", user_id=customer.user.id)[0]
    assert cart[0].slug == "seller-desk"

    from app.modules.cart.application.service import add_item_to_cart

    add_item_to_cart(db_session, user_id=customer.user.id, variant_id=product.variants[0].id, quantity=1)
    reserve_inventory(db_session, variant_id=product.variants[0].id, quantity=1)

    order = place_order_from_cart(
        db_session,
        user_id=customer.user.id,
        shipping_name="Buyer",
        address_line1="42 Market Street",
        city="Bengaluru",
        state="Karnataka",
        postal_code="560001",
        payment_method="card",
        payment_reference="phase1115-pay-001",
        idempotency_key="phase1115-order-001",
        coupon_code=None,
    )
    assert order.items[0].seller_id == seller.user.id
    assert order.items[0].commission_amount == Decimal("1200.00")
    assert order.items[0].seller_payout_amount == Decimal("10800.00")

    payment = get_payment_for_order(db_session, order_id=order.id)
    assert payment is not None
    assert payment.amount == Decimal("12000.00")

    seller_items = list_order_items_for_seller(db_session, seller_user_id=seller.user.id)
    assert len(seller_items) == 1
    assert seller_items[0].seller_payout_amount == Decimal("10800.00")

    settlements = list_settlements_for_seller(db_session, seller_user_id=seller.user.id)
    assert len(settlements) == 1
    assert settlements[0].total_amount == Decimal("10800.00")

    summary = get_seller_settlement_summary(db_session, seller_user_id=seller.user.id)
    assert summary["pending_total"] == Decimal("10800.00")

    updated = mark_settlement_paid(db_session, settlement_id=settlements[0].id, payout_reference="PAYOUT-1115-01")
    assert updated.status == "paid"
    assert updated.payout_reference == "PAYOUT-1115-01"

    shipment = get_shipment_for_user(db_session, user_id=customer.user.id, order_id=order.id)
    assert shipment.status == "pending"
    update_shipment_status(
        db_session,
        order_id=order.id,
        status="shipped",
        tracking_number="TRACK-1115",
        note="Handed to carrier",
    )
    db_session.commit()
    shipment = get_shipment_for_user(db_session, user_id=customer.user.id, order_id=order.id)
    assert shipment.status == "shipped"
    assert shipment.tracking_number == "TRACK-1115"
    assert len(shipment.events) == 2

    notifications = list_notifications(db_session, user_id=customer.user.id)
    assert len(notifications) >= 2
    assert any("Shipment status changed to shipped." in notification.message for notification in notifications)
    read_notifications = mark_all_notifications_read(db_session, user_id=customer.user.id)
    assert all(notification.is_read for notification in read_notifications)
