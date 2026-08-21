from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modules.payments.domain.models import Payment, PaymentTransaction, Refund


def create_captured_payment(
    db: Session,
    *,
    order_id: str,
    provider: str,
    method: str,
    amount: Decimal,
    currency: str,
    reference: str,
) -> Payment:
    transaction = db.scalar(select(PaymentTransaction).where(PaymentTransaction.reference == reference))
    if transaction is not None:
        raise ValueError("Payment reference has already been used.")

    payment = Payment(
        order_id=order_id,
        provider=provider,
        method=method,
        status="captured",
        amount=amount,
        currency=currency,
    )
    db.add(payment)
    db.flush()
    db.add(
        PaymentTransaction(
            payment_id=payment.id,
            kind="capture",
            status="succeeded",
            reference=reference,
            amount=amount,
        )
    )
    return payment


def get_payment_for_order(db: Session, *, order_id: str) -> Payment | None:
    return db.scalar(select(Payment).where(Payment.order_id == order_id))


def create_refund(db: Session, *, payment_id: str, order_id: str, amount: Decimal, reason: str) -> Refund:
    refund = Refund(payment_id=payment_id, order_id=order_id, amount=amount, status="processed", reason=reason)
    db.add(refund)
    return refund
