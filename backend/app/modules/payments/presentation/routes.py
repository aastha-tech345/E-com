from decimal import Decimal, ROUND_HALF_UP
import json

import stripe
from fastapi import APIRouter, Depends, Header, HTTPException, Request, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db_session
from app.modules.cart.application.service import mark_active_cart_items_purchased
from app.modules.checkout.application.service import create_pending_order_from_cart
from app.modules.identity.application.schemas import UserProfileResponse
from app.modules.identity.presentation.dependencies import get_current_user, get_optional_current_user
from app.modules.orders.domain.models import Order, OrderStatusHistory
from app.modules.orders.application.service import get_order_for_user
from app.modules.payments.application.schemas import (
    PaymentResponse,
    StripeCheckoutRequest,
    StripeCheckoutResponse,
)
from app.modules.payments.application.service import (
    capture_payment,
    create_stripe_checkout_record,
    create_pending_payment,
    get_payment_for_order,
    update_stripe_checkout_record_from_webhook,
)
from app.modules.payments.domain.models import Payment
from app.modules.payments.domain.models import StripeCheckoutSession

router = APIRouter(prefix="/payments", tags=["payments"])


def _frontend_url(path: str) -> str:
    if path.startswith(("http://", "https://")):
        return path
    normalized_path = path if path.startswith("/") else f"/{path}"
    return f"{settings.frontend_url.rstrip('/')}{normalized_path}"


def _to_smallest_currency_unit(amount: Decimal) -> int:
    return int((amount * Decimal("100")).quantize(Decimal("1"), rounding=ROUND_HALF_UP))


def _from_smallest_currency_unit(amount: int | None) -> Decimal:
    return ((Decimal(amount or 0) / Decimal("100")).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP))


def _capture_order_payment(
    db: Session,
    *,
    checkout_record: StripeCheckoutSession,
    payment_intent_id: str | None,
    amount_total: Decimal,
) -> None:
    if not checkout_record.order_id or not payment_intent_id:
        return

    payment = get_payment_for_order(db, order_id=checkout_record.order_id)
    if payment is not None:
        capture_payment(db, payment=payment, reference=payment_intent_id, amount=amount_total)

    order = db.get(Order, checkout_record.order_id)
    if order is not None and order.status != "confirmed":
        order.status = "confirmed"
        db.add(OrderStatusHistory(order_id=order.id, status="confirmed", note="Stripe payment captured"))

    db.commit()


def _load_checkout_session_for_payment_intent(payment_intent_id: str | None):
    if not payment_intent_id:
        return None
    stripe.api_key = settings.stripe_secret_key
    try:
        sessions = stripe.checkout.Session.list(payment_intent=payment_intent_id, limit=1)
    except stripe.StripeError:
        return None
    return sessions.data[0] if sessions.data else None


@router.get("/orders/{order_id}", response_model=PaymentResponse)
def payment_for_order(
    order_id: str,
    current_user: UserProfileResponse = Depends(get_current_user),
    db: Session = Depends(get_db_session),
) -> Payment:
    try:
        get_order_for_user(db, user_id=current_user.id, order_id=order_id)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc

    payment = get_payment_for_order(db, order_id=order_id)
    if payment is None:
        raise HTTPException(status_code=404, detail="Payment not found.")
    return payment


@router.post("/stripe/checkout-session", response_model=StripeCheckoutResponse, status_code=status.HTTP_201_CREATED)
def create_stripe_checkout_session(
    payload: StripeCheckoutRequest,
    current_user: UserProfileResponse | None = Depends(get_optional_current_user),
    db: Session = Depends(get_db_session),
) -> StripeCheckoutResponse:
    if not settings.stripe_secret_key:
        raise HTTPException(status_code=500, detail="Stripe secret key is not configured.")

    stripe.api_key = settings.stripe_secret_key
    currency = settings.stripe_currency.lower()
    line_items = []
    total_amount = Decimal("0")

    for item in payload.items:
        unit_amount = _to_smallest_currency_unit(item.unit_amount)
        total_amount += item.unit_amount * item.quantity
        product_data: dict[str, object] = {"name": item.name}
        if item.image:
            product_data["images"] = [item.image]
        line_items.append(
            {
                "price_data": {
                    "currency": currency,
                    "unit_amount": unit_amount,
                    "product_data": product_data,
                },
                "quantity": item.quantity,
            }
        )

    try:
        metadata = {
            "source": "store-stride-ui",
            "user_id": current_user.id if current_user else "",
            "item_count": str(sum(item.quantity for item in payload.items)),
            "total_amount": str(total_amount),
        }
        session = stripe.checkout.Session.create(
            mode="payment",
            payment_method_types=["card"],
            line_items=line_items,
            success_url=f"{_frontend_url(payload.success_path)}?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=_frontend_url(payload.cancel_path),
            customer_email=payload.customer_email,
            metadata=metadata,
        )
    except stripe.StripeError as exc:
        raise HTTPException(status_code=502, detail=f"Stripe checkout failed: {exc.user_message or str(exc)}") from exc

    if not session.url:
        raise HTTPException(status_code=502, detail="Stripe did not return a checkout URL.")

    order_id = None
    if current_user:
        try:
            order = create_pending_order_from_cart(
                db,
                user_id=current_user.id,
                shipping_name=payload.shipping_name or current_user.full_name,
                address_line1=payload.address_line1 or "Pending address",
                city=payload.city or "Pending",
                state=payload.state or "Pending",
                postal_code=payload.postal_code or "000000",
                idempotency_key=session.id,
            )
            order_id = order.id
            create_pending_payment(
                db,
                order_id=order.id,
                provider="stripe",
                method="card",
                amount=total_amount,
                currency=currency.upper(),
            )
            db.commit()
        except ValueError as exc:
            db.rollback()
            raise HTTPException(status_code=400, detail=str(exc)) from exc

    create_stripe_checkout_record(
        db,
        session_id=session.id,
        user_id=current_user.id if current_user else None,
        order_id=order_id,
        status=session.status or "open",
        payment_status=session.payment_status or "unpaid",
        amount_total=total_amount,
        currency=currency,
        customer_email=payload.customer_email,
        checkout_url=session.url,
        metadata_json=json.dumps(metadata),
    )

    return StripeCheckoutResponse(session_id=session.id, checkout_url=session.url)


