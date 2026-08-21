from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.database import get_db_session
from app.modules.catalog.application.schemas import (
    BrandCreateRequest,
    BrandUpdateRequest,
    BrandResponse,
    CatalogSeedResponse,
    CategoryCreateRequest,
    CategoryUpdateRequest,
    CategoryResponse,
    ProductCreateRequest,
    ProductUpdateRequest,
    ProductResponse,
)
from app.modules.catalog.application.service import (
    create_brand,
    create_category,
    create_product,
    delete_brand,
    delete_category,
    delete_product,
    hydrate_product_read_model,
    list_admin_products,
    seed_catalog,
    update_brand,
    update_category,
    update_product,
)
from app.modules.catalog.domain.models import Brand, Category, Product
from app.modules.identity.application.schemas import UserProfileResponse
from app.modules.identity.presentation.dependencies import require_roles
from app.shared.enums.roles import SystemRole

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/products", response_model=list[ProductResponse])
def admin_products(
    _: UserProfileResponse = Depends(require_roles(SystemRole.ADMIN_CATALOG.value, SystemRole.SUPER_ADMIN.value)),
    db: Session = Depends(get_db_session),
) -> list[Product]:
    return [hydrate_product_read_model(db, product) for product in list_admin_products(db)]


@router.post("/categories", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def admin_create_category(
    payload: CategoryCreateRequest,
    _: UserProfileResponse = Depends(require_roles(SystemRole.ADMIN_CATALOG.value, SystemRole.SUPER_ADMIN.value)),
    db: Session = Depends(get_db_session),
) -> Category:
    try:
        return create_category(db, payload)
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=400, detail="Category slug already exists.") from exc


@router.post("/brands", response_model=BrandResponse, status_code=status.HTTP_201_CREATED)
def admin_create_brand(
    payload: BrandCreateRequest,
    _: UserProfileResponse = Depends(require_roles(SystemRole.ADMIN_CATALOG.value, SystemRole.SUPER_ADMIN.value)),
    db: Session = Depends(get_db_session),
) -> Brand:
    try:
        return create_brand(db, payload)
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=400, detail="Brand slug already exists.") from exc


@router.post("/products", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def admin_create_product(
    payload: ProductCreateRequest,
    _: UserProfileResponse = Depends(require_roles(SystemRole.ADMIN_CATALOG.value, SystemRole.SUPER_ADMIN.value)),
    db: Session = Depends(get_db_session),
) -> Product:
    try:
        return hydrate_product_read_model(db, create_product(db, payload))
    except ValueError as exc:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=400, detail="Product slug or SKU already exists.") from exc


@router.post("/seed-catalog", response_model=CatalogSeedResponse, status_code=status.HTTP_201_CREATED)
def admin_seed_catalog(
    _: UserProfileResponse = Depends(require_roles(SystemRole.ADMIN_CATALOG.value, SystemRole.SUPER_ADMIN.value)),
    db: Session = Depends(get_db_session),
) -> CatalogSeedResponse:
    try:
        return seed_catalog(db)
    except ValueError as exc:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=400, detail="Catalog seed conflicted with existing data.") from exc



@router.put("/products/{product_id}", response_model=ProductResponse)
def admin_update_product(
    product_id: str,
    payload: ProductUpdateRequest,
    _: UserProfileResponse = Depends(require_roles(SystemRole.ADMIN_CATALOG.value, SystemRole.SUPER_ADMIN.value)),
    db: Session = Depends(get_db_session),
) -> Product:
    try:
        return hydrate_product_read_model(db, update_product(db, product_id, payload))
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=400, detail="Product slug or SKU already exists.") from exc


@router.delete("/products/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete_product(
    product_id: str,
    _: UserProfileResponse = Depends(require_roles(SystemRole.ADMIN_CATALOG.value, SystemRole.SUPER_ADMIN.value)),
    db: Session = Depends(get_db_session),
) -> None:
    try:
        delete_product(db, product_id)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.put("/categories/{category_id}", response_model=CategoryResponse)
def admin_update_category(
    category_id: str,
    payload: CategoryUpdateRequest,
    _: UserProfileResponse = Depends(require_roles(SystemRole.ADMIN_CATALOG.value, SystemRole.SUPER_ADMIN.value)),
    db: Session = Depends(get_db_session),
) -> Category:
    try:
        return update_category(db, category_id, payload)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=400, detail="Category slug already exists.") from exc


@router.delete("/categories/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete_category(
    category_id: str,
    _: UserProfileResponse = Depends(require_roles(SystemRole.ADMIN_CATALOG.value, SystemRole.SUPER_ADMIN.value)),
    db: Session = Depends(get_db_session),
) -> None:
    try:
        delete_category(db, category_id)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.put("/brands/{brand_id}", response_model=BrandResponse)
def admin_update_brand(
    brand_id: str,
    payload: BrandUpdateRequest,
    _: UserProfileResponse = Depends(require_roles(SystemRole.ADMIN_CATALOG.value, SystemRole.SUPER_ADMIN.value)),
    db: Session = Depends(get_db_session),
) -> Brand:
    try:
        return update_brand(db, brand_id, payload)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=400, detail="Brand slug already exists.") from exc


@router.delete("/brands/{brand_id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete_brand(
    brand_id: str,
    _: UserProfileResponse = Depends(require_roles(SystemRole.ADMIN_CATALOG.value, SystemRole.SUPER_ADMIN.value)),
    db: Session = Depends(get_db_session),
) -> None:
    try:
        delete_brand(db, brand_id)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
