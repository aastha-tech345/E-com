from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.modules.cart.application.service import add_item_to_cart, get_cart
from app.modules.catalog.application.schemas import (
    BrandCreateRequest,
    CategoryCreateRequest,
    ProductCreateRequest,
    ProductVariantPayload,
)
from app.modules.catalog.application.service import create_brand, create_category, create_product
from app.modules.checkout.application.service import place_order_from_cart
from app.modules.identity.application.schemas import UserRegisterRequest
from app.modules.identity.application.service import ensure_default_admin, register_user
from app.modules.notifications.application.service import list_notifications
from app.modules.orders.application.service import get_order_for_user
from app.modules.payments.application.service import get_payment_for_order
from app.modules.returns.application.service import create_return_request, decide_return
from app.modules.reviews.application.service import create_review
from app.modules.reviews.domain.models import Review
from app.modules.settlements.domain.models import SellerSettlement
from app.modules.shipping.application.service import update_shipment_status


def test_checkout_shipping_returns_reviews_and_notifications(db_session: Session) -> None:
    ensure_default_admin(db_session, settings.admin_email, settings.admin_password)
    customer = register_user(
        db_session,
        UserRegisterRequest(email="phase345@example.com", full_name="Phase Three", password="Password123!"),
    )
    category = create_category(db_session, CategoryCreateRequest(name="Tablets", slug="tablets"))
    brand = create_brand(db_session, BrandCreateRequest(name="Orbit", slug="orbit"))
    product = create_product(
        db_session,
        ProductCreateRequest(
            category_id=category.id,
            brand_id=brand.id,
            name="Orbit Tab",
            slug="orbit-tab",
            short_description="Pro tablet",
            description="Phase 3 to 5 validation product",
            is_published=True,
            variants=[
                ProductVariantPayload(
                    name="8GB / 256GB",
                    sku="ORBIT-TAB-256",
                    price=Decimal("31999.00"),
                    currency="INR",
                    quantity_available=3,
                    is_default=True,
                )
            ],
            media=[],
        ),
    )
    variant = product.variants[0]

    add_item_to_cart(db_session, user_id=customer.user.id, variant_id=variant.id, quantity=1)
    order = place_order_from_cart(
        db_session,
        user_id=customer.user.id,
        shipping_name="Phase Three",
        address_line1="221B Market Street",
        city="Bengaluru",
        state="Karnataka",
        postal_code="560001",
        payment_method="card",
        payment_reference="pay-phase345-001",
        idempotency_key="idem-phase345-001",
    )

    assert order.status == "confirmed"
    assert get_cart(db_session, user_id=customer.user.id).items == []
    payment = get_payment_for_order(db_session, order_id=order.id)
    assert payment is not None
    assert payment.amount == Decimal("31999.00")

    update_shipment_status(
        db_session,
        order_id=order.id,
        status="delivered",
        tracking_number="TRK-001",
        note="Delivered successfully",
    )
    db_session.commit()

    refreshed_order = get_order_for_user(db_session, user_id=customer.user.id, order_id=order.id)
    assert refreshed_order.status == "delivered"

    return_request = create_return_request(
        db_session,
        user_id=customer.user.id,
        order_item_id=refreshed_order.items[0].id,
        quantity=1,
        reason="Damaged box",
    )
    db_session.commit()
    assert return_request.status == "requested"

    processed_return, refund_amount = decide_return(db_session, return_id=return_request.id, status="approved")
    db_session.commit()
    assert processed_return.status == "approved"
    assert refund_amount == Decimal("31999.00")

    review = create_review(
        db_session,
        user_id=customer.user.id,
        order_id=order.id,
        product_id=product.id,
        rating=4,
        title="Solid tablet",
        content="The device worked well, but packaging had issues.",
    )
    db_session.commit()
    db_session.refresh(review)
    assert db_session.scalar(select(Review).where(Review.id == review.id)) is not None

    settlements = list(db_session.scalars(select(SellerSettlement)).all())
    assert len(settlements) == 1
    assert settlements[0].total_amount == Decimal("28799.10")

    notifications = list_notifications(db_session, user_id=customer.user.id)
    assert len(notifications) >= 3
