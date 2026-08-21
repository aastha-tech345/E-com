from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.modules.orders.application.seller_schemas import SellerOrderItemResponse
from app.modules.orders.domain.models import Order, OrderItem


def list_orders_for_user(db: Session, *, user_id: str) -> list[Order]:
    return list(
        db.scalars(
            select(Order)
            .options(selectinload(Order.items))
            .where(Order.user_id == user_id)
            .order_by(Order.created_at.desc())
        ).all()
    )


def get_order_for_user(db: Session, *, user_id: str, order_id: str) -> Order:
    order = db.scalar(
        select(Order)
        .options(selectinload(Order.items))
        .where(Order.id == order_id, Order.user_id == user_id)
    )
    if order is None:
        raise ValueError("Order not found.")
    return order


def list_order_items_for_seller(db: Session, *, seller_user_id: str) -> list[SellerOrderItemResponse]:
    rows = list(
        db.scalars(
            select(OrderItem)
            .options(selectinload(OrderItem.order))
            .join(Order, Order.id == OrderItem.order_id)
            .where(OrderItem.seller_id == seller_user_id)
            .order_by(Order.created_at.desc())
        ).all()
    )
    return [
        SellerOrderItemResponse(
            id=item.id,
            order_id=item.order_id,
            order_number=item.order.order_number,
            order_status=item.order.status,
            product_id=item.product_id,
            variant_id=item.variant_id,
            product_name=item.product_name,
            variant_name=item.variant_name,
            sku=item.sku,
            quantity=item.quantity,
            line_total=item.line_total,
            commission_amount=item.commission_amount,
            seller_payout_amount=item.seller_payout_amount,
            created_at=item.order.created_at,
        )
        for item in rows
    ]
