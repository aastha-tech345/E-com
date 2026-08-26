from __future__ import annotations

import json
from dataclasses import dataclass
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

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


class GrokLLMClient(BaseLLMClient):
    provider_name = "grok"

    def complete(
        self,
        *,
        system_prompt: str,
        user_prompt: str,
        context: dict[str, Any] | None = None,
    ) -> LLMCompletion:
        if not settings.grok_api_key:
            return RuleBasedLLMClient().complete(
                system_prompt=system_prompt,
                user_prompt=user_prompt,
                context=context,
            )

        messages: list[dict[str, str]] = [{"role": "system", "content": system_prompt}]
        if context:
            messages.append(
                {
                    "role": "system",
                    "content": f"Application context JSON:\n{json.dumps(context, default=str)[:12000]}",
                }
            )
        messages.append({"role": "user", "content": user_prompt})

        body = json.dumps(
            {
                "model": settings.ai_model,
                "messages": messages,
                "temperature": settings.ai_temperature,
            }
        ).encode("utf-8")
        request = Request(
            f"{settings.grok_base_url.rstrip('/')}/chat/completions",
            data=body,
            headers={
                "Authorization": f"Bearer {settings.grok_api_key}",
                "Content-Type": "application/json",
            },
            method="POST",
        )
        try:
            with urlopen(request, timeout=settings.ai_tool_timeout_seconds) as response:
                payload = json.loads(response.read().decode("utf-8"))
        except (HTTPError, URLError, TimeoutError, ValueError):
            return RuleBasedLLMClient().complete(
                system_prompt=system_prompt,
                user_prompt=user_prompt,
                context=context,
            )

        content = (
            payload.get("choices", [{}])[0]
            .get("message", {})
            .get("content", "")
            .strip()
        )
        if not content:
            return RuleBasedLLMClient().complete(
                system_prompt=system_prompt,
                user_prompt=user_prompt,
                context=context,
            )
        return LLMCompletion(content=content, provider=self.provider_name, model=settings.ai_model)


def get_llm_client() -> BaseLLMClient:
    if settings.ai_provider.lower() in {GrokLLMClient.provider_name, "xai"}:
        return GrokLLMClient()
    return RuleBasedLLMClient()