@router.post("/stripe/webhook")
async def stripe_webhook(
    request: Request,
    stripe_signature: str | None = Header(default=None, alias="stripe-signature"),
    db: Session = Depends(get_db_session),
) -> JSONResponse:
    if not settings.stripe_webhook_secret:
        raise HTTPException(status_code=500, detail="Stripe webhook secret is not configured.")
    if not stripe_signature:
        raise HTTPException(status_code=400, detail="Missing Stripe signature.")

    payload = await request.body()
    try:
        event = stripe.Webhook.construct_event(
            payload=payload,
            sig_header=stripe_signature,
            secret=settings.stripe_webhook_secret,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail="Invalid Stripe webhook payload.") from exc
    except stripe.SignatureVerificationError as exc:
        raise HTTPException(status_code=400, detail="Invalid Stripe webhook signature.") from exc

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        metadata = session.get("metadata") or {}
        user_id = metadata.get("user_id")
        session_id = session.get("id")
        payment_intent_id = session.get("payment_intent")
        amount_total = _from_smallest_currency_unit(session.get("amount_total"))
        currency = (session.get("currency") or settings.stripe_currency).upper()
        customer_details = session.get("customer_details") or {}
        customer_email = session.get("customer_email") or customer_details.get("email")

        checkout_record = update_stripe_checkout_record_from_webhook(
            db,
            session_id=session_id,
            payment_intent_id=payment_intent_id,
            status=session.get("status") or "complete",
            payment_status=session.get("payment_status") or "paid",
            amount_total=amount_total,
            currency=currency,
            customer_email=customer_email,
            metadata_json=json.dumps(dict(metadata)),
        )
        print(
            "Stripe checkout session completed",
            {
                "session_id": session.get("id"),
                "user_id": user_id,
                "payment_status": session.get("payment_status"),
                "amount_total": session.get("amount_total"),
                "currency": session.get("currency"),
            },
        )

    if event["type"] == "payment_intent.succeeded":
        payment_intent = event["data"]["object"]
        payment_intent_id = payment_intent.get("id")
        checkout_session = _load_checkout_session_for_payment_intent(payment_intent_id)
        if checkout_session is not None:
            metadata = checkout_session.get("metadata") or {}
            session_id = checkout_session.get("id")
            user_id = metadata.get("user_id")
            amount_total = _from_smallest_currency_unit(payment_intent.get("amount_received"))
            currency = (payment_intent.get("currency") or settings.stripe_currency).upper()
            customer_details = checkout_session.get("customer_details") or {}
            customer_email = checkout_session.get("customer_email") or customer_details.get("email")

            checkout_record = update_stripe_checkout_record_from_webhook(
                db,
                session_id=session_id,
                payment_intent_id=payment_intent_id,
                status=checkout_session.get("status") or "complete",
                payment_status=checkout_session.get("payment_status") or "paid",
                amount_total=amount_total,
                currency=currency,
                customer_email=customer_email,
                metadata_json=json.dumps(dict(metadata)),
            )
            _capture_order_payment(
                db,
                checkout_record=checkout_record,
                payment_intent_id=payment_intent_id,
                amount_total=amount_total,
            )
            if user_id:
                mark_active_cart_items_purchased(
                    db,
                    user_id=user_id,
                    checkout_session_id=session_id,
                    order_id=checkout_record.order_id,
                )
            print(
                "Stripe payment intent succeeded",
                {
                    "payment_intent_id": payment_intent_id,
                    "session_id": session_id,
                    "user_id": user_id,
                    "amount_received": payment_intent.get("amount_received"),
                    "currency": payment_intent.get("currency"),
                },
            )

    return JSONResponse({"received": True})
