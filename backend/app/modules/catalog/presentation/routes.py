from math import ceil

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.database import get_db_session
from app.modules.catalog.application.schemas import BrandResponse, CategoryResponse, ProductPageResponse, ProductResponse
from app.modules.catalog.application.service import (
    get_product_by_slug,
    hydrate_product_read_model,
    list_brands,
    list_categories,
    list_products,
)
from app.modules.catalog.domain.models import Brand, Category, Product
from app.modules.reviews.domain.models import Review

router = APIRouter(tags=["catalog"])


@router.get("/categories", response_model=list[CategoryResponse])
def categories(db: Session = Depends(get_db_session)) -> list[Category]:
    return list_categories(db)


@router.get("/brands", response_model=list[BrandResponse])
def brands(db: Session = Depends(get_db_session)) -> list[Brand]:
    return list_brands(db)


@router.get("/products", response_model=ProductPageResponse)
def products(
    q: str | None = Query(default=None, description="Simple PostgreSQL/SQLAlchemy-backed search term."),
    category: list[str] | None = Query(default=None),
    brand: list[str] | None = Query(default=None),
    min_price: float | None = Query(default=None, ge=0),
    max_price: float | None = Query(default=None, ge=0),
    min_rating: float | None = Query(default=None, ge=0, le=5),
    sort: str = Query(default="relevance"),
    page: int = Query(default=1, ge=1),
    per_page: int = Query(default=12, ge=1, le=100),
    db: Session = Depends(get_db_session),
) -> ProductPageResponse:
    rows, total = list_products(
        db,
        query=q,
        published_only=True,
        category_slugs=category,
        brand_slugs=brand,
        min_price=min_price,
        max_price=max_price,
        min_rating=min_rating,
        sort=sort,
        page=page,
        per_page=per_page,
    )
    items = []
    for product in rows:
        hydrated = hydrate_product_read_model(db, product)
        rating, review_count = db.query(func.coalesce(func.avg(Review.rating), 0), func.count(Review.id)).filter(Review.product_id == product.id).one()
        items.append(ProductResponse.model_validate(hydrated).model_copy(update={
            "category_name": hydrated.category.name,
            "category_slug": hydrated.category.slug,
            "brand_name": hydrated.brand.name if hydrated.brand else None,
            "brand_slug": hydrated.brand.slug if hydrated.brand else None,
            "average_rating": float(rating),
            "review_count": review_count,
        }))
    return ProductPageResponse(items=items, total=total, page=page, per_page=per_page, pages=ceil(total / per_page) if total else 0)


@router.get("/products/{slug}", response_model=ProductResponse)
def product_detail(slug: str, db: Session = Depends(get_db_session)) -> Product:
    try:
        return hydrate_product_read_model(db, get_product_by_slug(db, slug))
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
