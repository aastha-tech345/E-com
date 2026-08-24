from decimal import Decimal, ROUND_HALF_UP

import stripe
from fastapi import APIRouter, Depends, Header, HTTPException, Request, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db_session
from app.modules.identity.application.schemas import UserProfileResponse
from app.modules.identity.presentation.dependencies import get_current_user
from app.modules.orders.application.service import get_order_for_user
from app.modules.payments.application.schemas import (
    PaymentResponse,
    StripeCheckoutRequest,
    StripeCheckoutResponse,
)
from app.modules.payments.application.service import get_payment_for_order
from app.modules.payments.domain.models import Payment

router = APIRouter(prefix="/payments", tags=["payments"])


def _frontend_url(path: str) -> str:
    if path.startswith(("http://", "https://")):
        return path
    normalized_path = path if path.startswith("/") else f"/{path}"
    return f"{settings.frontend_url.rstrip('/')}{normalized_path}"


def _to_smallest_currency_unit(amount: Decimal) -> int:
    return int((amount * Decimal("100")).quantize(Decimal("1"), rounding=ROUND_HALF_UP))


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
def create_stripe_checkout_session(payload: StripeCheckoutRequest) -> StripeCheckoutResponse:
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
        session = stripe.checkout.Session.create(
            mode="payment",
            payment_method_types=["card"],
            line_items=line_items,
            success_url=f"{_frontend_url(payload.success_path)}?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=_frontend_url(payload.cancel_path),
            customer_email=payload.customer_email,
            metadata={
                "source": "store-stride-ui",
                "item_count": str(sum(item.quantity for item in payload.items)),
                "total_amount": str(total_amount),
            },
        )
    except stripe.StripeError as exc:
        raise HTTPException(status_code=502, detail=f"Stripe checkout failed: {exc.user_message or str(exc)}") from exc

    if not session.url:
        raise HTTPException(status_code=502, detail="Stripe did not return a checkout URL.")

    return StripeCheckoutResponse(session_id=session.id, checkout_url=session.url)


@router.post("/stripe/webhook")
async def stripe_webhook(
    request: Request,
    stripe_signature: str | None = Header(default=None, alias="stripe-signature"),
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
        print(
            "Stripe checkout completed",
            {
                "session_id": session.get("id"),
                "payment_status": session.get("payment_status"),
                "amount_total": session.get("amount_total"),
                "currency": session.get("currency"),
            },
        )

    return JSONResponse({"received": True})
