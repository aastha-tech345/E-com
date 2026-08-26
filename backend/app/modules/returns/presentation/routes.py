from decimal import Decimal
from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, Depends, File, HTTPException, Request, UploadFile, status
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
from app.modules.orders.domain.models import OrderItem, Order
from app.modules.catalog.domain.models import Product
from app.shared.enums.roles import SystemRole

router = APIRouter(prefix="/returns", tags=["returns"])
admin_router = APIRouter(prefix="/admin/returns", tags=["returns"])


def _return_reference_payload(db: Session, request: ReturnRequest) -> dict[str, object]:
    order = db.get(Order, request.order_id)
    item = db.get(OrderItem, request.order_item_id)
    replacement = db.get(Product, request.replacement_product_id) if request.replacement_product_id else None
    return {
        "id": request.id,
        "order_id": request.order_id,
        "order_item_id": request.order_item_id,
        "user_id": request.user_id,
        "quantity": request.quantity,
        "reason": request.reason,
        "issue_reason": request.issue_reason,
        "proof_url": request.proof_url,
        "proof_type": request.proof_type,
        "replacement_product_id": request.replacement_product_id,
        "order_number": order.order_number if order is not None else None,
        "product_name": item.product_name if item is not None else None,
        "replacement_product_name": replacement.name if replacement is not None else None,
        "lifecycle_status": "open" if request.status in {"requested", "reviewing", "pending"} else "closed",
        "status": request.status,
        "created_at": request.created_at,
        "updated_at": request.updated_at,
    }


@router.post("", response_model=ReturnResponse, status_code=status.HTTP_201_CREATED)
def request_return(
    payload: ReturnRequestCreate,
    current_user: UserProfileResponse = Depends(get_current_user),
    db: Session = Depends(get_db_session),
) -> ReturnRequest:
    try:
        request = create_return_request(
            db,
            user_id=current_user.id,
            order_item_id=payload.order_item_id,
            quantity=payload.quantity,
            reason=payload.reason,
            issue_reason=payload.issue_reason,
            proof_url=payload.proof_url,
            proof_type=payload.proof_type,
            replacement_product_id=payload.replacement_product_id,
        )
        db.commit()
        db.refresh(request)
        return request
    except ValueError as exc:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/proof")
async def upload_return_proof(
    request: Request,
    file: UploadFile = File(...),
    _: UserProfileResponse = Depends(get_current_user),
) -> dict[str, str]:
    content_type = file.content_type or ""
    if not (content_type.startswith("image/") or content_type.startswith("video/")):
        raise HTTPException(status_code=400, detail="Please upload an image or video proof file.")

    suffix = Path(file.filename or "").suffix.lower()
    if suffix not in {".jpg", ".jpeg", ".png", ".webp", ".gif", ".mp4", ".mov", ".webm"}:
        raise HTTPException(status_code=400, detail="Supported proof formats: JPG, PNG, WEBP, GIF, MP4, MOV, WEBM.")

    upload_dir = Path(__file__).resolve().parents[4] / "uploads" / "return_proofs"
    upload_dir.mkdir(parents=True, exist_ok=True)
    filename = f"{uuid4().hex}{suffix}"
    path = upload_dir / filename
    contents = await file.read()
    path.write_bytes(contents)
    return {
        "proof_url": f"{str(request.base_url).rstrip('/')}/uploads/return_proofs/{filename}",
        "proof_type": "video" if content_type.startswith("video/") else "image",
    }


@router.get("", response_model=list[ReturnResponse])
def my_returns(
    current_user: UserProfileResponse = Depends(get_current_user),
    db: Session = Depends(get_db_session),
) -> list[dict[str, object]]:
    return [_return_reference_payload(db, request) for request in list_returns_for_user(db, user_id=current_user.id)]


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
) -> list[dict[str, object]]:
    return [_return_reference_payload(db, request) for request in list_all_returns(db)]
