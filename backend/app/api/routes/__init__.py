"""API routes package."""

from fastapi import APIRouter
from app.api.routes.health import router as health_router
from app.api.routes.voice_cloning import router as voice_cloning_router

api_router = APIRouter()
api_router.include_router(health_router)
api_router.include_router(voice_cloning_router, prefix="/voice/cloning", tags=["voice-cloning"])

__all__ = ["api_router"]
