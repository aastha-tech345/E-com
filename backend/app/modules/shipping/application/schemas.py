from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ShipmentUpdateRequest(BaseModel):
    order_id: str
    status: str = Field(pattern="^(packed|shipped|delivered)$")
    tracking_number: str = Field(default="", max_length=80)
    note: str = Field(default="", max_length=255)


class TrackingEventResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    status: str
    note: str
    created_at: datetime


class ShipmentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    order_id: str
    status: str
    carrier: str
    tracking_number: str
    created_at: datetime
    updated_at: datetime
    events: list[TrackingEventResponse]
