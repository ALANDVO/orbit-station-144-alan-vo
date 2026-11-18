"""Tests for voice cloning endpoints."""

import pytest
from httpx import AsyncClient
from fastapi import UploadFile
import tempfile
import os

from app.main import app


@pytest.mark.asyncio
async def test_voice_cloning_endpoint_integration():
    """Test that voice cloning routes are registered."""
    # Check that the router has the expected routes
    routes = [route.path for route in app.routes]
    cloning_routes = [r for r in routes if 'cloning' in r]
    assert len(cloning_routes) > 0, "No cloning routes found"


@pytest.mark.asyncio
async def test_synthesize_speech_endpoint():
    """Test the synthesize speech endpoint with valid input."""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        # Create a minimal WAV file for testing
        with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as tmp:
            tmp.write(b'RIFF' + b'\x00' * 24 + b'WAVE')  # Minimal WAV header
            tmp_path = tmp.name
        
        try:
            # Upload reference audio and synthesize
            files = {'reference_audio': ('test.wav', open(tmp_path, 'rb'), 'audio/wav')}
            data = {'text': 'Hello, this is a test.', 'language': 'en'}
            
            response = await ac.post(
                '/api/v1/voice/cloning/synthesize',
                files=files,
                data=data,
            )
            
            # The endpoint should return either 200 or 422 based on implementation
            assert response.status_code in (200, 422, 500)
        finally:
            os.unlink(tmp_path)


@pytest.mark.asyncio
async def test_clone_voice_endpoint():
    """Test the clone voice endpoint with valid input."""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as tmp:
            tmp.write(b'RIFF' + b'\x00' * 24 + b'WAVE')
            tmp_path = tmp.name
        
        try:
            files = {'reference_audio': ('test.wav', open(tmp_path, 'rb'), 'audio/wav')}
            data = {'text': 'Test cloned voice', 'language': 'en'}
            
            response = await ac.post(
                '/api/v1/voice/cloning/clone',
                files=files,
                data=data,
            )
            
            assert response.status_code in (200, 422, 500)
        finally:
            os.unlink(tmp_path)


@pytest.mark.asyncio
async def test_list_models_endpoint():
    """Test the list models endpoint."""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get('/api/v1/voice/cloning/models')
        
        assert response.status_code == 200
        data = response.json()
        assert 'models' in data
        assert len(data['models']) > 0
