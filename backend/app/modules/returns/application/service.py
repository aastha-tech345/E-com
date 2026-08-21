from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modules.background_jobs.application.service import enqueue_job
from app.modules.inventory.application.service import restock_inventory
from app.modules.notifications.application.service import create_notification
from app.modules.orders.domain.models import Order, OrderItem, OrderStatusHistory
from app.modules.payments.application.service import create_refund, get_payment_for_order
from app.modules.returns.domain.models import ReturnRequest


def create_return_request(
    db: Session,
    *,
    user_id: str,
    order_item_id: str,
    quantity: int,
    reason: str,
) -> ReturnRequest:
    item = db.scalar(select(OrderItem).join(Order).where(OrderItem.id == order_item_id, Order.user_id == user_id))
    if item is None:
        raise ValueError("Order item not found.")
    order = db.scalar(select(Order).where(Order.id == item.order_id))
    if order is None or order.status not in {"delivered", "returned", "partially_returned"}:
        raise ValueError("Returns are only available after delivery.")
    if quantity > item.quantity:
        raise ValueError("Return quantity exceeds ordered quantity.")

    request = ReturnRequest(
        order_id=item.order_id,
        order_item_id=order_item_id,
        user_id=user_id,
        quantity=quantity,
        reason=reason,
        status="requested",
    )
    db.add(request)
    create_notification(
        db,
        user_id=user_id,
        title=f"Return requested for {order.order_number}",
        message=f"Your return request for {item.product_name} was submitted.",
    )
    enqueue_job(db, job_type="analytics.refresh_summary")
    return request


def decide_return(db: Session, *, return_id: str, status: str) -> tuple[ReturnRequest, Decimal | None]:
    request = db.scalar(select(ReturnRequest).where(ReturnRequest.id == return_id))
    if request is None:
        raise ValueError("Return request not found.")
    if request.status != "requested":
        raise ValueError("Return request has already been processed.")

    request.status = status
    order = db.scalar(select(Order).where(Order.id == request.order_id))
    item = db.scalar(select(OrderItem).where(OrderItem.id == request.order_item_id))
    if order is None or item is None:
        raise ValueError("Associated order data not found.")

    refund_amount: Decimal | None = None
    if status == "approved":
        payment = get_payment_for_order(db, order_id=order.id)
        if payment is None:
            raise ValueError("Payment not found for order.")
        refund_amount = (item.unit_price * request.quantity).quantize(Decimal("0.01"))
        create_refund(
            db,
            payment_id=payment.id,
            order_id=order.id,
            amount=refund_amount,
            reason=request.reason,
        )
        restock_inventory(db, variant_id=item.variant_id, quantity=request.quantity)
        order.status = "partially_returned" if request.quantity < item.quantity else "returned"
        db.add(OrderStatusHistory(order_id=order.id, status=order.status, note="Return approved"))
        create_notification(
            db,
            user_id=request.user_id,
            title=f"Return approved for {order.order_number}",
            message=f"Your refund of INR {refund_amount} has been processed.",
        )
    else:
        create_notification(
            db,
            user_id=request.user_id,
            title=f"Return rejected for {order.order_number}",
            message="Your return request was reviewed and rejected.",
        )
    enqueue_job(db, job_type="analytics.refresh_summary")
    return request, refund_amount


def list_returns_for_user(db: Session, *, user_id: str) -> list[ReturnRequest]:
    return list(
        db.scalars(
            select(ReturnRequest)
            .where(ReturnRequest.user_id == user_id)
            .order_by(ReturnRequest.created_at.desc())
        ).all()
    )


def list_all_returns(db: Session) -> list[ReturnRequest]:
    return list(db.scalars(select(ReturnRequest).order_by(ReturnRequest.created_at.desc())).all())
