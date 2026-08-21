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

    def select_for_intent(self, intent: str) -> list[AssistantTool]:
        return [tool for tool in self.tools if intent in tool.intent_names]

    def record_skip(self, state: AssistantGraphState, *, tool_name: str, detail: str) -> AssistantGraphState:
        state.tool_records.append(ToolCallRecord(tool_name=tool_name, status="skipped", detail=detail))
        return state
