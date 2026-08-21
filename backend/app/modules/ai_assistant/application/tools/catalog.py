from __future__ import annotations

from sqlalchemy.orm import Session

from app.modules.ai_assistant.application.tool_registry import AssistantTool
from app.modules.ai_assistant.application.types import AssistantGraphState, ToolCallRecord
from app.modules.catalog.application.service import hydrate_product_read_model, list_products


class CatalogSearchTool(AssistantTool):
    name = "catalog.search_products"
    intent_names = ("product_search", "product_compare", "product_recommendation")

    def run(self, db: Session, state: AssistantGraphState) -> AssistantGraphState:
        matches = [
            hydrate_product_read_model(db, product)
            for product in list_products(db, query=state.prompt, published_only=True)[:6]
        ]
        state.products = matches
        state.tool_records.append(
            ToolCallRecord(
                tool_name=self.name,
                status="completed",
                detail=f"Retrieved {len(matches)} product matches.",
            )
        )
        return state
