from __future__ import annotations

from sqlalchemy.orm import Session

from app.core.cache import cache_backend
from app.core.config import settings
from app.modules.ai_assistant.application.graph import AssistantGraph, classify_intent
from app.modules.ai_assistant.application.tool_registry import ToolRegistry
from app.modules.ai_assistant.application.tools import (
    CartSnapshotTool,
    CatalogSearchTool,
    LangChainSemanticSearchTool,
    NotificationSummaryTool,
    OrderLookupTool,
    PopularSearchesTool,
    RecommendationTool,
    ReturnPolicyTool,
    ReturnWorkflowTool,
    SearchSuggestionsTool,
    ShipmentStatusTool,
)
from app.modules.ai_assistant.application.types import AssistantContext, AssistantGraphState, ToolCallRecord
from app.modules.ai_assistant.infrastructure.llm_client import get_llm_client


def build_tool_registry() -> ToolRegistry:
    return ToolRegistry(
        tools=(
            LangChainSemanticSearchTool(),  # Use LangChain semantic search
            CatalogSearchTool(),
            SearchSuggestionsTool(),
            PopularSearchesTool(),
            RecommendationTool(),
            CartSnapshotTool(),
            OrderLookupTool(),
            ShipmentStatusTool(),
            ReturnPolicyTool(),
            ReturnWorkflowTool(),
            NotificationSummaryTool(),
        )
    )


def run_assistant_orchestrator(
    db: Session,
    *,
    prompt: str,
    user_id: str | None,
    conversation_id: str | None,
    conversation_summary: str = "",
) -> AssistantGraphState:
    intent = classify_intent(prompt)
    cache_key = f"assistant:v3:prompt:{user_id or 'anonymous'}:{prompt.strip().lower()}"
    cached = cache_backend.get(cache_key)
    cacheable_intents = {"product_search", "product_compare", "product_recommendation", "policy_help"}
    if intent in cacheable_intents and isinstance(cached, dict) and cached.get("answer") and cached.get("product_ids"):
        state = AssistantGraphState(
            prompt=prompt,
            context=AssistantContext(user_id=user_id, conversation_id=conversation_id),
            conversation_summary=conversation_summary,
        )
        state.intent = intent
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
        conversation_summary=conversation_summary,
    )
    graph = AssistantGraph(tool_registry=build_tool_registry(), llm_client=get_llm_client())
    result = graph.run(db, state)
    if result.intent in cacheable_intents:
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
