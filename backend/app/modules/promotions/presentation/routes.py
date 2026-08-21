from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.database import get_db_session
from app.modules.identity.application.schemas import UserProfileResponse
from app.modules.identity.presentation.dependencies import require_roles
from app.modules.promotions.application.schemas import CouponCreateRequest, CouponResponse
from app.modules.promotions.application.service import create_coupon, list_coupons
from app.modules.promotions.domain.models import Coupon
from app.shared.enums.roles import SystemRole

router = APIRouter(prefix="/admin/coupons", tags=["promotions"])


@router.get("", response_model=list[CouponResponse])
def coupons(
    _: UserProfileResponse = Depends(require_roles(SystemRole.ADMIN_CATALOG.value, SystemRole.SUPER_ADMIN.value)),
    db: Session = Depends(get_db_session),
) -> list[Coupon]:
    return list_coupons(db)


@router.post("", response_model=CouponResponse, status_code=status.HTTP_201_CREATED)
def create(
    payload: CouponCreateRequest,
    _: UserProfileResponse = Depends(require_roles(SystemRole.ADMIN_CATALOG.value, SystemRole.SUPER_ADMIN.value)),
    db: Session = Depends(get_db_session),
) -> Coupon:
    try:
        return create_coupon(
            db,
            code=payload.code,
            description=payload.description,
            discount_type=payload.discount_type,
            amount=payload.amount,
        )
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=400, detail="Coupon code already exists.") from exc
