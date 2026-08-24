from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db_session
from app.modules.cart.application.schemas import AddCartItemRequest, CartResponse, UpdateCartItemRequest
from app.modules.cart.application.service import (
    add_item_to_cart,
    build_cart_response,
    clear_cart,
    get_cart,
    update_cart_item,
)
from app.modules.catalog.domain.models import ProductVariant
from sqlalchemy import select
from app.modules.identity.application.schemas import UserProfileResponse
from app.modules.identity.presentation.dependencies import get_current_user

router = APIRouter(prefix="/cart", tags=["cart"])


@router.get("", response_model=CartResponse)
def current_cart(
    current_user: UserProfileResponse = Depends(get_current_user),
    db: Session = Depends(get_db_session),
) -> CartResponse:
    return build_cart_response(db, cart=get_cart(db, user_id=current_user.id))


@router.post("/items", response_model=CartResponse, status_code=status.HTTP_201_CREATED)
def add_cart_item(
    payload: AddCartItemRequest,
    current_user: UserProfileResponse = Depends(get_current_user),
    db: Session = Depends(get_db_session),
) -> CartResponse:
    try:
        variant_id = payload.variant_id
        if not variant_id and payload.product_id:
            variant_id = db.scalar(
                select(ProductVariant.id).where(
                    ProductVariant.product_id == payload.product_id,
                    ProductVariant.is_default.is_(True),
                )
            )
        if not variant_id:
            raise ValueError("A product or variant is required.")
        return build_cart_response(
            db,
            cart=add_item_to_cart(
                db,
                user_id=current_user.id,
                variant_id=variant_id,
                quantity=payload.quantity,
            ),
        )
    except ValueError as exc:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.put("/items/{variant_id}", response_model=CartResponse)
def update_cart_line(
    variant_id: str,
    payload: UpdateCartItemRequest,
    current_user: UserProfileResponse = Depends(get_current_user),
    db: Session = Depends(get_db_session),
) -> CartResponse:
    try:
        return build_cart_response(
            db,
            cart=update_cart_item(db, user_id=current_user.id, variant_id=variant_id, quantity=payload.quantity),
        )
    except ValueError as exc:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.delete("", status_code=status.HTTP_204_NO_CONTENT)
def clear_current_cart(
    current_user: UserProfileResponse = Depends(get_current_user),
    db: Session = Depends(get_db_session),
) -> None:
    clear_cart(db, user_id=current_user.id)
