"""Voice cloning API routes."""

import os
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse

router = APIRouter(tags=["voice-cloning"])  # Prefix added by include_router


@router.post("/clone", summary="Clone voice from reference audio")
async def clone_voice(
    reference_audio: UploadFile = File(..., description="Reference audio file for voice cloning"),
    text: str = Form(..., description="Text to synthesize with cloned voice"),
    language: str = Form("en", description="Language code (en, es, fr, etc.)"),
) -> FileResponse:
    """Clone a voice from reference audio and generate speech."""
    if not reference_audio.filename:
        raise HTTPException(status_code=400, detail="No filename provided")
    
    if not text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    if len(text) > 500:
        raise HTTPException(status_code=400, detail="Text too long (max 500 characters)")
    
    try:
        from app.services.tts import TTSService
        tts_service = TTSService()
        audio_path = await tts_service.clone_voice(reference_audio, text, language)
        
        if not os.path.exists(audio_path):
            raise HTTPException(status_code=500, detail="Failed to generate audio")
        
        return FileResponse(
            path=audio_path,
            media_type="audio/wav",
            filename=f"cloned_{os.path.basename(reference_audio.filename or 'output')}.wav",
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TTS generation failed: {str(e)}")


@router.post("/synthesize", summary="Synthesize speech from text")
async def synthesize_speech(
    text: str = Form(..., description="Text to synthesize"),
    voice_preset: str = Form(None, description="Optional voice preset"),
    language: str = Form("en", description="Language code"),
) -> FileResponse:
    """Synthesize speech from text."""
    if not text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    if len(text) > 500:
        raise HTTPException(status_code=400, detail="Text too long (max 500 characters)")
    
    try:
        from app.services.tts import TTSService
        tts_service = TTSService()
        audio_path = await tts_service.synthesize(text, voice_preset, language)
        
        if not os.path.exists(audio_path):
            raise HTTPException(status_code=500, detail="Failed to generate audio")
        
        return FileResponse(
            path=audio_path,
            media_type="audio/wav",
            filename="synthesized.wav",
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TTS generation failed: {str(e)}")


@router.get("/models", summary="List available TTS models")
async def list_models() -> dict:
    """List available TTS models for voice cloning."""
    from app.services.tts import TTSService
    tts_service = TTSService()
    return {"models": tts_service.list_available_models()}
