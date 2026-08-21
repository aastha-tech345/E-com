from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ReviewCreateRequest(BaseModel):
    order_id: str
    product_id: str
    rating: int = Field(ge=1, le=5)
    title: str = Field(min_length=2, max_length=120)
    content: str = Field(min_length=5, max_length=2000)


class ReviewResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    user_id: str
    order_id: str
    product_id: str
    rating: int
    title: str
    content: str
    created_at: datetime
