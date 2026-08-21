from pydantic import BaseModel

from app.modules.catalog.application.schemas import ProductResponse


class RecommendationResponse(BaseModel):
    source_product_id: str
    items: list[ProductResponse]
