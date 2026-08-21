from __future__ import annotations

from sqlalchemy.orm import Session

from app.core.cache import cache_backend
from app.core.config import settings
from app.modules.ai_assistant.application.graph import AssistantGraph
from app.modules.ai_assistant.application.tool_registry import ToolRegistry
from app.modules.ai_assistant.application.tools import (
    CartSnapshotTool,
    CatalogSearchTool,
    NotificationSummaryTool,
    OrderLookupTool,
    PopularSearchesTool,
    RecommendationTool,
    ReturnPolicyTool,
    SearchSuggestionsTool,
    ShipmentStatusTool,
)
from app.modules.ai_assistant.application.types import AssistantContext, AssistantGraphState, ToolCallRecord
from app.modules.ai_assistant.infrastructure.llm_client import get_llm_client


def build_tool_registry() -> ToolRegistry:
    return ToolRegistry(
        tools=(
            CatalogSearchTool(),
            SearchSuggestionsTool(),
            PopularSearchesTool(),
            RecommendationTool(),
            CartSnapshotTool(),
            OrderLookupTool(),
            ShipmentStatusTool(),
            ReturnPolicyTool(),
            NotificationSummaryTool(),
        )
    )


def run_assistant_orchestrator(
    db: Session,
    *,
    prompt: str,
    user_id: str | None,
    conversation_id: str | None,
) -> AssistantGraphState:
    cache_key = f"assistant:prompt:{user_id or 'anonymous'}:{prompt.strip().lower()}"
    cached = cache_backend.get(cache_key)
    if isinstance(cached, dict) and cached.get("answer") and cached.get("product_ids"):
        state = AssistantGraphState(
            prompt=prompt,
            context=AssistantContext(user_id=user_id, conversation_id=conversation_id),
        )
        state.answer = str(cached["answer"])
        state.intent = str(cached.get("intent", "product_search"))
        state.metadata["cached"] = True
        state.metadata["cached_product_ids"] = list(cached["product_ids"])
        if isinstance(cached.get("metadata"), dict):
            state.metadata.update(cached["metadata"])
        for tool_name in cached.get("used_tools", []):
            state.tool_records.append(
                ToolCallRecord(tool_name=str(tool_name), status="completed", detail="Loaded from cache.")
            )
        return state

    state = AssistantGraphState(
        prompt=prompt,
        context=AssistantContext(user_id=user_id, conversation_id=conversation_id),
    )
    graph = AssistantGraph(tool_registry=build_tool_registry(), llm_client=get_llm_client())
    result = graph.run(db, state)
    cache_backend.set(
        cache_key,
        {
            "answer": result.answer,
            "product_ids": [product.id for product in result.products],
            "intent": result.intent,
            "metadata": result.metadata,
            "used_tools": [record.tool_name for record in result.tool_records if record.status == "completed"],
        },
        ttl_seconds=settings.ai_cache_ttl_seconds,
    )
    return result
