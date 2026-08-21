from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db_session
from app.modules.catalog.application.schemas import ProductResponse
from app.modules.identity.application.schemas import UserProfileResponse
from app.modules.identity.presentation.dependencies import get_current_user
from app.modules.wishlist.application.schemas import WishlistMutationRequest, WishlistResponse
from app.modules.wishlist.application.service import add_to_wishlist, list_wishlist_products, remove_from_wishlist

router = APIRouter(prefix="/wishlist", tags=["wishlist"])


@router.get("", response_model=WishlistResponse)
def wishlist(
    current_user: UserProfileResponse = Depends(get_current_user),
    db: Session = Depends(get_db_session),
) -> WishlistResponse:
    products = list_wishlist_products(db, user_id=current_user.id)
    return WishlistResponse(items=[ProductResponse.model_validate(item) for item in products])


@router.post("", response_model=WishlistResponse)
def add_item(
    payload: WishlistMutationRequest,
    current_user: UserProfileResponse = Depends(get_current_user),
    db: Session = Depends(get_db_session),
) -> WishlistResponse:
    add_to_wishlist(db, user_id=current_user.id, product_id=payload.product_id)
    products = list_wishlist_products(db, user_id=current_user.id)
    return WishlistResponse(items=[ProductResponse.model_validate(item) for item in products])


@router.delete("", response_model=WishlistResponse)
def remove_item(
    payload: WishlistMutationRequest,
    current_user: UserProfileResponse = Depends(get_current_user),
    db: Session = Depends(get_db_session),
) -> WishlistResponse:
    remove_from_wishlist(db, user_id=current_user.id, product_id=payload.product_id)
    products = list_wishlist_products(db, user_id=current_user.id)
    return WishlistResponse(items=[ProductResponse.model_validate(item) for item in products])
