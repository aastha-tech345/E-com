from decimal import Decimal

from sqlalchemy.orm import Session

from app.core.config import settings
from app.modules.ai_assistant.application.service import answer_prompt
from app.modules.analytics.application.service import analytics_summary
from app.modules.catalog.application.schemas import (
    BrandCreateRequest,
    CategoryCreateRequest,
    ProductCreateRequest,
    ProductVariantPayload,
)
from app.modules.catalog.application.service import create_brand, create_category, create_product
from app.modules.identity.application.schemas import UserRegisterRequest
from app.modules.identity.application.service import ensure_default_admin, register_user
from app.modules.promotions.application.service import apply_coupon, create_coupon
from app.modules.search.application.service import search_products
from app.modules.wishlist.application.service import add_to_wishlist, list_wishlist_products, remove_from_wishlist


def test_search_wishlist_coupon_analytics_and_ai(db_session: Session) -> None:
    ensure_default_admin(db_session, settings.admin_email, settings.admin_password)
    customer = register_user(
        db_session,
        UserRegisterRequest(email="phase610@example.com", full_name="Growth User", password="Password123!"),
    )
    category = create_category(db_session, CategoryCreateRequest(name="Audio", slug="audio"))
    brand = create_brand(db_session, BrandCreateRequest(name="Echo", slug="echo"))
    product = create_product(
        db_session,
        ProductCreateRequest(
            category_id=category.id,
            brand_id=brand.id,
            name="Echo Buds",
            slug="echo-buds",
            short_description="Wireless earbuds",
            description="Growth feature validation product",
            is_published=True,
            variants=[
                ProductVariantPayload(
                    name="Standard",
                    sku="ECHO-BUDS-STD",
                    price=Decimal("4999.00"),
                    currency="INR",
                    quantity_available=8,
                    is_default=True,
                )
            ],
            media=[],
        ),
    )

    results, _ = search_products(db_session, query="earbuds", user_id=customer.user.id)
    assert len(results) == 1
    assert results[0].slug == "echo-buds"

    add_to_wishlist(db_session, user_id=customer.user.id, product_id=product.id)
    wishlist = list_wishlist_products(db_session, user_id=customer.user.id)
    assert len(wishlist) == 1
    remove_from_wishlist(db_session, user_id=customer.user.id, product_id=product.id)
    assert list_wishlist_products(db_session, user_id=customer.user.id) == []

    create_coupon(
        db_session,
        code="SAVE500",
        description="Launch discount",
        discount_type="flat",
        amount=Decimal("500.00"),
    )
    _, discount = apply_coupon(db_session, code="SAVE500", subtotal=Decimal("4999.00"))
    assert discount == Decimal("500.00")

    summary = analytics_summary(db_session)
    assert summary.total_products >= 1
    assert summary.total_customers >= 2
    assert summary.total_searches >= 1

    conversation, answer, products, intent, used_tools, metadata = answer_prompt(
        db_session,
        prompt="wireless earbuds",
        user_id=customer.user.id,
        conversation_id=None,
    )
    assert conversation.id
    assert "wireless earbuds" in answer.lower()
    assert len(products) >= 1
    assert intent == "product_search"
    assert "catalog.search_products" in used_tools
    assert metadata["llm_provider"] == "rule_based"
