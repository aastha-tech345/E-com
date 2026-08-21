from __future__ import annotations

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.modules.ai_assistant.application.audit import log_tool_invocations
from app.modules.ai_assistant.application.memory import build_conversation_summary, update_conversation_context
from app.modules.ai_assistant.application.orchestrator import run_assistant_orchestrator
from app.modules.ai_assistant.domain.models import (
    AIAssistantFeedback,
    AIConversation,
    AIConversationContext,
    AIMessage,
)
from app.modules.catalog.application.service import hydrate_product_read_model
from app.modules.catalog.domain.models import Product


def _build_conversation_title(prompt: str) -> str:
    return prompt.strip()[:80] or "New conversation"


def answer_prompt(
    db: Session,
    *,
    prompt: str,
    user_id: str | None,
    conversation_id: str | None,
) -> tuple[
    AIConversation,
    str,
    list[Product],
    str,
    list[str],
    dict[str, str | int | float | bool | list[str] | None],
]:
    conversation = None
    if conversation_id is not None:
        conversation = db.get(AIConversation, conversation_id)
    if conversation is None:
        conversation = AIConversation(user_id=user_id, title=_build_conversation_title(prompt))
        db.add(conversation)
        db.flush()

    state = run_assistant_orchestrator(
        db,
        prompt=prompt,
        user_id=user_id,
        conversation_id=conversation.id,
    )
    matches = state.products
    if not matches and isinstance(state.metadata.get("cached_product_ids"), list):
        cached_ids = [str(product_id) for product_id in state.metadata["cached_product_ids"]]
        rows = db.scalars(select(Product).where(Product.id.in_(cached_ids))).all()
        indexed = {product.id: hydrate_product_read_model(db, product) for product in rows}
        matches = [indexed[product_id] for product_id in cached_ids if product_id in indexed]

    user_message = AIMessage(conversation_id=conversation.id, role="user", content=prompt)
    assistant_message = AIMessage(conversation_id=conversation.id, role="assistant", content=state.answer)
    db.add(user_message)
    db.add(assistant_message)
    db.flush()

    summary = build_conversation_summary(db, conversation_id=conversation.id)
    used_tools = [record.tool_name for record in state.tool_records if record.status == "completed"]
    message_count = (
        db.scalar(select(func.count()).select_from(AIMessage).where(AIMessage.conversation_id == conversation.id)) or 0
    ) + 2
    update_conversation_context(
        db,
        conversation_id=conversation.id,
        summary=summary,
        tool_names=used_tools,
        preference_profile={},
        message_count=message_count,
    )
    log_tool_invocations(
        db,
        conversation_id=conversation.id,
        user_id=user_id,
        records=state.tool_records,
    )
    conversation.last_intent = state.intent
    conversation.title = conversation.title or _build_conversation_title(prompt)
    db.commit()
    db.refresh(conversation)
    return (
        conversation,
        state.answer,
        matches,
        state.intent,
        used_tools,
        state.metadata,
    )


def get_conversation_for_user(
    db: Session,
    *,
    conversation_id: str,
    user_id: str | None,
) -> tuple[AIConversation, list[AIMessage], AIConversationContext | None]:
    conversation = db.scalar(select(AIConversation).where(AIConversation.id == conversation_id))
    if conversation is None or (conversation.user_id is not None and conversation.user_id != user_id):
        raise ValueError("Conversation not found.")
    messages = list(
        db.scalars(
            select(AIMessage)
            .where(AIMessage.conversation_id == conversation_id)
            .order_by(AIMessage.created_at.asc())
        ).all()
    )
    context = db.scalar(
        select(AIConversationContext).where(AIConversationContext.conversation_id == conversation_id)
    )
    return conversation, messages, context


def submit_feedback(
    db: Session,
    *,
    conversation_id: str,
    user_id: str | None,
    message_id: str | None,
    rating: str,
    feedback_text: str,
) -> AIAssistantFeedback:
    feedback = AIAssistantFeedback(
        conversation_id=conversation_id,
        user_id=user_id,
        message_id=message_id,
        rating=rating,
        feedback_text=feedback_text,
    )
    db.add(feedback)
    db.commit()
    db.refresh(feedback)
    return feedback
