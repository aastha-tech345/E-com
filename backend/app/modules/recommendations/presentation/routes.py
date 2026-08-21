from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db_session
from app.modules.catalog.application.schemas import ProductResponse
from app.modules.recommendations.application.schemas import RecommendationResponse
from app.modules.recommendations.application.service import list_recommendations

router = APIRouter(prefix="/recommendations", tags=["recommendations"])


@router.get("/{product_id}", response_model=RecommendationResponse)
def recommendations(product_id: str, db: Session = Depends(get_db_session)) -> RecommendationResponse:
    return RecommendationResponse(
        source_product_id=product_id,
        items=[ProductResponse.model_validate(item) for item in list_recommendations(db, product_id=product_id)],
    )
