from __future__ import annotations

from collections.abc import Awaitable, Callable

from fastapi import HTTPException, Request, status

from app.core.cache import cache_backend
from app.core.config import settings


def build_rate_limiter(*, scope: str, limit: int) -> Callable[[Request], Awaitable[None]]:
    async def dependency(request: Request) -> None:
        client_host = request.client.host if request.client is not None else "unknown"
        key = f"rate-limit:{scope}:{client_host}"
        attempts = cache_backend.incr(key, ttl_seconds=settings.rate_limit_window_seconds)
        if attempts > limit:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Rate limit exceeded. Please try again later.",
            )

    return dependency
