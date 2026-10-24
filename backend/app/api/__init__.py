"""API package."""

from app.api.routes import health_router
from fastapi import APIRouter

api_router = APIRouter()
api_router.include_router(health_router)

__all__ = ["api_router"]