from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.modules.orders.application.schemas import OrderItemTrackingResponse
from app.modules.orders.application.seller_schemas import SellerOrderItemResponse
from app.modules.orders.domain.models import Order, OrderItem


def list_orders_for_user(db: Session, *, user_id: str) -> list[Order]:
    orders = list(
        db.scalars(
            select(Order)
            .options(
                selectinload(Order.items).selectinload(OrderItem.product),
                selectinload(Order.items).selectinload(OrderItem.status_history),
            )
            .where(Order.user_id == user_id)
            .order_by(Order.created_at.desc())
        ).all()
    )
    return _enrich_order_items_with_media(db, orders)


def get_order_for_user(db: Session, *, user_id: str, order_id: str) -> Order:
    order = db.scalar(
            select(Order)
            .options(
                selectinload(Order.items).selectinload(OrderItem.product),
                selectinload(Order.items).selectinload(OrderItem.status_history),
        )
        .where(Order.id == order_id, Order.user_id == user_id)
    )
    if order is None:
        raise ValueError("Order not found.")
    return _enrich_order_items_with_media(db, [order])[0] if order else order


def get_order_item_tracking_for_user(db: Session, *, user_id: str, item_id: str) -> OrderItemTrackingResponse:
    item = db.scalar(
        select(OrderItem)
        .options(selectinload(OrderItem.order), selectinload(OrderItem.status_history))
        .join(Order, Order.id == OrderItem.order_id)
        .where(OrderItem.id == item_id, Order.user_id == user_id)
    )
    if item is None:
        raise ValueError("Order item not found.")

    order = item.order
    from app.modules.catalog.domain.models import ProductMedia

    media = db.scalar(
        select(ProductMedia)
        .where(ProductMedia.product_id == item.product_id)
        .order_by(ProductMedia.sort_order)
    )
    return OrderItemTrackingResponse(
        item_id=item.id,
        item_number=item.item_number,
        order_id=order.id,
        order_number=order.order_number,
        product_name=item.product_name,
        product_image=media.media_url if media else item.product_image,
        status=item.status,
        tracking_number=item.tracking_number,
        shipping_partner=item.shipping_partner,
        estimated_delivery=item.estimated_delivery,
        shipping_name=order.shipping_name,
        address_line1=order.address_line1,
        city=order.city,
        state=order.state,
        postal_code=order.postal_code,
        events=sorted(item.status_history, key=lambda event: event.created_at),
    )


def _enrich_order_items_with_media(db: Session, orders: list[Order]) -> list[Order]:
    """Enrich order items with product media URLs"""
    from app.modules.catalog.domain.models import ProductMedia

    for order in orders:
        for item in order.items:
            # Fetch the first media for this product
            media = db.scalar(
                select(ProductMedia)
                .where(ProductMedia.product_id == item.product_id)
                .order_by(ProductMedia.sort_order)
            )
            item.product_image = media.media_url if media else ""
    return orders


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
