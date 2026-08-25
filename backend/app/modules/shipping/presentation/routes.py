from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db_session
from app.modules.identity.application.schemas import UserProfileResponse
from app.modules.identity.presentation.dependencies import get_current_user, require_roles
from app.modules.shipping.application.schemas import OrderItemShipmentUpdateRequest, ShipmentResponse, ShipmentUpdateRequest
from app.modules.shipping.application.service import get_shipment_for_user, update_order_item_status, update_shipment_status
from app.modules.shipping.domain.models import Shipment
from app.shared.enums.roles import SystemRole

router = APIRouter(prefix="/admin/shipping", tags=["shipping"])


@router.put("/items/{order_item_id}/status")
def update_order_item_shipping(
    order_item_id: str,
    payload: OrderItemShipmentUpdateRequest,
    _: UserProfileResponse = Depends(require_roles(SystemRole.ADMIN_CATALOG.value, SystemRole.SUPER_ADMIN.value)),
    db: Session = Depends(get_db_session),
) -> dict[str, str]:
    try:
        item = update_order_item_status(
            db,
            order_item_id=order_item_id,
            status=payload.status,
            tracking_number=payload.tracking_number,
            shipping_partner=payload.shipping_partner,
            estimated_delivery=payload.estimated_delivery,
            note=payload.note,
        )
        db.commit()
        return {"item_id": item.id, "item_number": item.item_number, "status": item.status}
    except ValueError as exc:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/status")
def update_shipping(
    payload: ShipmentUpdateRequest,
    _: UserProfileResponse = Depends(require_roles(SystemRole.ADMIN_CATALOG.value, SystemRole.SUPER_ADMIN.value)),
    db: Session = Depends(get_db_session),
) -> dict[str, str]:
    try:
        shipment = update_shipment_status(
            db,
            order_id=payload.order_id,
            status=payload.status,
            tracking_number=payload.tracking_number,
            note=payload.note,
        )
        db.commit()
        return {"order_id": payload.order_id, "status": shipment.status, "tracking_number": shipment.tracking_number}
    except ValueError as exc:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(exc)) from exc


customer_router = APIRouter(prefix="/shipping", tags=["shipping"])


@customer_router.get("/orders/{order_id}", response_model=ShipmentResponse)
def shipment_detail(
    order_id: str,
    current_user: UserProfileResponse = Depends(get_current_user),
    db: Session = Depends(get_db_session),
) -> Shipment:
    try:
        return get_shipment_for_user(db, user_id=current_user.id, order_id=order_id)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
