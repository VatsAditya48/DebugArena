import uuid
from collections.abc import Generator
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import verify_token
from app.models.organization_membership import OrganizationMembership
from app.models.user import User

security = HTTPBearer()


def get_current_user(
    auth: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> User:
    """Validates JWT bearer token and retrieves authenticated user from DB."""
    token = auth.credentials
    try:
        user_id_str = verify_token(token)
        user_id = uuid.UUID(user_id_str)
    except (ValueError, Exception):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user account",
        )
    return user


def get_user_role(user: User, db: Session) -> str:
    """Fetch primary role from user's organization memberships."""
    membership = (
        db.query(OrganizationMembership)
        .filter(OrganizationMembership.user_id == user.id)
        .first()
    )
    return membership.role if membership else "candidate"


def require_roles(allowed_roles: list[str]):
    """Role-Based Access Control decorator: candidate, recruiter, admin."""
    def role_checker(
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db),
    ) -> User:
        role = get_user_role(current_user, db)
        if role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access forbidden: role '{role}' is not authorized. Requires: {allowed_roles}",
            )
        return current_user
    return role_checker
