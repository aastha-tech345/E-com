from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class SellerSettlementResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    seller_user_id: str | None
    seller_ref: str
    status: str
    total_amount: Decimal
    payout_reference: str
    paid_at: datetime | None
    created_at: datetime


class SellerSettlementSummaryResponse(BaseModel):
    pending_total: Decimal
    paid_total: Decimal
    settlement_count: int


class SettlementPayoutRequest(BaseModel):
    payout_reference: str = Field(min_length=3, max_length=80)
