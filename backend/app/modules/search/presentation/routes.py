from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db_session
from app.core.rate_limit import build_rate_limiter
from app.modules.catalog.application.schemas import ProductResponse
from app.modules.identity.application.schemas import UserProfileResponse
from app.modules.identity.presentation.dependencies import get_optional_current_user
from app.modules.search.application.schemas import (
    PopularSearchesResponse,
    SearchResponse,
    SearchSuggestionsResponse,
)
from app.modules.search.application.service import (
    get_popular_search_terms_cached,
    get_search_suggestions,
    search_products,
)

router = APIRouter(prefix="/search", tags=["search"])


@router.get("/products", response_model=SearchResponse)
def search(
    q: str = Query(..., min_length=1),
    _: None = Depends(build_rate_limiter(scope="search-products", limit=settings.public_search_rate_limit)),
    current_user: UserProfileResponse | None = Depends(get_optional_current_user),
    db: Session = Depends(get_db_session),
) -> SearchResponse:
    user_id = current_user.id if current_user is not None else None
    products, log = search_products(db, query=q, user_id=user_id)
    return SearchResponse(
        query=q,
        results=[ProductResponse.model_validate(product) for product in products],
        logged_at=log.created_at,
    )


@router.get("/popular", response_model=PopularSearchesResponse)
def popular_searches(
    db: Session = Depends(get_db_session),
) -> PopularSearchesResponse:
    terms, cached = get_popular_search_terms_cached(db)
    return PopularSearchesResponse(terms=terms, cached=cached)


@router.get("/suggestions", response_model=SearchSuggestionsResponse)
def suggestions(
    q: str = Query(..., min_length=1),
    _: None = Depends(build_rate_limiter(scope="search-suggestions", limit=settings.public_search_rate_limit)),
    db: Session = Depends(get_db_session),
) -> SearchSuggestionsResponse:
    return SearchSuggestionsResponse(query=q, suggestions=get_search_suggestions(db, query=q))
