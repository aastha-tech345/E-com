from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class CouponCreateRequest(BaseModel):
    code: str = Field(min_length=3, max_length=40)
    description: str = Field(default="", max_length=255)
    discount_type: str = Field(pattern="^(flat|percent)$")
    amount: Decimal = Field(gt=0)


class CouponResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    code: str
    description: str
    discount_type: str
    amount: Decimal
    is_active: bool
