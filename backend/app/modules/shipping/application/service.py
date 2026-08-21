from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.modules.notifications.application.service import create_notification
from app.modules.orders.domain.models import Order, OrderStatusHistory
from app.modules.shipping.domain.models import Shipment, TrackingEvent


def create_shipment(db: Session, *, order_id: str) -> Shipment:
    shipment = Shipment(order_id=order_id, status="pending", carrier="internal", tracking_number="")
    db.add(shipment)
    db.flush()
    db.add(TrackingEvent(shipment_id=shipment.id, status="pending", note="Shipment created"))
    return shipment


def update_shipment_status(
    db: Session,
    *,
    order_id: str,
    status: str,
    tracking_number: str,
    note: str,
) -> Shipment:
    shipment = db.scalar(select(Shipment).where(Shipment.order_id == order_id))
    if shipment is None:
        raise ValueError("Shipment not found.")
    order = db.scalar(select(Order).where(Order.id == order_id))
    if order is None:
        raise ValueError("Order not found.")

    shipment.status = status
    shipment.tracking_number = tracking_number
    db.add(TrackingEvent(shipment_id=shipment.id, status=status, note=note))

    order.status = status if status != "delivered" else "delivered"
    db.add(OrderStatusHistory(order_id=order.id, status=order.status, note=note))
    create_notification(
        db,
        user_id=order.user_id,
        title=f"Order {order.order_number} update",
        message=f"Shipment status changed to {status}.",
    )
    return shipment


def get_shipment_for_user(db: Session, *, user_id: str, order_id: str) -> Shipment:
    order = db.scalar(select(Order).where(Order.id == order_id, Order.user_id == user_id))
    if order is None:
        raise ValueError("Order not found.")
    db.expire_all()
    shipment = db.scalar(
        select(Shipment)
        .options(selectinload(Shipment.events))
        .where(Shipment.order_id == order_id)
    )
    if shipment is None:
        raise ValueError("Shipment not found.")
    return shipment
