from __future__ import annotations

import json

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modules.ai_assistant.domain.models import AIConversationContext, AIMessage


def build_conversation_summary(db: Session, *, conversation_id: str, max_messages: int = 6) -> str:
    messages = list(
        db.scalars(
            select(AIMessage)
            .where(AIMessage.conversation_id == conversation_id)
            .order_by(AIMessage.created_at.desc())
            .limit(max_messages)
        ).all()
    )
    if not messages:
        return ""
    ordered = list(reversed(messages))
    summary_lines = [f"{message.role}: {message.content[:120]}" for message in ordered]
    return " | ".join(summary_lines)


def get_or_create_context(db: Session, *, conversation_id: str) -> AIConversationContext:
    context = db.scalar(select(AIConversationContext).where(AIConversationContext.conversation_id == conversation_id))
    if context is not None:
        return context
    context = AIConversationContext(conversation_id=conversation_id)
    db.add(context)
    db.flush()
    return context


def update_conversation_context(
    db: Session,
    *,
    conversation_id: str,
    summary: str,
    tool_names: list[str],
    preference_profile: dict[str, str],
    message_count: int,
) -> AIConversationContext:
    context = get_or_create_context(db, conversation_id=conversation_id)
    context.summary = summary
    context.last_tool_names = json.dumps(tool_names)
    context.preference_profile = json.dumps(preference_profile)
    context.message_count = message_count
    db.add(context)
    return context
