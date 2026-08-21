from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.database import get_db_session
from app.modules.identity.application.schemas import UserProfileResponse
from app.modules.identity.presentation.dependencies import get_current_user
from app.modules.reviews.application.schemas import ReviewCreateRequest, ReviewResponse
from app.modules.reviews.application.service import create_review, list_reviews_for_product
from app.modules.reviews.domain.models import Review

router = APIRouter(prefix="/reviews", tags=["reviews"])


@router.get("/product/{product_id}", response_model=list[ReviewResponse])
def product_reviews(product_id: str, db: Session = Depends(get_db_session)) -> list[Review]:
    return list_reviews_for_product(db, product_id=product_id)


@router.post("", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
def review(
    payload: ReviewCreateRequest,
    current_user: UserProfileResponse = Depends(get_current_user),
    db: Session = Depends(get_db_session),
) -> Review:
    try:
        review_record = create_review(
            db,
            user_id=current_user.id,
            order_id=payload.order_id,
            product_id=payload.product_id,
            rating=payload.rating,
            title=payload.title,
            content=payload.content,
        )
        db.commit()
        db.refresh(review_record)
        return review_record
    except ValueError as exc:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=400, detail="You have already reviewed this product.") from exc
