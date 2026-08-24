from decimal import Decimal

from pydantic import BaseModel, Field


class AddCartItemRequest(BaseModel):
    variant_id: str | None = None
    product_id: str | None = None
    quantity: int = Field(ge=1, le=20)


class UpdateCartItemRequest(BaseModel):
    quantity: int = Field(ge=0, le=20)


class CartLineResponse(BaseModel):
    id: str
    variant_id: str
    product_name: str
    variant_name: str
    sku: str
    quantity: int
    unit_price: Decimal
    currency: str
    line_total: Decimal
    available_quantity: int


class CartResponse(BaseModel):
    id: str
    currency: str
    total_items: int
    subtotal: Decimal
    items: list[CartLineResponse]
