from __future__ import annotations

from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.cache import cache_backend


def database_ready(db: Session) -> bool:
    try:
        db.execute(text("SELECT 1"))
        return True
    except Exception:
        return False


def cache_ready() -> bool:
    return cache_backend.ping()
