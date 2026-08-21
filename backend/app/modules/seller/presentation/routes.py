from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db_session
from app.modules.catalog.application.schemas import ProductCreateRequest, ProductResponse
from app.modules.catalog.application.service import create_product, hydrate_product_read_model, list_admin_products
from app.modules.catalog.domain.models import Product
from app.modules.identity.application.schemas import UserProfileResponse
from app.modules.identity.presentation.dependencies import require_roles
from app.modules.orders.application.seller_schemas import SellerOrderItemResponse
from app.modules.orders.application.service import list_order_items_for_seller
from app.modules.settlements.application.schemas import (
    SellerSettlementResponse,
    SellerSettlementSummaryResponse,
)
from app.modules.settlements.application.service import (
    get_seller_settlement_summary,
    list_settlements_for_seller,
)
from app.modules.settlements.domain.models import SellerSettlement
from app.shared.enums.roles import SystemRole

router = APIRouter(prefix="/seller", tags=["seller"])


@router.get("/orders", response_model=list[SellerOrderItemResponse])
def seller_orders(
    current_user: UserProfileResponse = Depends(require_roles(SystemRole.SELLER_OWNER.value)),
    db: Session = Depends(get_db_session),
) -> list[SellerOrderItemResponse]:
    return list_order_items_for_seller(db, seller_user_id=current_user.id)


@router.get("/settlements", response_model=list[SellerSettlementResponse])
def seller_settlements(
    current_user: UserProfileResponse = Depends(require_roles(SystemRole.SELLER_OWNER.value)),
    db: Session = Depends(get_db_session),
) -> list[SellerSettlement]:
    return list_settlements_for_seller(db, seller_user_id=current_user.id)


@router.get("/settlements/summary", response_model=SellerSettlementSummaryResponse)
def seller_settlement_summary(
    current_user: UserProfileResponse = Depends(require_roles(SystemRole.SELLER_OWNER.value)),
    db: Session = Depends(get_db_session),
) -> SellerSettlementSummaryResponse:
    summary = get_seller_settlement_summary(db, seller_user_id=current_user.id)
    return SellerSettlementSummaryResponse(
        pending_total=summary["pending_total"],
        paid_total=summary["paid_total"],
        settlement_count=summary["settlement_count"],
    )


@router.get("/products", response_model=list[ProductResponse])
def seller_products(
    current_user: UserProfileResponse = Depends(require_roles(SystemRole.SELLER_OWNER.value)),
    db: Session = Depends(get_db_session),
) -> list[Product]:
    products = [product for product in list_admin_products(db) if product.seller_id == current_user.id]
    return [hydrate_product_read_model(db, product) for product in products]


@router.post("/products", response_model=ProductResponse)
def seller_create_product(
    payload: ProductCreateRequest,
    current_user: UserProfileResponse = Depends(require_roles(SystemRole.SELLER_OWNER.value)),
    db: Session = Depends(get_db_session),
) -> Product:
    enriched_payload = payload.model_copy(update={"seller_id": current_user.id})
    return hydrate_product_read_model(db, create_product(db, enriched_payload))
