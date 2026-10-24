# Product development plan

Each round completes one feature or repair. Future items are planned, not implemented claims.

## Current round

project-skeleton

## Roadmap

### project-skeleton — FastAPI + React project skeleton with Docker Compose

Status: in_progress

Acceptance:
- Backend FastAPI app runs with SQLite
- Frontend React + TypeScript + Vite builds
- Docker Compose brings up backend, frontend, Keycloak
- Basic health endpoints work
- Preflight script passes

### voice-cloning — Voice cloning workflow with local TTS

Status: planned

Acceptance:
- Upload reference audio and clone voice
- Generate speech from text using cloned voice
- Play/download generated audio

### video-dubbing — Video dubbing workflow

Status: planned

Acceptance:
- Upload video, extract audio
- Transcribe and translate audio
- Generate dubbed audio in target language
- Merge back with video

### transcription-audiobook — Transcription and audiobook creation

Status: planned

Acceptance:
- Upload audio, get transcript with timestamps
- Generate audiobook from text with voice selection
- Export as MP3/M4B with chapters

### auth-keycloak — OIDC authentication with Keycloak

Status: planned

Acceptance:
- Login/logout via Keycloak
- Protected API endpoints
- Role-based access (viewer/operator/admin)

