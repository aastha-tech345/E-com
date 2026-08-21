from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db_session
from app.modules.identity.application.schemas import UserProfileResponse
from app.modules.identity.presentation.dependencies import require_roles
from app.modules.pricing.application.schemas import PriceUpdateRequest
from app.modules.pricing.application.service import set_active_price
from app.shared.enums.roles import SystemRole

router = APIRouter(prefix="/admin/pricing", tags=["pricing"])


@router.post("/variants")
def update_variant_price(
    payload: PriceUpdateRequest,
    _: UserProfileResponse = Depends(require_roles(SystemRole.ADMIN_CATALOG.value, SystemRole.SUPER_ADMIN.value)),
    db: Session = Depends(get_db_session),
) -> dict[str, str]:
    price = set_active_price(db, variant_id=payload.variant_id, amount=payload.amount, currency=payload.currency)
    db.commit()
    return {"variant_id": price.variant_id, "amount": str(price.amount), "currency": price.currency}
