"""Authentication service."""

from datetime import datetime, timedelta
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.security import verify_password, get_password_hash, create_access_token
from app.models.user import User, UserCreate, UserRole


class AuthService:
    """Service for authentication operations."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_user(self, user_data: UserCreate) -> User:
        """Create a new user."""
        hashed_password = get_password_hash(user_data.password)
        user = User(
            email=user_data.email,
            hashed_password=hashed_password,
            full_name=user_data.full_name,
            role=user_data.role,
        )
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        return user

    async def authenticate_user(self, email: str, password: str) -> Optional[User]:
        """Authenticate a user with email and password."""
        result = await self.db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user

    async def get_user_by_id(self, user_id: int) -> Optional[User]:
        """Get user by ID."""
        result = await self.db.execute(select(User).where(User.id == user_id))
        return result.scalar_one_or_none()

    async def get_user_by_email(self, email: str) -> Optional[User]:
        """Get user by email."""
        result = await self.db.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()

    async def update_last_login(self, user: User) -> None:
        """Update user's last login timestamp."""
        user.last_login = datetime.utcnow()
        await self.db.commit()

    def create_access_token(self, user: User, expires_delta: Optional[timedelta] = None) -> str:
        """Create access token for user."""
        return create_access_token(
            data={"sub": str(user.id), "email": user.email, "role": user.role.value},
            expires_delta=expires_delta,
        )

    async def get_current_user(self, token: str) -> Optional[User]:
        """Get current user from token (placeholder for JWT verification)."""
        # This would verify the JWT token and return the user
        # For now, we'll just return None as a placeholder
        return None