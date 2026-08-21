from __future__ import annotations

from sqlalchemy.orm import Session

from app.modules.ai_assistant.application.tool_registry import AssistantTool
from app.modules.ai_assistant.application.types import AssistantGraphState, ToolCallRecord
from app.modules.search.application.service import get_popular_search_terms_cached, get_search_suggestions


class SearchSuggestionsTool(AssistantTool):
    name = "search.suggestions"
    intent_names = ("product_search",)

    def run(self, db: Session, state: AssistantGraphState) -> AssistantGraphState:
        suggestions = get_search_suggestions(db, query=state.prompt, limit=5)
        state.metadata["suggestions"] = suggestions
        state.tool_records.append(
            ToolCallRecord(
                tool_name=self.name,
                status="completed",
                detail=f"Generated {len(suggestions)} search suggestions.",
            )
        )
        return state


class PopularSearchesTool(AssistantTool):
    name = "search.popular_terms"
    intent_names = ("product_search", "product_recommendation")

    def run(self, db: Session, state: AssistantGraphState) -> AssistantGraphState:
        terms, cached = get_popular_search_terms_cached(db, limit=5)
        state.metadata["popular_search_terms"] = terms
        state.metadata["popular_searches_cached"] = cached
        state.tool_records.append(
            ToolCallRecord(
                tool_name=self.name,
                status="completed",
                detail=f"Loaded {len(terms)} popular search terms.",
            )
        )
        return state
