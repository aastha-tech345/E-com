from __future__ import annotations

import json

from sqlalchemy.orm import Session

from app.modules.ai_assistant.application.types import ToolCallRecord
from app.modules.ai_assistant.domain.models import AIToolInvocation


def log_tool_invocations(
    db: Session,
    *,
    conversation_id: str,
    user_id: str | None,
    records: list[ToolCallRecord],
) -> None:
    for record in records:
        db.add(
            AIToolInvocation(
                conversation_id=conversation_id,
                user_id=user_id,
                tool_name=record.tool_name,
                status=record.status,
                detail=record.detail,
                payload_json=json.dumps(record.payload),
            )
        )
