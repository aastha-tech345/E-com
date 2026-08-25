from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, Field


class ReturnRequestCreate(BaseModel):
    order_item_id: str
    quantity: int = Field(ge=1)
    reason: str = Field(min_length=3, max_length=120)
    issue_reason: str = Field(default="", max_length=160)
    proof_url: str = Field(default="", max_length=500)
    proof_type: str = Field(default="", max_length=40)


class ReturnDecisionRequest(BaseModel):
    status: str = Field(pattern="^(approved|rejected)$")


class ReturnResponse(BaseModel):
    id: str
    order_id: str
    order_item_id: str
    user_id: str
    quantity: int
    reason: str
    issue_reason: str = ""
    proof_url: str = ""
    proof_type: str = ""
    status: str
    created_at: datetime
    updated_at: datetime


class RefundResponse(BaseModel):
    id: str
    amount: Decimal
    status: str
    reason: str
