from datetime import datetime, timezone
from decimal import Decimal
from typing import Any, cast

from sqlalchemy import and_, func, or_, select
from sqlalchemy.orm import Session, selectinload

from app.modules.catalog.application.schemas import (
    BrandCreateRequest,
    BrandUpdateRequest,
    CatalogSeedResponse,
    CategoryCreateRequest,
    CategoryUpdateRequest,
    ProductCreateRequest,
    ProductUpdateRequest,
)
from app.modules.catalog.domain.models import Brand, Category, Product, ProductMedia, ProductVariant
from app.modules.reviews.domain.models import Review
from app.modules.catalog.infrastructure.seed_data import SEED_BRANDS, SEED_CATEGORIES, SEED_PRODUCTS
from app.modules.inventory.application.service import ensure_inventory_item, get_inventory_item, set_inventory_level
from app.modules.pricing.application.service import create_default_price, get_active_price, set_active_price


def create_category(db: Session, payload: CategoryCreateRequest) -> Category:
    category = Category(name=payload.name, slug=payload.slug, description=payload.description, parent_id=payload.parent_id)
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


def create_brand(db: Session, payload: BrandCreateRequest) -> Brand:
    brand = Brand(name=payload.name, slug=payload.slug, description=payload.description)
    db.add(brand)
    db.commit()
    db.refresh(brand)
    return brand


def create_product(db: Session, payload: ProductCreateRequest) -> Product:
    default_variants = [variant for variant in payload.variants if variant.is_default]
    if len(default_variants) != 1:
        raise ValueError("Exactly one default variant is required.")

    product = Product(
        seller_id=payload.seller_id,
        category_id=payload.category_id,
        brand_id=payload.brand_id,
        name=payload.name,
        slug=payload.slug,
        short_description=payload.short_description,
        description=payload.description,
        is_published=payload.is_published,
    )
    db.add(product)
    db.flush()

    for variant in payload.variants:
        variant_model = ProductVariant(
            product_id=product.id,
            name=variant.name,
            sku=variant.sku,
            price=variant.price,
            currency=variant.currency,
            quantity_available=variant.quantity_available,
            is_default=variant.is_default,
        )
        db.add(variant_model)
        db.flush()
        create_default_price(
            db,
            variant_id=variant_model.id,
            amount=variant.price,
            currency=variant.currency,
        )
        ensure_inventory_item(
            db,
            variant_id=variant_model.id,
            on_hand=variant.quantity_available,
        )

    for media in payload.media:
        db.add(
            ProductMedia(
                product_id=product.id,
                media_url=media.media_url,
                alt_text=media.alt_text,
                sort_order=media.sort_order,
            )
        )

    db.commit()
    return get_product_by_slug(db, payload.slug)


def seed_catalog(db: Session) -> CatalogSeedResponse:
    category_map = {category.slug: category for category in list_categories(db)}
    brand_map = {brand.slug: brand for brand in list_brands(db)}
    categories_created = 0
    brands_created = 0
    products_created = 0
    products_skipped = 0

    for category_payload in SEED_CATEGORIES:
        if category_payload.slug in category_map:
            continue
        category = create_category(db, category_payload)
        category_map[category.slug] = category
        categories_created += 1

    for brand_payload in SEED_BRANDS:
        if brand_payload.slug in brand_map:
            continue
        brand = create_brand(db, brand_payload)
        brand_map[brand.slug] = brand
        brands_created += 1

    existing_products = {product.slug: product for product in list_admin_products(db)}
    for product_payload in SEED_PRODUCTS:
        if product_payload.slug in existing_products:
            product = existing_products[product_payload.slug]
            if product_payload.media:
                cover = min(product_payload.media, key=lambda media: media.sort_order)
                existing_cover = min(product.media, key=lambda media: media.sort_order) if product.media else None
                if existing_cover:
                    existing_cover.media_url = cover.media_url
                    existing_cover.alt_text = cover.alt_text
                    existing_cover.sort_order = cover.sort_order
                else:
                    db.add(
                        ProductMedia(
                            product_id=product.id,
                            media_url=cover.media_url,
                            alt_text=cover.alt_text,
                            sort_order=cover.sort_order,
                        )
                    )
                db.commit()
            products_skipped += 1
            continue

        if product_payload.category_id not in category_map:
            raise ValueError(f"Seed category '{product_payload.category_id}' is not available.")
        if product_payload.brand_id is not None and product_payload.brand_id not in brand_map:
            raise ValueError(f"Seed brand '{product_payload.brand_id}' is not available.")

        created_product = create_product(
            db,
            product_payload.model_copy(
                update={
                    "category_id": category_map[product_payload.category_id].id,
                    "brand_id": (
                        brand_map[product_payload.brand_id].id if product_payload.brand_id is not None else None
                    ),
                }
            ),
        )
        existing_products[product_payload.slug] = created_product
        products_created += 1

    return CatalogSeedResponse(
        categories_created=categories_created,
        brands_created=brands_created,
        products_created=products_created,
        products_skipped=products_skipped,
    )


