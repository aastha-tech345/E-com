from __future__ import annotations

import json
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from threading import Lock
from typing import Any, cast

from redis import Redis
from redis.exceptions import RedisError

from app.core.config import settings


def _encode(value: Any) -> str:
    return json.dumps(value, default=str)


def _decode(value: bytes | str | None) -> Any | None:
    if value is None:
        return None
    if isinstance(value, bytes):
        value = value.decode("utf-8")
    return json.loads(value)


@dataclass
class CacheEntry:
    value: Any
    expires_at: datetime


class InMemoryCacheBackend:
    def __init__(self) -> None:
        self._entries: dict[str, CacheEntry] = {}
        self._lock = Lock()

    def get(self, key: str) -> Any | None:
        with self._lock:
            entry = self._entries.get(key)
            if entry is None:
                return None
            if entry.expires_at <= datetime.now(timezone.utc):
                self._entries.pop(key, None)
                return None
            return entry.value

    def set(self, key: str, value: Any, *, ttl_seconds: int | None = None) -> None:
        ttl = ttl_seconds or settings.cache_ttl_seconds
        expires_at = datetime.now(timezone.utc) + timedelta(seconds=ttl)
        with self._lock:
            self._entries[key] = CacheEntry(value=value, expires_at=expires_at)

    def delete(self, key: str) -> None:
        with self._lock:
            self._entries.pop(key, None)

    def incr(self, key: str, *, ttl_seconds: int) -> int:
        with self._lock:
            now = datetime.now(timezone.utc)
            entry = self._entries.get(key)
            if entry is None or entry.expires_at <= now:
                value = 1
            else:
                value = int(entry.value) + 1
            self._entries[key] = CacheEntry(
                value=value,
                expires_at=now + timedelta(seconds=ttl_seconds),
            )
            return value

    def ping(self) -> bool:
        return True


class RedisCacheBackend:
    def __init__(self, redis_url: str) -> None:
        self._client: Any = cast(Redis, Redis.from_url(redis_url, decode_responses=False))

    def get(self, key: str) -> Any | None:
        try:
            return _decode(self._client.get(key))
        except RedisError:
            return None

    def set(self, key: str, value: Any, *, ttl_seconds: int | None = None) -> None:
        ttl = ttl_seconds or settings.cache_ttl_seconds
        try:
            self._client.set(name=key, value=_encode(value), ex=ttl)
        except RedisError:
            return

    def delete(self, key: str) -> None:
        try:
            self._client.delete(key)
        except RedisError:
            return

    def incr(self, key: str, *, ttl_seconds: int) -> int:
        try:
            value = self._client.incr(key)
            if value == 1:
                self._client.expire(key, ttl_seconds)
            return int(value)
        except RedisError:
            return 1

    def ping(self) -> bool:
        try:
            return bool(self._client.ping())
        except RedisError:
            return False


class CacheFacade:
    def __init__(self) -> None:
        self._fallback = InMemoryCacheBackend()
        try:
            self._backend: InMemoryCacheBackend | RedisCacheBackend = RedisCacheBackend(settings.redis_url)
            if not self._backend.ping():
                self._backend = self._fallback
        except Exception:
            self._backend = self._fallback

    def get(self, key: str) -> Any | None:
        return self._backend.get(key)

    def set(self, key: str, value: Any, *, ttl_seconds: int | None = None) -> None:
        self._backend.set(key, value, ttl_seconds=ttl_seconds)

    def delete(self, key: str) -> None:
        self._backend.delete(key)

    def incr(self, key: str, *, ttl_seconds: int) -> int:
        return self._backend.incr(key, ttl_seconds=ttl_seconds)

    def ping(self) -> bool:
        return self._backend.ping()

    @property
    def backend_name(self) -> str:
        return self._backend.__class__.__name__


cache_backend = CacheFacade()
