from decimal import Decimal

from pydantic import BaseModel


class AnalyticsSummaryResponse(BaseModel):
    total_orders: int
    total_revenue: Decimal
    total_customers: int
    total_products: int
    total_reviews: int
    total_searches: int
    cached: bool = False
