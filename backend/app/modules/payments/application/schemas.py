from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict


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
