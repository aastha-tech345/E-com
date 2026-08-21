from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modules.catalog.application.service import hydrate_product_read_model
from app.modules.catalog.domain.models import Product
from app.modules.recommendations.domain.models import ProductRecommendation


def list_recommendations(db: Session, *, product_id: str) -> list[Product]:
    explicit = list(
        db.scalars(
            select(Product)
            .join(ProductRecommendation, ProductRecommendation.recommended_product_id == Product.id)
            .where(ProductRecommendation.source_product_id == product_id)
            .order_by(ProductRecommendation.score.desc())
        ).all()
    )
    if explicit:
        return [hydrate_product_read_model(db, product) for product in explicit]

    source = db.scalar(select(Product).where(Product.id == product_id))
    if source is None:
        return []
    fallback = list(
        db.scalars(
            select(Product)
            .where(Product.category_id == source.category_id, Product.id != source.id, Product.is_published.is_(True))
            .limit(4)
        ).all()
    )
    return [hydrate_product_read_model(db, product) for product in fallback]
