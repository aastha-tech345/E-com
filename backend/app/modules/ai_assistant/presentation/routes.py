from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db_session
from app.core.rate_limit import build_rate_limiter
from app.modules.ai_assistant.application.schemas import (
    AssistantConversationResponse,
    AssistantFeedbackRequest,
    AssistantMessageResponse,
    AssistantPromptRequest,
    AssistantPromptResponse,
)
from app.modules.ai_assistant.application.service import answer_prompt, get_conversation_for_user, submit_feedback
from app.modules.catalog.application.schemas import ProductResponse
from app.modules.identity.application.schemas import UserProfileResponse
from app.modules.identity.presentation.dependencies import get_optional_current_user

router = APIRouter(prefix="/assistant", tags=["ai_assistant"])


@router.post("", response_model=AssistantPromptResponse)
def prompt(
    payload: AssistantPromptRequest,
    _: None = Depends(build_rate_limiter(scope="assistant", limit=settings.assistant_rate_limit)),
    current_user: UserProfileResponse | None = Depends(get_optional_current_user),
    db: Session = Depends(get_db_session),
) -> AssistantPromptResponse:
    user_id = current_user.id if current_user is not None else None
    conversation, answer, products, intent, used_tools, metadata = answer_prompt(
        db,
        prompt=payload.prompt,
        user_id=user_id,
        conversation_id=payload.conversation_id,
    )
    return AssistantPromptResponse(
        conversation_id=conversation.id,
        answer=answer,
        products=[ProductResponse.model_validate(product) for product in products],
        intent=intent,
        used_tools=used_tools,
        metadata=metadata,
    )


@router.get("/conversations/{conversation_id}", response_model=AssistantConversationResponse)
def conversation_detail(
    conversation_id: str,
    current_user: UserProfileResponse | None = Depends(get_optional_current_user),
    db: Session = Depends(get_db_session),
) -> AssistantConversationResponse:
    user_id = current_user.id if current_user is not None else None
    conversation, messages, context = get_conversation_for_user(db, conversation_id=conversation_id, user_id=user_id)
    return AssistantConversationResponse(
        id=conversation.id,
        title=conversation.title,
        last_intent=conversation.last_intent,
        summary=context.summary if context is not None else "",
        message_count=context.message_count if context is not None else len(messages),
        messages=[
            AssistantMessageResponse(
                id=message.id,
                role=message.role,
                content=message.content,
                created_at=message.created_at.isoformat(),
            )
            for message in messages
        ],
    )


@router.post("/feedback", status_code=204)
def feedback(
    payload: AssistantFeedbackRequest,
    current_user: UserProfileResponse | None = Depends(get_optional_current_user),
    db: Session = Depends(get_db_session),
) -> None:
    user_id = current_user.id if current_user is not None else None
    submit_feedback(
        db,
        conversation_id=payload.conversation_id,
        user_id=user_id,
        message_id=payload.message_id,
        rating=payload.rating,
        feedback_text=payload.feedback_text,
    )
