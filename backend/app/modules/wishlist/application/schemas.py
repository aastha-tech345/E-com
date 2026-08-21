from pydantic import BaseModel

from app.modules.catalog.application.schemas import ProductResponse


class WishlistMutationRequest(BaseModel):
    product_id: str


class WishlistResponse(BaseModel):
    items: list[ProductResponse]