def list_categories(db: Session) -> list[Category]:
    return list(db.scalars(select(Category).where(Category.is_deleted.is_(False)).order_by(Category.created_at.desc())).all())


def list_brands(db: Session) -> list[Brand]:
    return list(db.scalars(select(Brand).where(Brand.is_deleted.is_(False)).order_by(Brand.created_at.desc())).all())


def list_products(
    db: Session,
    query: str | None = None,
    published_only: bool = True,
    category_slugs: list[str] | None = None,
    brand_slugs: list[str] | None = None,
    min_price: Decimal | None = None,
    max_price: Decimal | None = None,
    min_rating: float | None = None,
    sort: str = "relevance",
    page: int | None = None,
    per_page: int | None = None,
) -> tuple[list[Product], int] | list[Product]:
    statement = (
        select(Product)
        .options(selectinload(Product.variants), selectinload(Product.media), selectinload(Product.category), selectinload(Product.brand))
    )
    statement = statement.where(Product.is_deleted.is_(False))
    if published_only:
        statement = statement.where(Product.is_published.is_(True))
    if query:
        term = f"%{query.lower()}%"
        statement = statement.where(
            or_(
                Product.name.ilike(term),
                Product.short_description.ilike(term),
                Product.description.ilike(term),
                Product.category.has(Category.name.ilike(term)),
                Product.brand.has(Brand.name.ilike(term)),
                Product.variants.any(ProductVariant.sku.ilike(term)),
            )
        )
    if category_slugs:
        statement = statement.join(Product.category).where(Category.slug.in_(category_slugs))
    if brand_slugs:
        statement = statement.join(Product.brand).where(Brand.slug.in_(brand_slugs))

    variant_price = select(ProductVariant.price).where(ProductVariant.product_id == Product.id).correlate(Product).scalar_subquery()
    if min_price is not None:
        statement = statement.where(variant_price >= min_price)
    if max_price is not None:
        statement = statement.where(variant_price <= max_price)

    rating_value = (
        select(func.coalesce(func.avg(Review.rating), 0))
        .where(Review.product_id == Product.id)
        .correlate(Product)
        .scalar_subquery()
    )
    if min_rating is not None:
        statement = statement.where(rating_value >= min_rating)

    if sort == "price-low":
        statement = statement.order_by(variant_price.asc(), Product.created_at.desc())
    elif sort == "price-high":
        statement = statement.order_by(variant_price.desc(), Product.created_at.desc())
    elif sort == "rating":
        statement = statement.order_by(rating_value.desc(), Product.created_at.desc())
    else:
        statement = statement.order_by(Product.created_at.desc())

    if page is None or per_page is None:
        return list(db.scalars(statement).unique().all())

    total = db.scalar(select(func.count()).select_from(statement.order_by(None).subquery())) or 0
    rows = list(db.scalars(statement.offset((page - 1) * per_page).limit(per_page)).unique().all())
    return rows, total


def list_admin_products(db: Session) -> list[Product]:
    return list_products(db, published_only=False)


def get_product_by_slug(db: Session, slug: str) -> Product:
    product = db.scalar(
        select(Product)
        .options(selectinload(Product.variants), selectinload(Product.media))
        .where(Product.slug == slug, Product.is_deleted.is_(False))
    )
    if product is None:
        raise ValueError("Product not found.")
    return product


