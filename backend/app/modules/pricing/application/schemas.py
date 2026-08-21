from decimal import Decimal

from pydantic import BaseModel, Field


class PriceUpdateRequest(BaseModel):
    variant_id: str
    amount: Decimal = Field(gt=0)
    currency: str = Field(min_length=3, max_length=3, default="INR")
