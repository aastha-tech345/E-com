from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class OrderItemResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    product_id: str
    variant_id: str
    product_name: str
    variant_name: str
    sku: str
    seller_id: str | None
    quantity: int
    unit_price: Decimal
    line_total: Decimal
    commission_rate: Decimal
    commission_amount: Decimal
    seller_payout_amount: Decimal


class OrderResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    order_number: str
    status: str
    currency: str
    subtotal: Decimal
    shipping_name: str
    address_line1: str
    city: str
    state: str
    postal_code: str
    created_at: datetime
    items: list[OrderItemResponse]
