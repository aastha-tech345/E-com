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
    product_image: str = ""  # First product media URL
    item_number: str
    status: str
    tracking_number: str = ""
    shipping_partner: str = ""
    estimated_delivery: datetime | None = None
    delivered_at: datetime | None = None


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
    payment_status: str
    payment_method: str


class OrderItemTrackingEventResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    status: str
    note: str
    created_at: datetime


class OrderItemTrackingResponse(BaseModel):
    item_id: str
    item_number: str
    order_id: str
    order_number: str
    product_name: str
    product_image: str = ""
    status: str
    tracking_number: str
    shipping_partner: str
    estimated_delivery: datetime | None
    shipping_name: str
    address_line1: str
    city: str
    state: str
    postal_code: str
    events: list[OrderItemTrackingEventResponse]
