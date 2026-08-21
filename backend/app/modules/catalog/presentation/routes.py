from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.database import get_db_session
from app.modules.catalog.application.schemas import BrandResponse, CategoryResponse, ProductResponse
from app.modules.catalog.application.service import (
    get_product_by_slug,
    hydrate_product_read_model,
    list_brands,
    list_categories,
    list_products,
)
from app.modules.catalog.domain.models import Brand, Category, Product

router = APIRouter(tags=["catalog"])


@router.get("/categories", response_model=list[CategoryResponse])
def categories(db: Session = Depends(get_db_session)) -> list[Category]:
    return list_categories(db)


@router.get("/brands", response_model=list[BrandResponse])
def brands(db: Session = Depends(get_db_session)) -> list[Brand]:
    return list_brands(db)


@router.get("/products", response_model=list[ProductResponse])
def products(
    q: str | None = Query(default=None, description="Simple PostgreSQL/SQLAlchemy-backed search term."),
    db: Session = Depends(get_db_session),
) -> list[Product]:
    return [hydrate_product_read_model(db, product) for product in list_products(db, query=q, published_only=True)]


@router.get("/products/{slug}", response_model=ProductResponse)
def product_detail(slug: str, db: Session = Depends(get_db_session)) -> Product:
    try:
        return hydrate_product_read_model(db, get_product_by_slug(db, slug))
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
