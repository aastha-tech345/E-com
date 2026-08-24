from datetime import datetime, timezone
from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modules.payments.domain.models import Payment, PaymentTransaction, Refund, StripeCheckoutSession


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


def create_pending_payment(
    db: Session,
    *,
    order_id: str,
    provider: str,
    method: str,
    amount: Decimal,
    currency: str,
) -> Payment:
    existing = db.scalar(select(Payment).where(Payment.order_id == order_id, Payment.provider == provider))
    if existing is not None:
        return existing

    payment = Payment(
        order_id=order_id,
        provider=provider,
        method=method,
        status="pending",
        amount=amount,
        currency=currency,
    )
    db.add(payment)
    db.flush()
    return payment


def capture_payment(
    db: Session,
    *,
    payment: Payment,
    reference: str,
    amount: Decimal,
) -> Payment:
    transaction = db.scalar(select(PaymentTransaction).where(PaymentTransaction.reference == reference))
    payment.status = "captured"
    payment.amount = amount
    if transaction is None:
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


def create_stripe_checkout_record(
    db: Session,
    *,
    session_id: str,
    user_id: str | None,
    order_id: str | None,
    status: str,
    payment_status: str,
    amount_total: Decimal,
    currency: str,
    customer_email: str | None,
    checkout_url: str,
    metadata_json: str,
) -> StripeCheckoutSession:
    existing = db.scalar(select(StripeCheckoutSession).where(StripeCheckoutSession.session_id == session_id))
    if existing is not None:
        return existing

    record = StripeCheckoutSession(
        session_id=session_id,
        user_id=user_id,
        order_id=order_id,
        status=status,
        payment_status=payment_status,
        amount_total=amount_total,
        currency=currency.upper(),
        customer_email=customer_email,
        checkout_url=checkout_url,
        metadata_json=metadata_json,
    )
    db.add(record)
    db.commit()
    return record


def update_stripe_checkout_record_from_webhook(
    db: Session,
    *,
    session_id: str,
    payment_intent_id: str | None,
    status: str,
    payment_status: str,
    amount_total: Decimal,
    currency: str,
    customer_email: str | None,
    metadata_json: str,
) -> StripeCheckoutSession:
    record = db.scalar(select(StripeCheckoutSession).where(StripeCheckoutSession.session_id == session_id))
    if record is None:
        record = StripeCheckoutSession(
            session_id=session_id,
            amount_total=amount_total,
            currency=currency.upper(),
        )
        db.add(record)

    record.payment_intent_id = payment_intent_id
    record.status = status
    record.payment_status = payment_status
    record.amount_total = amount_total
    record.currency = currency.upper()
    record.customer_email = customer_email
    record.metadata_json = metadata_json
    if payment_status == "paid" and record.paid_at is None:
        record.paid_at = datetime.now(timezone.utc)

    db.commit()
    return record


def create_refund(db: Session, *, payment_id: str, order_id: str, amount: Decimal, reason: str) -> Refund:
    refund = Refund(payment_id=payment_id, order_id=order_id, amount=amount, status="processed", reason=reason)
    db.add(refund)
    return refund
