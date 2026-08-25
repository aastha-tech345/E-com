from __future__ import annotations

from dataclasses import dataclass
from typing import Protocol

from sqlalchemy.orm import Session

from app.modules.ai_assistant.application.types import AssistantGraphState, ToolCallRecord


class AssistantTool(Protocol):
    name: str
    intent_names: tuple[str, ...]

    def run(self, db: Session, state: AssistantGraphState) -> AssistantGraphState:
        ...


@dataclass(slots=True)
class ToolRegistry:
    tools: tuple[AssistantTool, ...]

    def select_for_intents(self, intents: list[str]) -> list[AssistantTool]:
        if not intents:
            return []
        seen: set[str] = set()
        selected: list[AssistantTool] = []
        for tool in self.tools:
            if any(intent in tool.intent_names for intent in intents) and tool.name not in seen:
                selected.append(tool)
                seen.add(tool.name)
        return selected

    def select_for_intent(self, intent: str) -> list[AssistantTool]:
        return self.select_for_intents([intent])

    def record_skip(self, state: AssistantGraphState, *, tool_name: str, detail: str) -> AssistantGraphState:
        state.tool_records.append(ToolCallRecord(tool_name=tool_name, status="skipped", detail=detail))
        return state
