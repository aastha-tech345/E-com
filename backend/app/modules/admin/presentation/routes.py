from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, Request, UploadFile, status
from sqlalchemy import String, cast, func, or_, select
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
    ProductAttributeCreateRequest,
    ProductAttributeResponse,
    ProductAttributeUpdateRequest,
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
from app.modules.catalog.domain.models import Brand, Category, Product, ProductAttribute
from app.modules.identity.domain.models import CustomerAddress, Role, User, UserRole
from app.modules.orders.domain.models import Order, OrderStatusHistory
from app.modules.ai_assistant.application.policies import MAX_POLICY_BYTES, delete_policy, ingest_policy, list_policies, rename_policy, replace_policy
from app.modules.identity.application.schemas import UserProfileResponse
from app.modules.identity.presentation.dependencies import require_roles
from app.shared.enums.roles import SystemRole

router = APIRouter(prefix="/admin", tags=["admin"])

MAX_PRODUCT_IMAGE_BYTES = 5 * 1024 * 1024
PRODUCT_IMAGE_CONTENT_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
}


def _page(items: list[object], total: int, page: int, page_size: int) -> dict[str, object]:
    return {"items": items, "total": total, "page": page, "page_size": page_size, "pages": (total + page_size - 1) // page_size}


def _catalog_page(model: type[Brand] | type[Category] | type[ProductAttribute], search_columns: list[object], q: str | None, page: int, page_size: int, sort_by: str, sort_order: str, db: Session, field: str = "all") -> dict[str, object]:
    allowed_columns = {"name", "slug", "created_at", "attribute_type"}
    column_name = sort_by if sort_by in allowed_columns and hasattr(model, sort_by) else "created_at"
    column = getattr(model, column_name)
    statement = select(model)
    if hasattr(model, "is_deleted"):
        statement = statement.where(model.is_deleted.is_(False))
    if q and search_columns:
        term = f"%{q.strip()}%"
        columns = [getattr(model, field)] if field != "all" and field in allowed_columns and hasattr(model, field) else search_columns
        statement = statement.where(or_(*(column.ilike(term) for column in columns)))
    statement = statement.order_by(column.asc() if sort_order == "asc" else column.desc())
    total = db.scalar(select(func.count()).select_from(statement.order_by(None).subquery())) or 0
    rows = list(db.scalars(statement.offset((page - 1) * page_size).limit(page_size)).all())
    items = []
    for row in rows:
        item: dict[str, object] = {
            "id": row.id,
            "name": row.name,
            "slug": row.slug,
            "created_at": row.created_at.isoformat(),
        }
        if hasattr(row, "description"):
            item["description"] = row.description
        if isinstance(row, ProductAttribute):
            item["attribute_type"] = row.attribute_type
            item["values"] = row.values
        items.append(item)
    return _page(items, total, page, page_size)


@router.get("/orders")
def admin_list_orders(q: str | None = None, field: str = "all", status: str | None = None, page: int = Query(1, ge=1), page_size: int = Query(25, ge=1, le=100), _: UserProfileResponse = Depends(require_roles(SystemRole.SUPER_ADMIN.value, SystemRole.ADMIN_ORDERS.value)), db: Session = Depends(get_db_session)) -> dict[str, object]:
    statement = select(Order).order_by(Order.created_at.desc())
    if q:
        term = f"%{q.strip()}%"
        fields = {
            "order_number": Order.order_number,
            "customer": Order.shipping_name,
            "total": cast(Order.subtotal, String),
            "status": Order.status,
            "created_at": cast(Order.created_at, String),
        }
        columns = [fields[field]] if field in fields else list(fields.values())
        statement = statement.where(or_(*(column.ilike(term) for column in columns)))
    if status:
        statement = statement.where(Order.status == status)
    total = len(db.scalars(statement).all())
    rows = db.scalars(statement.offset((page - 1) * page_size).limit(page_size)).all()
    return _page([{
        "id": row.id,
        "order_number": row.order_number,
        "customer": row.shipping_name,
        "total": float(row.subtotal),
        "status": row.status,
        "created_at": row.created_at.isoformat(),
        "shipping_address": {
            "line1": row.address_line1,
            "city": row.city,
            "state": row.state,
            "postal_code": row.postal_code,
        },
        "items": [{
            "product_name": item.product_name,
            "variant_name": item.variant_name,
            "sku": item.sku,
            "quantity": item.quantity,
            "unit_price": float(item.unit_price),
            "line_total": float(item.line_total),
        } for item in row.items],
    } for row in rows], total, page, page_size)


@router.put("/orders/{order_id}/status")
def admin_update_order_status(
    order_id: str,
    payload: dict[str, str],
    _: UserProfileResponse = Depends(require_roles(SystemRole.SUPER_ADMIN.value, SystemRole.ADMIN_ORDERS.value)),
    db: Session = Depends(get_db_session),
) -> dict[str, object]:
    next_status = payload.get("status", "").strip().lower()
    allowed_statuses = {"pending", "confirmed", "processing", "shipped", "delivered", "cancelled"}
    if next_status not in allowed_statuses:
        raise HTTPException(status_code=400, detail="Choose a valid order status.")

    order = db.get(Order, order_id)
    if order is None:
        raise HTTPException(status_code=404, detail="Order not found.")
    if order.status == next_status:
        return {"id": order.id, "status": order.status}

    order.status = next_status
    db.add(OrderStatusHistory(order_id=order.id, status=next_status, note="Updated by an administrator."))
    db.commit()
    return {"id": order.id, "status": order.status}


@router.get("/customers")
def admin_list_customers(q: str | None = None, field: str = "all", page: int = Query(1, ge=1), page_size: int = Query(25, ge=1, le=100), _: UserProfileResponse = Depends(require_roles(SystemRole.SUPER_ADMIN.value, SystemRole.ADMIN_CUSTOMERS.value)), db: Session = Depends(get_db_session)) -> dict[str, object]:
    statement = select(User).where(User.roles.any(UserRole.role.has(Role.name == "customer"))).order_by(User.created_at.desc())
    if q:
        term = f"%{q}%"
        if field == "name":
            statement = statement.where(User.full_name.ilike(term))
        elif field == "email":
            statement = statement.where(User.email.ilike(term))
        else:
            statement = statement.where(or_(User.full_name.ilike(term), User.email.ilike(term)))
    total = len(db.scalars(statement).all())
    rows = db.scalars(statement.offset((page - 1) * page_size).limit(page_size)).all()
    return _page([{ "id": row.id, "name": row.full_name, "email": row.email, "status": "active" if row.is_active else "inactive", "created_at": row.created_at.isoformat() } for row in rows], total, page, page_size)


@router.get("/customers/{customer_id}")
def admin_customer_detail(
    customer_id: str,
    _: UserProfileResponse = Depends(require_roles(SystemRole.SUPER_ADMIN.value, SystemRole.ADMIN_CUSTOMERS.value)),
    db: Session = Depends(get_db_session),
) -> dict[str, object]:
    customer = db.scalar(
        select(User).where(
            User.id == customer_id,
            User.roles.any(UserRole.role.has(Role.name == "customer")),
        )
    )
    if customer is None:
        raise HTTPException(status_code=404, detail="Customer not found.")
    addresses = list(db.scalars(select(CustomerAddress).where(CustomerAddress.user_id == customer.id).order_by(CustomerAddress.updated_at.desc())).all())
    orders = list(db.scalars(select(Order).where(Order.user_id == customer.id).order_by(Order.created_at.desc())).all())
    return {
        "id": customer.id,
        "name": customer.full_name,
        "email": customer.email,
        "status": "active" if customer.is_active else "inactive",
        "created_at": customer.created_at.isoformat(),
        "orders_count": len(orders),
        "total_spent": float(sum((order.subtotal for order in orders), start=0)),
        "addresses": [{
            "id": address.id,
            "recipient_name": address.recipient_name,
            "line1": address.line1,
            "city": address.city,
            "state": address.state,
            "postal_code": address.postal_code,
            "updated_at": address.updated_at.isoformat(),
        } for address in addresses],
    }


@router.get("/policies")
def admin_policies(
    _: UserProfileResponse = Depends(require_roles(SystemRole.SUPER_ADMIN.value, SystemRole.ADMIN_SUPPORT.value)),
    db: Session = Depends(get_db_session),
) -> list[dict[str, object]]:
    return [{"id": row.id, "title": row.title, "description": row.description, "created_at": row.created_at.isoformat()} for row in list_policies(db)]


@router.post("/policies", status_code=status.HTTP_201_CREATED)
async def admin_upload_policy(
    file: UploadFile = File(...),
    name: str | None = Form(default=None),
    description: str | None = Form(default=None),
    _: UserProfileResponse = Depends(require_roles(SystemRole.SUPER_ADMIN.value, SystemRole.ADMIN_SUPPORT.value)),
    db: Session = Depends(get_db_session),
) -> dict[str, object]:
    if not file.filename:
        raise HTTPException(status_code=400, detail="Choose a policy file to upload.")
    raw = await file.read(MAX_POLICY_BYTES + 1)
    if len(raw) > MAX_POLICY_BYTES:
        raise HTTPException(status_code=400, detail="Policy file must be 2 MB or smaller.")
    try:
        filename = f"{name.strip()}.txt" if name and name.strip() else file.filename
        document, chunk_count = ingest_policy(db, filename=filename, content=raw.decode("utf-8"), description=description or "")
    except UnicodeDecodeError as exc:
        raise HTTPException(status_code=400, detail="Policy files must be UTF-8 text or Markdown. PDF and Word files are not supported yet.") from exc
    except ValueError as exc:
        db.rollback()
        raise HTTPException(status_code=502, detail=str(exc)) from exc
    return {"id": document.id, "title": document.title, "chunks": chunk_count}


@router.put("/policies/{policy_id}")
def admin_rename_policy(policy_id: str, payload: dict[str, str], _: UserProfileResponse = Depends(require_roles(SystemRole.SUPER_ADMIN.value, SystemRole.ADMIN_SUPPORT.value)), db: Session = Depends(get_db_session)) -> dict[str, str]:
    try:
        document = rename_policy(db, policy_id, payload.get("title", ""), payload.get("description"))
        return {"id": document.id, "title": document.title, "description": document.description}
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.put("/policies/{policy_id}/file")
async def admin_replace_policy_file(
    policy_id: str,
    file: UploadFile = File(...),
    name: str | None = Form(default=None),
    description: str | None = Form(default=None),
    _: UserProfileResponse = Depends(require_roles(SystemRole.SUPER_ADMIN.value, SystemRole.ADMIN_SUPPORT.value)),
    db: Session = Depends(get_db_session),
) -> dict[str, object]:
    if not file.filename:
        raise HTTPException(status_code=400, detail="Choose a policy file to upload.")
    raw = await file.read(MAX_POLICY_BYTES + 1)
    if len(raw) > MAX_POLICY_BYTES:
        raise HTTPException(status_code=400, detail="Policy file must be 2 MB or smaller.")
    try:
        filename = f"{name.strip()}.txt" if name and name.strip() else file.filename
        document, chunk_count = replace_policy(db, policy_id, filename=filename, content=raw.decode("utf-8"), description=description or "")
    except UnicodeDecodeError as exc:
        raise HTTPException(status_code=400, detail="Policy files must be UTF-8 text or Markdown.") from exc
    except ValueError as exc:
        db.rollback()
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return {"id": document.id, "title": document.title, "chunks": chunk_count}


@router.delete("/policies/{policy_id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete_policy(policy_id: str, _: UserProfileResponse = Depends(require_roles(SystemRole.SUPER_ADMIN.value, SystemRole.ADMIN_SUPPORT.value)), db: Session = Depends(get_db_session)) -> None:
    try:
        delete_policy(db, policy_id)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.get("/products")
def admin_products(
    q: str | None = None,
    field: str = "all",
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    _: UserProfileResponse = Depends(require_roles(SystemRole.ADMIN_CATALOG.value, SystemRole.SUPER_ADMIN.value)),
    db: Session = Depends(get_db_session),
) -> dict[str, object]:
    rows = [hydrate_product_read_model(db, product) for product in list_admin_products(db)]
    if q and q.strip():
        term = q.strip().lower()

        def matches(product: Product) -> bool:
            values = {
                "name": product.name,
                "sku": product.variants[0].sku if product.variants else "",
                "category": product.category.name if product.category else "",
                "brand": product.brand.name if product.brand else "",
            }
            if field in values:
                return term in values[field].lower()
            return any(term in value.lower() for value in values.values())

        rows = [product for product in rows if matches(product)]

    total = len(rows)
    items = []
    for product in rows[(page - 1) * page_size : page * page_size]:
        items.append(ProductResponse.model_validate(product).model_copy(update={
            "category_name": product.category.name if product.category else None,
            "category_slug": product.category.slug if product.category else None,
            "brand_name": product.brand.name if product.brand else None,
            "brand_slug": product.brand.slug if product.brand else None,
        }))
    return _page(items, total, page, page_size)


@router.get("/products/{product_id}", response_model=ProductResponse)
def admin_product(
    product_id: str,
    _: UserProfileResponse = Depends(require_roles(SystemRole.ADMIN_CATALOG.value, SystemRole.SUPER_ADMIN.value)),
    db: Session = Depends(get_db_session),
) -> Product:
    product = next((item for item in list_admin_products(db) if item.id == product_id), None)
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found.")

    hydrated = hydrate_product_read_model(db, product)
    return ProductResponse.model_validate(hydrated).model_copy(
        update={
            "category_name": hydrated.category.name if hydrated.category else None,
            "category_slug": hydrated.category.slug if hydrated.category else None,
            "brand_name": hydrated.brand.name if hydrated.brand else None,
            "brand_slug": hydrated.brand.slug if hydrated.brand else None,
        }
    )


@router.post("/product-images")
async def admin_upload_product_image(
    request: Request,
    file: UploadFile = File(...),
    _: UserProfileResponse = Depends(require_roles(SystemRole.ADMIN_CATALOG.value, SystemRole.SUPER_ADMIN.value)),
) -> dict[str, str]:
    extension = PRODUCT_IMAGE_CONTENT_TYPES.get(file.content_type or "")
    if extension is None:
        raise HTTPException(status_code=400, detail="Upload a JPG, PNG, WEBP, or GIF image.")

    content = await file.read(MAX_PRODUCT_IMAGE_BYTES + 1)
    if not content:
        raise HTTPException(status_code=400, detail="Choose an image to upload.")
    if len(content) > MAX_PRODUCT_IMAGE_BYTES:
        raise HTTPException(status_code=400, detail="Product images must be 5 MB or smaller.")

    upload_dir = Path(__file__).resolve().parents[4] / "uploads" / "product_image"
    upload_dir.mkdir(parents=True, exist_ok=True)
    filename = f"{uuid4().hex}{extension}"
    (upload_dir / filename).write_bytes(content)
    return {"media_url": f"{str(request.base_url).rstrip('/')}/uploads/product_image/{filename}"}


@router.get("/categories")
def admin_list_categories(
    q: str | None = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    sort_by: str = "created_at",
    sort_order: str = "desc",
    field: str = "all",
    _: UserProfileResponse = Depends(require_roles(SystemRole.ADMIN_CATALOG.value, SystemRole.SUPER_ADMIN.value)),
    db: Session = Depends(get_db_session),
) -> dict[str, object]:
    return _catalog_page(
        Category,
        [Category.name, Category.slug, Category.description],
        q,
        page,
        page_size,
        sort_by,
        sort_order,
        db, field,
    )


@router.get("/brands")
def admin_list_brands(
    q: str | None = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    sort_by: str = "created_at",
    sort_order: str = "desc",
    field: str = "all",
    _: UserProfileResponse = Depends(require_roles(SystemRole.ADMIN_CATALOG.value, SystemRole.SUPER_ADMIN.value)),
    db: Session = Depends(get_db_session),
) -> dict[str, object]:
    return _catalog_page(
        Brand,
        [Brand.name, Brand.slug, Brand.description],
        q,
        page,
        page_size,
        sort_by,
        sort_order,
        db, field,
    )


@router.get("/attributes")
def admin_list_attributes(
    q: str | None = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    sort_by: str = "created_at",
    sort_order: str = "desc",
    _: UserProfileResponse = Depends(require_roles(SystemRole.ADMIN_CATALOG.value, SystemRole.SUPER_ADMIN.value)),
    db: Session = Depends(get_db_session),
) -> dict[str, object]:
    return _catalog_page(
        ProductAttribute,
        [
            ProductAttribute.name,
            ProductAttribute.slug,
            ProductAttribute.attribute_type,
            cast(ProductAttribute.values, String),
        ],
        q,
        page,
        page_size,
        sort_by,
        sort_order,
        db,
    )


@router.post("/attributes", response_model=ProductAttributeResponse, status_code=status.HTTP_201_CREATED)
def admin_create_attribute(
    payload: ProductAttributeCreateRequest,
    _: UserProfileResponse = Depends(require_roles(SystemRole.ADMIN_CATALOG.value, SystemRole.SUPER_ADMIN.value)),
    db: Session = Depends(get_db_session),
) -> ProductAttribute:
    attribute = ProductAttribute(**payload.model_dump())
    db.add(attribute)
    try:
        db.commit()
        db.refresh(attribute)
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=400, detail="Attribute slug already exists.") from exc
    return attribute


@router.put("/attributes/{attribute_id}", response_model=ProductAttributeResponse)
def admin_update_attribute(
    attribute_id: str,
    payload: ProductAttributeUpdateRequest,
    _: UserProfileResponse = Depends(require_roles(SystemRole.ADMIN_CATALOG.value, SystemRole.SUPER_ADMIN.value)),
    db: Session = Depends(get_db_session),
) -> ProductAttribute:
    attribute = db.get(ProductAttribute, attribute_id)
    if attribute is None:
        raise HTTPException(status_code=404, detail="Attribute not found.")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(attribute, key, value)
    try:
        db.commit()
        db.refresh(attribute)
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=400, detail="Attribute slug already exists.") from exc
    return attribute


@router.delete("/attributes/{attribute_id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete_attribute(
    attribute_id: str,
    _: UserProfileResponse = Depends(require_roles(SystemRole.ADMIN_CATALOG.value, SystemRole.SUPER_ADMIN.value)),
    db: Session = Depends(get_db_session),
) -> None:
    attribute = db.get(ProductAttribute, attribute_id)
    if attribute is None:
        raise HTTPException(status_code=404, detail="Attribute not found.")
    db.delete(attribute)
    db.commit()


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
