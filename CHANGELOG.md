# Changelog

## 1.1.0 — work-in-progress checkpoint

Partial code published for continued development. Known issues: STATUS.md.

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-11-02

### Added
- FastAPI backend with SQLite database and async SQLAlchemy
- React + TypeScript + Vite frontend with health monitoring
- Docker Compose with Keycloak integration
- Health check endpoints (`/api/v1/health/`, `/api/v1/health/db`)
- JWT authentication with role-based access control (admin/operator/viewer)
- Comprehensive test suite (backend: 9 tests, frontend: 15 tests)
- Type-safe API client with axios interceptors
- Project structure following clean architecture principles

### Fixed
- Frontend TypeScript build errors (Vite env types, API client methods)
- Test mock typing for axios
- HealthCheck component data handling

## [Unreleased]

### Planned
- Voice cloning workflow
- Video dubbing pipeline
- Transcription and audiobook creation
- OIDC authentication with Keycloak
- Full CI/CD pipeline

