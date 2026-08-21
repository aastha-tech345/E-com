from typing import Any

from pydantic import BaseModel, Field

from app.modules.catalog.application.schemas import ProductResponse


class AssistantPromptRequest(BaseModel):
    prompt: str = Field(min_length=3, max_length=500)
    conversation_id: str | None = None


class AssistantPromptResponse(BaseModel):
    conversation_id: str
    answer: str
    products: list[ProductResponse]
    intent: str | None = None
    used_tools: list[str] = Field(default_factory=list)
    metadata: dict[str, Any] = Field(default_factory=dict)


class AssistantMessageResponse(BaseModel):
    id: str
    role: str
    content: str
    created_at: str


class AssistantConversationResponse(BaseModel):
    id: str
    title: str
    last_intent: str
    summary: str
    message_count: int
    messages: list[AssistantMessageResponse]


class AssistantFeedbackRequest(BaseModel):
    conversation_id: str
    message_id: str | None = None
    rating: str = Field(pattern="^(helpful|not_helpful)$")
    feedback_text: str = Field(default="", max_length=500)