def hydrate_product_read_model(db: Session, product: Product) -> Product:
    for variant in product.variants:
        variant_view = cast(Any, variant)
        price = get_active_price(db, variant_id=variant.id)
        inventory = get_inventory_item(db, variant_id=variant.id)
        if price is not None:
            variant.price = price.amount
            variant.currency = price.currency
        if inventory is not None:
            variant.quantity_available = inventory.available
            variant_view.inventory_on_hand = inventory.on_hand
            variant_view.inventory_reserved = inventory.reserved
        else:
            variant_view.inventory_on_hand = variant.quantity_available
            variant_view.inventory_reserved = 0
    return product



def update_product(db: Session, product_id: str, payload: "ProductUpdateRequest") -> Product:
    """Update product fields."""
    product = db.scalar(select(Product).where(Product.id == product_id, Product.is_deleted.is_(False)))
    if not product:
        raise ValueError("Product not found.")
    
    if payload.category_id is not None:
        product.category_id = payload.category_id
    if payload.brand_id is not None:
        product.brand_id = payload.brand_id
    if payload.name is not None:
        product.name = payload.name
    if payload.slug is not None:
        product.slug = payload.slug
    if payload.short_description is not None:
        product.short_description = payload.short_description
    if payload.description is not None:
        product.description = payload.description
    if payload.is_published is not None:
        product.is_published = payload.is_published
    default_variant = next((variant for variant in product.variants if variant.is_default), None)
    if default_variant is not None:
        if payload.sku is not None:
            default_variant.sku = payload.sku
        if payload.price is not None:
            default_variant.price = payload.price
            set_active_price(
                db,
                variant_id=default_variant.id,
                amount=payload.price,
                currency=default_variant.currency,
            )
        if payload.quantity_available is not None:
            default_variant.quantity_available = payload.quantity_available
            set_inventory_level(
                db,
                variant_id=default_variant.id,
                on_hand=payload.quantity_available,
                reason="admin_product_update",
            )
    if payload.media is not None:
        product.media.clear()
        for media in payload.media:
            product.media.append(
                ProductMedia(
                    media_url=media.media_url,
                    alt_text=media.alt_text,
                    sort_order=media.sort_order,
                )
            )
    
    db.commit()
    db.refresh(product)
    return product


def delete_product(db: Session, product_id: str) -> None:
    """Delete product."""
    product = db.scalar(select(Product).where(Product.id == product_id))
    if not product:
        raise ValueError("Product not found.")
    product.is_deleted = True
    product.deleted_at = datetime.now(timezone.utc)
    db.commit()


def update_category(db: Session, category_id: str, payload: "CategoryUpdateRequest") -> Category:
    """Update category fields."""
    category = db.scalar(select(Category).where(Category.id == category_id, Category.is_deleted.is_(False)))
    if not category:
        raise ValueError("Category not found.")
    
    if payload.name is not None:
        category.name = payload.name
    if payload.slug is not None:
        category.slug = payload.slug
    if payload.description is not None:
        category.description = payload.description
    if payload.parent_id is not None:
        category.parent_id = payload.parent_id
    
    db.commit()
    db.refresh(category)
    return category


def delete_category(db: Session, category_id: str) -> None:
    """Delete category."""
    category = db.scalar(select(Category).where(Category.id == category_id, Category.is_deleted.is_(False)))
    if not category:
        raise ValueError("Category not found.")
    category.is_deleted = True
    category.deleted_at = datetime.now(timezone.utc)
    db.commit()


def update_brand(db: Session, brand_id: str, payload: "BrandUpdateRequest") -> Brand:
    """Update brand fields."""
    brand = db.scalar(select(Brand).where(Brand.id == brand_id, Brand.is_deleted.is_(False)))
    if not brand:
        raise ValueError("Brand not found.")
    
    if payload.name is not None:
        brand.name = payload.name
    if payload.slug is not None:
        brand.slug = payload.slug
    if payload.description is not None:
        brand.description = payload.description
    
    db.commit()
    db.refresh(brand)
    return brand


def delete_brand(db: Session, brand_id: str) -> None:
    """Delete brand."""
    brand = db.scalar(select(Brand).where(Brand.id == brand_id, Brand.is_deleted.is_(False)))
    if not brand:
        raise ValueError("Brand not found.")
    brand.is_deleted = True
    brand.deleted_at = datetime.now(timezone.utc)
    db.commit()
