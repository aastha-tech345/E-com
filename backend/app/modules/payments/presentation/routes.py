from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db_session
from app.modules.identity.application.schemas import UserProfileResponse
from app.modules.identity.presentation.dependencies import get_current_user
from app.modules.orders.application.service import get_order_for_user
from app.modules.payments.application.schemas import PaymentResponse
from app.modules.payments.application.service import get_payment_for_order
from app.modules.payments.domain.models import Payment

router = APIRouter(prefix="/payments", tags=["payments"])


@router.get("/orders/{order_id}", response_model=PaymentResponse)
def payment_for_order(
    order_id: str,
    current_user: UserProfileResponse = Depends(get_current_user),
    db: Session = Depends(get_db_session),
) -> Payment:
    try:
        get_order_for_user(db, user_id=current_user.id, order_id=order_id)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc

    payment = get_payment_for_order(db, order_id=order_id)
    if payment is None:
        raise HTTPException(status_code=404, detail="Payment not found.")
    return payment
