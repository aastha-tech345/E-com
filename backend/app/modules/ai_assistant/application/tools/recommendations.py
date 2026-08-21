from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modules.ai_assistant.application.tool_registry import AssistantTool
from app.modules.ai_assistant.application.types import AssistantGraphState, ToolCallRecord
from app.modules.catalog.domain.models import Product
from app.modules.recommendations.application.service import list_recommendations


class RecommendationTool(AssistantTool):
    name = "recommendations.related_products"
    intent_names = ("product_recommendation", "product_compare")

    def run(self, db: Session, state: AssistantGraphState) -> AssistantGraphState:
        source = db.scalar(
            select(Product).where(Product.is_published.is_(True)).order_by(Product.created_at.desc())
        )
        if source is None:
            state.tool_records.append(
                ToolCallRecord(tool_name=self.name, status="skipped", detail="No source product available.")
            )
            return state

        recommendations = list_recommendations(db, product_id=source.id)[:4]
        if not state.products:
            state.products = recommendations
        state.metadata["recommendation_source_product_id"] = source.id
        state.tool_records.append(
            ToolCallRecord(
                tool_name=self.name,
                status="completed",
                detail=f"Loaded {len(recommendations)} related products.",
            )
        )
        return state
