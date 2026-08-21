from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel


class SellerOrderItemResponse(BaseModel):
    id: str
    order_id: str
    order_number: str
    order_status: str
    product_id: str
    variant_id: str
    product_name: str
    variant_name: str
    sku: str
    quantity: int
    line_total: Decimal
    commission_amount: Decimal
    seller_payout_amount: Decimal
    created_at: datetime
