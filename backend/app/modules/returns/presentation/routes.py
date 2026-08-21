from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db_session
from app.modules.identity.application.schemas import UserProfileResponse
from app.modules.identity.presentation.dependencies import get_current_user, require_roles
from app.modules.returns.application.schemas import ReturnDecisionRequest, ReturnRequestCreate, ReturnResponse
from app.modules.returns.application.service import (
    create_return_request,
    decide_return,
    list_all_returns,
    list_returns_for_user,
)
from app.modules.returns.domain.models import ReturnRequest
from app.shared.enums.roles import SystemRole

router = APIRouter(prefix="/returns", tags=["returns"])
admin_router = APIRouter(prefix="/admin/returns", tags=["returns"])


@router.post("", response_model=ReturnResponse, status_code=status.HTTP_201_CREATED)
def request_return(
    payload: ReturnRequestCreate,
    current_user: UserProfileResponse = Depends(get_current_user),
    db: Session = Depends(get_db_session),
) -> ReturnRequest:
    try:
        return create_return_request(
            db,
            user_id=current_user.id,
            order_item_id=payload.order_item_id,
            quantity=payload.quantity,
            reason=payload.reason,
        )
    except ValueError as exc:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("", response_model=list[ReturnResponse])
def my_returns(
    current_user: UserProfileResponse = Depends(get_current_user),
    db: Session = Depends(get_db_session),
) -> list[ReturnRequest]:
    return list_returns_for_user(db, user_id=current_user.id)


@router.post("/{return_id}/decision")
def decision(
    return_id: str,
    payload: ReturnDecisionRequest,
    _: UserProfileResponse = Depends(require_roles(SystemRole.ADMIN_CATALOG.value, SystemRole.SUPER_ADMIN.value)),
    db: Session = Depends(get_db_session),
) -> dict[str, str]:
    try:
        request, amount = decide_return(db, return_id=return_id, status=payload.status)
        db.commit()
        return {
            "return_id": request.id,
            "status": request.status,
            "refund_amount": str(amount or Decimal("0.00")),
        }
    except ValueError as exc:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@admin_router.get("", response_model=list[ReturnResponse])
def admin_returns(
    _: UserProfileResponse = Depends(require_roles(SystemRole.ADMIN_CATALOG.value, SystemRole.SUPER_ADMIN.value)),
    db: Session = Depends(get_db_session),
) -> list[ReturnRequest]:
    return list_all_returns(db)
