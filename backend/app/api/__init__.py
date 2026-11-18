"""API package - re-exports the main api_router."""

from app.api.routes import api_router

__all__ = ["api_router"]
