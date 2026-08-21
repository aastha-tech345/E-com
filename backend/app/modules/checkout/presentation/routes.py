from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db_session
from app.modules.checkout.application.schemas import CheckoutRequest
from app.modules.checkout.application.service import place_order_from_cart
from app.modules.identity.application.schemas import UserProfileResponse
from app.modules.identity.presentation.dependencies import get_current_user
from app.modules.orders.application.schemas import OrderResponse
from app.modules.orders.domain.models import Order

router = APIRouter(prefix="/checkout", tags=["checkout"])


@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def checkout(
    payload: CheckoutRequest,
    current_user: UserProfileResponse = Depends(get_current_user),
    db: Session = Depends(get_db_session),
) -> Order:
    try:
        return place_order_from_cart(
            db,
            user_id=current_user.id,
            shipping_name=payload.shipping_name,
            address_line1=payload.address_line1,
            city=payload.city,
            state=payload.state,
            postal_code=payload.postal_code,
            payment_method=payload.payment_method,
            payment_reference=payload.payment_reference,
            idempotency_key=payload.idempotency_key,
            coupon_code=payload.coupon_code,
        )
    except ValueError as exc:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(exc)) from exc
