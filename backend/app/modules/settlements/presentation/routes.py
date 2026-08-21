from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db_session
from app.modules.identity.application.schemas import UserProfileResponse
from app.modules.identity.presentation.dependencies import require_roles
from app.modules.settlements.application.schemas import SellerSettlementResponse, SettlementPayoutRequest
from app.modules.settlements.application.service import list_all_settlements, mark_settlement_paid
from app.modules.settlements.domain.models import SellerSettlement
from app.shared.enums.roles import SystemRole

router = APIRouter(prefix="/admin/settlements", tags=["settlements"])


@router.get("", response_model=list[SellerSettlementResponse])
def settlements(
    _: UserProfileResponse = Depends(require_roles(SystemRole.ADMIN_CATALOG.value, SystemRole.SUPER_ADMIN.value)),
    db: Session = Depends(get_db_session),
) -> list[SellerSettlement]:
    return list_all_settlements(db)


@router.post("/{settlement_id}/mark-paid", response_model=SellerSettlementResponse)
def settle_payout(
    settlement_id: str,
    payload: SettlementPayoutRequest,
    _: UserProfileResponse = Depends(require_roles(SystemRole.ADMIN_CATALOG.value, SystemRole.SUPER_ADMIN.value)),
    db: Session = Depends(get_db_session),
) -> SellerSettlement:
    try:
        return mark_settlement_paid(db, settlement_id=settlement_id, payout_reference=payload.payout_reference)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
