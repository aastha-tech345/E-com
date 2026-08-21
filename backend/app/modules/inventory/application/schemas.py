from pydantic import BaseModel, Field


class InventoryAdjustmentRequest(BaseModel):
    variant_id: str
    on_hand: int = Field(ge=0)
    reason: str = Field(min_length=2, max_length=80)


class InventoryAdjustmentResponse(BaseModel):
    id: str
    variant_id: str
    warehouse_code: str
    on_hand: int
    reserved: int
    available: int
