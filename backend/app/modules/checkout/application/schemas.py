from pydantic import BaseModel, Field


class CheckoutRequest(BaseModel):
    shipping_name: str = Field(min_length=2, max_length=120)
    address_line1: str = Field(min_length=5, max_length=255)
    city: str = Field(min_length=2, max_length=120)
    state: str = Field(min_length=2, max_length=120)
    postal_code: str = Field(min_length=4, max_length=20)
    payment_method: str = Field(default="card", min_length=2, max_length=40)
    payment_reference: str = Field(min_length=3, max_length=80)
    idempotency_key: str = Field(min_length=6, max_length=80)
    coupon_code: str | None = Field(default=None, min_length=3, max_length=40)
