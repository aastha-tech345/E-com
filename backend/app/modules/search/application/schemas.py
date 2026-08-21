from datetime import datetime

from pydantic import BaseModel

from app.modules.catalog.application.schemas import ProductResponse


class SearchResponse(BaseModel):
    query: str
    results: list[ProductResponse]
    logged_at: datetime | None = None


class PopularSearchesResponse(BaseModel):
    terms: list[str]
    cached: bool = False


class SearchSuggestionsResponse(BaseModel):
    query: str
    suggestions: list[str]
