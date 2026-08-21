from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db_session
from app.modules.identity.application.schemas import UserProfileResponse
from app.modules.identity.presentation.dependencies import require_roles
from app.modules.inventory.application.schemas import InventoryAdjustmentRequest, InventoryAdjustmentResponse
from app.modules.inventory.application.service import set_inventory_level
from app.shared.enums.roles import SystemRole

router = APIRouter(prefix="/admin/inventory", tags=["inventory"])


@router.post("/adjust", response_model=InventoryAdjustmentResponse)
def adjust_inventory(
    payload: InventoryAdjustmentRequest,
    _: UserProfileResponse = Depends(require_roles(SystemRole.ADMIN_CATALOG.value, SystemRole.SUPER_ADMIN.value)),
    db: Session = Depends(get_db_session),
) -> InventoryAdjustmentResponse:
    try:
        item = set_inventory_level(
            db,
            variant_id=payload.variant_id,
            on_hand=payload.on_hand,
            reason=payload.reason,
        )
        db.commit()
        db.refresh(item)
        return InventoryAdjustmentResponse(
            id=item.id,
            variant_id=item.variant_id,
            warehouse_code=item.warehouse_code,
            on_hand=item.on_hand,
            reserved=item.reserved,
            available=item.available,
        )
    except ValueError as exc:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(exc)) from exc
