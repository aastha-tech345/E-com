from decimal import Decimal

from sqlalchemy.orm import Session

from app.core.config import settings
from app.modules.cart.application.service import add_item_to_cart, build_cart_response, get_cart, update_cart_item
from app.modules.catalog.application.schemas import (
    BrandCreateRequest,
    CategoryCreateRequest,
    ProductCreateRequest,
    ProductVariantPayload,
)
from app.modules.catalog.application.service import create_brand, create_category, create_product
from app.modules.identity.application.schemas import UserRegisterRequest
from app.modules.identity.application.service import ensure_default_admin, register_user
from app.modules.inventory.application.service import get_inventory_item, set_inventory_level
from app.modules.pricing.application.service import get_active_price, set_active_price


def test_inventory_pricing_and_cart_flow(db_session: Session) -> None:
    ensure_default_admin(db_session, settings.admin_email, settings.admin_password)
    customer = register_user(
        db_session,
        UserRegisterRequest(email="phase2-customer@example.com", full_name="Phase Two", password="Password123!"),
    )
    category = create_category(db_session, CategoryCreateRequest(name="Laptops", slug="laptops"))
    brand = create_brand(db_session, BrandCreateRequest(name="Nimbus", slug="nimbus"))
    product = create_product(
        db_session,
        ProductCreateRequest(
            category_id=category.id,
            brand_id=brand.id,
            name="Nimbus Air",
            slug="nimbus-air",
            short_description="Thin and light",
            description="Phase 2 validation product",
            is_published=True,
            variants=[
                ProductVariantPayload(
                    name="16GB / 512GB",
                    sku="NIMBUS-AIR-16-512",
                    price=Decimal("74999.00"),
                    currency="INR",
                    quantity_available=5,
                    is_default=True,
                )
            ],
            media=[],
        ),
    )
    variant = product.variants[0]

    price = get_active_price(db_session, variant_id=variant.id)
    assert price is not None
    assert price.amount == Decimal("74999.00")

    inventory = get_inventory_item(db_session, variant_id=variant.id)
    assert inventory is not None
    assert inventory.on_hand == 5
    assert inventory.reserved == 0

    set_active_price(db_session, variant_id=variant.id, amount=Decimal("72999.00"), currency="INR")
    set_inventory_level(db_session, variant_id=variant.id, on_hand=7, reason="restock")
    db_session.commit()

    cart = add_item_to_cart(db_session, user_id=customer.user.id, variant_id=variant.id, quantity=2)
    response = build_cart_response(db_session, cart=cart)
    assert response.total_items == 2
    assert response.subtotal == Decimal("145998.00")

    inventory_after_reserve = get_inventory_item(db_session, variant_id=variant.id)
    assert inventory_after_reserve is not None
    assert inventory_after_reserve.reserved == 2
    assert inventory_after_reserve.available == 5

    updated_cart = update_cart_item(db_session, user_id=customer.user.id, variant_id=variant.id, quantity=1)
    updated_response = build_cart_response(db_session, cart=updated_cart)
    assert updated_response.total_items == 1
    assert updated_response.subtotal == Decimal("72999.00")

    final_inventory = get_inventory_item(db_session, variant_id=variant.id)
    assert final_inventory is not None
    assert final_inventory.reserved == 1
    assert get_cart(db_session, user_id=customer.user.id).items[0].quantity == 1
