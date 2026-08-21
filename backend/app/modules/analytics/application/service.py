from decimal import Decimal

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.cache import cache_backend
from app.modules.analytics.application.schemas import AnalyticsSummaryResponse
from app.modules.catalog.domain.models import Product
from app.modules.identity.domain.models import User
from app.modules.orders.domain.models import Order
from app.modules.reviews.domain.models import Review
from app.modules.search.domain.models import SearchQuery


def analytics_summary(db: Session) -> AnalyticsSummaryResponse:
    total_orders = db.scalar(select(func.count()).select_from(Order)) or 0
    total_revenue = db.scalar(select(func.coalesce(func.sum(Order.subtotal), 0)).select_from(Order)) or Decimal("0.00")
    total_customers = db.scalar(select(func.count()).select_from(User)) or 0
    total_products = db.scalar(select(func.count()).select_from(Product)) or 0
    total_reviews = db.scalar(select(func.count()).select_from(Review)) or 0
    total_searches = db.scalar(select(func.count()).select_from(SearchQuery)) or 0
    return AnalyticsSummaryResponse(
        total_orders=total_orders,
        total_revenue=Decimal(str(total_revenue)),
        total_customers=total_customers,
        total_products=total_products,
        total_reviews=total_reviews,
        total_searches=total_searches,
    )


def analytics_summary_cached(db: Session) -> AnalyticsSummaryResponse:
    cached = cache_backend.get("analytics:summary")
    if cached is not None:
        payload = dict(cached)
        payload["cached"] = True
        return AnalyticsSummaryResponse(**payload)
    summary = analytics_summary(db)
    cache_backend.set("analytics:summary", summary.model_dump())
    return summary
