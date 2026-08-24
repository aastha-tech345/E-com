from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class PaymentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    order_id: str
    provider: str
    method: str
    status: str
    amount: Decimal
    currency: str
    created_at: datetime


class StripeCheckoutItem(BaseModel):
    product_id: str
    name: str = Field(min_length=1, max_length=200)
    quantity: int = Field(ge=1, le=99)
    unit_amount: Decimal = Field(gt=0)
    image: str | None = None


class StripeCheckoutRequest(BaseModel):
    items: list[StripeCheckoutItem] = Field(min_length=1)
    customer_email: str | None = None
    shipping_name: str | None = Field(default=None, max_length=120)
    address_line1: str | None = Field(default=None, max_length=255)
    city: str | None = Field(default=None, max_length=120)
    state: str | None = Field(default=None, max_length=120)
    postal_code: str | None = Field(default=None, max_length=20)
    success_path: str = "/checkout/success"
    cancel_path: str = "/checkout/cancel"


class StripeCheckoutResponse(BaseModel):
    session_id: str
    checkout_url: str
