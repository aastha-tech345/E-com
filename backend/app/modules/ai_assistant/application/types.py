from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

from app.modules.catalog.domain.models import Product


@dataclass(slots=True)
class AssistantContext:
    user_id: str | None
    conversation_id: str | None


@dataclass(slots=True)
class ToolCallRecord:
    tool_name: str
    status: str
    detail: str = ""
    payload: dict[str, Any] = field(default_factory=dict)


@dataclass(slots=True)
class AssistantGraphState:
    prompt: str
    context: AssistantContext
    intent: str = "product_search"
    answer: str = ""
    products: list[Product] = field(default_factory=list)
    tool_records: list[ToolCallRecord] = field(default_factory=list)
    metadata: dict[str, Any] = field(default_factory=dict)
    conversation_summary: str = ""
    confirmation_required: bool = False
