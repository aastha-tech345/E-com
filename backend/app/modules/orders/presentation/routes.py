from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db_session
from app.modules.identity.application.schemas import UserProfileResponse
from app.modules.identity.presentation.dependencies import get_current_user
from app.modules.orders.application.schemas import OrderItemTrackingResponse, OrderResponse
from app.modules.orders.application.service import get_order_for_user, get_order_item_tracking_for_user, list_orders_for_user
from app.modules.orders.domain.models import Order

router = APIRouter(prefix="/orders", tags=["orders"])


@router.get("/items/{item_id}/tracking", response_model=OrderItemTrackingResponse)
def order_item_tracking(
    item_id: str,
    current_user: UserProfileResponse = Depends(get_current_user),
    db: Session = Depends(get_db_session),
) -> OrderItemTrackingResponse:
    try:
        return get_order_item_tracking_for_user(db, user_id=current_user.id, item_id=item_id)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.get("", response_model=list[OrderResponse])
def orders(
    current_user: UserProfileResponse = Depends(get_current_user),
    db: Session = Depends(get_db_session),
) -> list[Order]:
    return list_orders_for_user(db, user_id=current_user.id)


@router.get("/{order_id}", response_model=OrderResponse)
def order_detail(
    order_id: str,
    current_user: UserProfileResponse = Depends(get_current_user),
    db: Session = Depends(get_db_session),
) -> Order:
    try:
        return get_order_for_user(db, user_id=current_user.id, order_id=order_id)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
