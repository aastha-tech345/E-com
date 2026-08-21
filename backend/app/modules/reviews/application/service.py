from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modules.orders.domain.models import Order, OrderItem
from app.modules.reviews.domain.models import Review


def create_review(
    db: Session,
    *,
    user_id: str,
    order_id: str,
    product_id: str,
    rating: int,
    title: str,
    content: str,
) -> Review:
    order = db.scalar(select(Order).where(Order.id == order_id, Order.user_id == user_id))
    if order is None or order.status not in {"delivered", "completed", "returned", "partially_returned"}:
        raise ValueError("Reviews are only allowed for delivered orders.")
    order_item = db.scalar(
        select(OrderItem).where(OrderItem.order_id == order_id, OrderItem.product_id == product_id)
    )
    if order_item is None:
        raise ValueError("Product not found in the order.")

    review = Review(
        user_id=user_id,
        order_id=order_id,
        product_id=product_id,
        rating=rating,
        title=title,
        content=content,
    )
    db.add(review)
    return review


def list_reviews_for_product(db: Session, *, product_id: str) -> list[Review]:
    return list(
        db.scalars(select(Review).where(Review.product_id == product_id).order_by(Review.created_at.desc())).all()
    )
