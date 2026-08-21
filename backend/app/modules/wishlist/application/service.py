from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modules.catalog.application.service import hydrate_product_read_model
from app.modules.catalog.domain.models import Product
from app.modules.wishlist.domain.models import Wishlist, WishlistItem


def get_or_create_wishlist(db: Session, *, user_id: str) -> Wishlist:
    wishlist = db.scalar(select(Wishlist).where(Wishlist.user_id == user_id))
    if wishlist is not None:
        return wishlist
    wishlist = Wishlist(user_id=user_id)
    db.add(wishlist)
    db.flush()
    return wishlist


def add_to_wishlist(db: Session, *, user_id: str, product_id: str) -> Wishlist:
    wishlist = get_or_create_wishlist(db, user_id=user_id)
    existing = db.scalar(
        select(WishlistItem).where(WishlistItem.wishlist_id == wishlist.id, WishlistItem.product_id == product_id)
    )
    if existing is None:
        db.add(WishlistItem(wishlist_id=wishlist.id, product_id=product_id))
    db.commit()
    return wishlist


def remove_from_wishlist(db: Session, *, user_id: str, product_id: str) -> Wishlist:
    wishlist = get_or_create_wishlist(db, user_id=user_id)
    existing = db.scalar(
        select(WishlistItem).where(WishlistItem.wishlist_id == wishlist.id, WishlistItem.product_id == product_id)
    )
    if existing is not None:
        db.delete(existing)
    db.commit()
    return wishlist


def list_wishlist_products(db: Session, *, user_id: str) -> list[Product]:
    wishlist = get_or_create_wishlist(db, user_id=user_id)
    rows = list(
        db.scalars(
            select(Product)
            .join(WishlistItem, WishlistItem.product_id == Product.id)
            .where(WishlistItem.wishlist_id == wishlist.id)
            .order_by(WishlistItem.created_at.desc())
        ).all()
    )
    return [hydrate_product_read_model(db, product) for product in rows]
