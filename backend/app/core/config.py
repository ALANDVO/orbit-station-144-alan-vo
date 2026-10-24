"""Application configuration using pydantic-settings."""

from functools import lru_cache
from typing import Optional

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # App
    app_name: str = "VoiceStudio"
    app_version: str = "1.0.0"
    debug: bool = False
    environment: str = "development"

    # Database
    database_url: str = "sqlite+aiosqlite:///./voicestudio.db"

    # Security
    secret_key: str = Field(default="dev-secret-change-in-production-32chars", min_length=32)
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    # Keycloak / OIDC
    keycloak_url: str = "http://localhost:8080"
    keycloak_realm: str = "voicestudio"
    keycloak_client_id: str = "voicestudio-client"
    keycloak_client_secret: Optional[str] = None

    # LLM
    llm_api_key: Optional[str] = None
    llm_provider: str = "openai-compatible"
    llm_model: str = "gpt-4o-mini"
    llm_base_url: Optional[str] = None

    # CORS
    cors_origins: list[str] = Field(default_factory=lambda: ["http://localhost:5173", "http://localhost:3000"])

    # File storage
    upload_dir: str = "./uploads"
    max_upload_size: int = 100 * 1024 * 1024  # 100MB


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


settings = get_settings()
