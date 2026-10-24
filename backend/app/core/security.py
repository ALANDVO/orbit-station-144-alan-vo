"""Security utilities for authentication and authorization."""

from datetime import datetime, timedelta, UTC
from typing import Optional

from jose import jwt
from passlib.context import CryptContext
from pydantic import BaseModel

from app.core.config import settings


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class TokenData(BaseModel):
    """Decoded JWT token data."""
    sub: str
    exp: int
    iat: int
    roles: list[str] = []
    email: Optional[str] = None
    name: Optional[str] = None


def create_access_token(
    subject: str,
    roles: list[str] = None,
    email: Optional[str] = None,
    name: Optional[str] = None,
    expires_delta: Optional[timedelta] = None,
) -> str:
    """Create a JWT access token."""
    if roles is None:
        roles = ["viewer"]

    now = datetime.now(UTC)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=settings.access_token_expire_minutes)

    to_encode = {
        "sub": subject,
        "exp": int(expire.timestamp()),
        "iat": int(now.timestamp()),
        "roles": roles,
        "email": email,
        "name": name,
    }
    return jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)


def decode_token(token: str) -> TokenData:
    """Decode and validate a JWT token."""
    try:
        payload = jwt.decode(
            token,
            settings.secret_key,
            algorithms=[settings.algorithm],
        )
        return TokenData(**payload)
    except jwt.JWTError as e:
        raise ValueError(f"Invalid token: {e}")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against its hash."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hash a password."""
    return pwd_context.hash(password)


ROLE_HIERARCHY = {
    "admin": ["admin", "operator", "viewer"],
    "operator": ["operator", "viewer"],
    "viewer": ["viewer"],
}


def has_role(user_roles: list[str], required_role: str) -> bool:
    """Check if user has required role (including hierarchy)."""
    for role in user_roles:
        if required_role in ROLE_HIERARCHY.get(role, []):
            return True
    return False
