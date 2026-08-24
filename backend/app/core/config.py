from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_env: str = "development"
    api_prefix: str = "/api/v1"
    secret_key: str = "change-me"
    access_token_expiry_minutes: int = 30
    database_url: str = "sqlite:///./marketplace.db"
    cors_origins: list[str] = Field(default_factory=lambda: ["http://localhost:3000"])
    auto_create_tables: bool = False
    admin_email: str = "admin@example.com"
    admin_password: str = "Admin123!"
    redis_url: str = "redis://localhost:6379/0"
    cache_ttl_seconds: int = 300
    rate_limit_window_seconds: int = 60
    auth_rate_limit: int = 10
    public_search_rate_limit: int = 60
    assistant_rate_limit: int = 20
    secure_cookies: bool = False
    ai_assistant_enabled: bool = True
    ai_provider: str = "rule_based"
    ai_model: str = "marketplace-assistant-v1"
    ai_temperature: float = 0.1
    ai_max_context_messages: int = 12
    ai_tool_timeout_seconds: int = 8
    ai_cache_ttl_seconds: int = 120
    ai_allow_write_actions: bool = False
    huggingface_api_token: str = ""
    huggingface_embedding_model: str = "sentence-transformers/all-MiniLM-L6-v2"
    huggingface_embedding_endpoint: str = "https://router.huggingface.co/hf-inference/models"
    frontend_url: str = "http://localhost:8080"
    stripe_secret_key: str = ""
    stripe_webhook_secret: str = ""
    stripe_currency: str = "inr"


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
