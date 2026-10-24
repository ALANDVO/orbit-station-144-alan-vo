"""Tests for configuration."""

from app.core.config import settings


def test_settings_app_name():
    """Test app name configuration."""
    assert settings.app_name == "VoiceStudio"


def test_settings_app_version():
    """Test app version configuration."""
    assert settings.app_version == "1.0.0"


def test_settings_environment():
    """Test environment configuration."""
    assert settings.environment in ["development", "production", "testing"]


def test_settings_database_url():
    """Test database URL configuration."""
    assert settings.database_url.startswith("sqlite")


def test_settings_cors_origins():
    """Test CORS origins configuration."""
    assert isinstance(settings.cors_origins, list)
    assert "http://localhost:5173" in settings.cors_origins
    assert "http://localhost:3000" in settings.cors_origins


def test_settings_secret_key():
    """Test secret key configuration."""
    assert len(settings.secret_key) >= 32


def test_settings_llm_config():
    """Test LLM configuration."""
    assert settings.llm_provider in ["openai-compatible", "anthropic", "gemini", "ollama"]
    assert isinstance(settings.llm_model, str)
    assert len(settings.llm_model) > 0
