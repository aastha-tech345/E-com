from decimal import Decimal

from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import decode_access_token
from app.modules.catalog.application.schemas import (
    BrandCreateRequest,
    CategoryCreateRequest,
    ProductCreateRequest,
    ProductMediaPayload,
    ProductVariantPayload,
)
from app.modules.catalog.application.service import (
    create_brand,
    create_category,
    create_product,
    list_products,
    seed_catalog,
)
from app.modules.identity.application.schemas import UserLoginRequest, UserRegisterRequest
from app.modules.identity.application.service import authenticate_user, register_user


def test_register_login_and_catalog_flow(db_session: Session) -> None:
    register_response = register_user(
        db_session,
        UserRegisterRequest(email="customer@example.com", full_name="Customer One", password="Password123!"),
    )
    assert register_response.user.roles == ["customer"]
    assert decode_access_token(register_response.access_token)["email"] == "customer@example.com"

    admin_login = authenticate_user(
        db_session,
        UserLoginRequest(email=settings.admin_email, password=settings.admin_password),
    )
    assert "super_admin" in admin_login.user.roles

    category = create_category(db_session, CategoryCreateRequest(name="Mobiles", slug="mobiles"))
    brand = create_brand(db_session, BrandCreateRequest(name="Acme", slug="acme"))

    product = create_product(
        db_session,
        ProductCreateRequest(
            category_id=category.id,
            brand_id=brand.id,
            name="Acme X1",
            slug="acme-x1",
            short_description="Launch product",
            description="A flagship smartphone",
            is_published=True,
            variants=[
                ProductVariantPayload(
                    name="8GB / 128GB",
                    sku="ACME-X1-128",
                    price=Decimal("19999.00"),
                    currency="INR",
                    quantity_available=10,
                    is_default=True,
                )
            ],
            media=[
                ProductMediaPayload(
                    media_url="https://example.com/x1.jpg",
                    alt_text="Acme X1",
                    sort_order=1,
                )
            ],
        ),
    )
    assert product.slug == "acme-x1"

    public_products = list_products(db_session)
    assert len(public_products) == 1

    search_response = list_products(db_session, query="flagship")
    assert search_response[0].slug == "acme-x1"


def test_seed_catalog_is_idempotent(db_session: Session) -> None:
    first_seed = seed_catalog(db_session)
    second_seed = seed_catalog(db_session)

    assert first_seed.categories_created > 0
    assert first_seed.brands_created > 0
    assert first_seed.products_created > 0
    assert first_seed.products_skipped == 0

    assert second_seed.categories_created == 0
    assert second_seed.brands_created == 0
    assert second_seed.products_created == 0
    assert second_seed.products_skipped == first_seed.products_created

    public_products = list_products(db_session)
    assert len(public_products) == first_seed.products_created
