from decimal import Decimal

from sqlalchemy.orm import Session

from app.core.cache import cache_backend
from app.core.config import settings
from app.modules.analytics.application.service import analytics_summary_cached
from app.modules.background_jobs.application.service import list_jobs, process_pending_jobs
from app.modules.catalog.application.schemas import CategoryCreateRequest, ProductCreateRequest, ProductVariantPayload
from app.modules.catalog.application.service import create_category, create_product
from app.modules.identity.application.schemas import UserRegisterRequest
from app.modules.identity.application.service import ensure_default_admin, register_user
from app.modules.inventory.application.service import reserve_inventory
from app.modules.notifications.application.service import unread_notification_count
from app.modules.returns.application.service import list_all_returns, list_returns_for_user
from app.modules.search.application.service import (
    get_popular_search_terms_cached,
    get_search_suggestions,
    search_products,
)


def test_ops_platform_cache_jobs_and_returns(db_session: Session) -> None:
    ensure_default_admin(db_session, settings.admin_email, settings.admin_password)
    customer = register_user(
        db_session,
        UserRegisterRequest(email="ops-phase1620@example.com", full_name="Ops User", password="Password123!"),
    )
    category = create_category(db_session, CategoryCreateRequest(name="Gaming", slug="gaming"))
    product = create_product(
        db_session,
        ProductCreateRequest(
            category_id=category.id,
            brand_id=None,
            seller_id=None,
            name="Gaming Chair",
            slug="gaming-chair",
            short_description="Comfortable chair",
            description="Ergonomic gaming chair",
            is_published=True,
            variants=[
                ProductVariantPayload(
                    name="Black",
                    sku="GAMING-CHAIR-BLK",
                    price=Decimal("7000.00"),
                    currency="INR",
                    quantity_available=3,
                    is_default=True,
                )
            ],
            media=[],
        ),
    )

    search_products(db_session, query="gaming chair", user_id=customer.user.id)
    search_products(db_session, query="gaming chair", user_id=customer.user.id)
    search_products(db_session, query="gaming headset", user_id=customer.user.id)
    processed, completed, failed = process_pending_jobs(db_session, limit=20)
    assert processed >= 2
    assert completed >= 2
    assert failed == 0

    terms, cached = get_popular_search_terms_cached(db_session)
    assert terms[0] == "gaming chair"
    assert cached is True
    assert get_search_suggestions(db_session, query="gaming") == ["gaming chair", "gaming headset"]

    summary = analytics_summary_cached(db_session)
    assert summary.total_products >= 1
    assert cache_backend.get("analytics:summary") is not None

    from app.modules.cart.application.service import add_item_to_cart
    from app.modules.checkout.application.service import place_order_from_cart
    from app.modules.returns.application.service import create_return_request
    from app.modules.shipping.application.service import update_shipment_status

    add_item_to_cart(db_session, user_id=customer.user.id, variant_id=product.variants[0].id, quantity=1)
    reserve_inventory(db_session, variant_id=product.variants[0].id, quantity=1)
    order = place_order_from_cart(
        db_session,
        user_id=customer.user.id,
        shipping_name="Ops User",
        address_line1="16 Queue Street",
        city="Pune",
        state="Maharashtra",
        postal_code="411001",
        payment_method="card",
        payment_reference="ops-phase1620-pay",
        idempotency_key="ops-phase1620-order",
    )
    update_shipment_status(
        db_session,
        order_id=order.id,
        status="delivered",
        tracking_number="OPS-TRACK-1",
        note="Delivered to customer",
    )
    db_session.commit()

    return_request = create_return_request(
        db_session,
        user_id=customer.user.id,
        order_item_id=order.items[0].id,
        quantity=1,
        reason="Damaged on arrival",
    )
    db_session.commit()

    assert len(list_returns_for_user(db_session, user_id=customer.user.id)) == 1
    assert len(list_all_returns(db_session)) == 1
    assert return_request.status == "requested"
    assert unread_notification_count(db_session, user_id=customer.user.id) >= 1
    assert len(list_jobs(db_session)) >= 1
