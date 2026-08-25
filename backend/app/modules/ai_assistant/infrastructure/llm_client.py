from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from app.core.config import settings


@dataclass(slots=True)
class LLMCompletion:
    content: str
    provider: str
    model: str


class BaseLLMClient:
    provider_name = "base"

    def complete(
        self,
        *,
        system_prompt: str,
        user_prompt: str,
        context: dict[str, Any] | None = None,
    ) -> LLMCompletion:
        raise NotImplementedError


class RuleBasedLLMClient(BaseLLMClient):
    provider_name = "rule_based"

    def complete(
        self,
        *,
        system_prompt: str,
        user_prompt: str,
        context: dict[str, Any] | None = None,
    ) -> LLMCompletion:
        del system_prompt
        del context
        normalized = user_prompt.strip().lower()
        if "compare" in normalized:
            content = "I compared the catalog options I found and highlighted the closest matches."
        elif any(token in normalized for token in ("gift", "recommend", "suggest")):
            content = "I reviewed the current catalog and selected products that best match your request."
        elif normalized:
            content = f"Here is what I found for {user_prompt.strip()}."
        else:
            content = "Here are the closest products I found for you."
        return LLMCompletion(content=content, provider=self.provider_name, model=settings.ai_model)


def get_llm_client() -> BaseLLMClient:
    if settings.ai_provider == RuleBasedLLMClient.provider_name:
        return RuleBasedLLMClient()
    return RuleBasedLLMClient()
