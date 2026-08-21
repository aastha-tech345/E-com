import asyncio

import pytest
from fastapi import HTTPException
from sqlalchemy.orm import Session
from starlette.requests import Request

from app.core.cache import cache_backend
from app.core.config import settings
from app.core.health import cache_ready, database_ready
from app.core.rate_limit import build_rate_limiter
from app.main import healthcheck, liveness


def _request_for(host: str) -> Request:
    scope = {
        "type": "http",
        "method": "GET",
        "path": "/",
        "headers": [],
        "client": (host, 12345),
    }
    return Request(scope)


def test_health_helpers(db_session: Session) -> None:
    assert healthcheck()["status"] == "ok"
    assert liveness()["status"] == "alive"
    assert database_ready(db_session) is True
    assert cache_ready() is True


def test_auth_rate_limit() -> None:
    async def exercise_limit() -> None:
        await limiter(_request_for("testclient"))

    limiter = build_rate_limiter(scope="auth-login", limit=1)
    key = "rate-limit:auth-login:testclient"
    cache_backend.delete(key)
    original_limit = settings.auth_rate_limit
    settings.auth_rate_limit = 1
    asyncio.run(exercise_limit())
    with pytest.raises(HTTPException) as exc:
        asyncio.run(exercise_limit())
    assert exc.value.status_code == 429
    settings.auth_rate_limit = original_limit
    cache_backend.delete(key)
