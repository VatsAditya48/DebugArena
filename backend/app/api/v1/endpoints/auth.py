import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_user_role
from app.core.database import get_db
from app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
    verify_token,
)
from app.models.organization import Organization
from app.models.organization_membership import OrganizationMembership
from app.models.user import User
from app.models.refresh_session import RefreshSession
from app.schemas.auth import (
    MessageResponse,
    TokenResponse,
    UserLogin,
    UserRegister,
    UserResponse,
)

router = APIRouter(tags=["Authentication"])


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new candidate",
)
def register(payload: UserRegister, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == payload.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email is already registered.",
        )

    try:
        default_org = (
            db.query(Organization)
            .filter(
                Organization.slug == "debugarena-hq",
                Organization.is_active.is_(True),
            )
            .first()
        )

        if not default_org:
            default_org = Organization(
                id=uuid.uuid4(),
                name="DebugArena HQ",
                slug="debugarena-hq",
                is_active=True,
            )
            db.add(default_org)
            db.flush()

        new_user = User(
            id=uuid.uuid4(),
            email=payload.email,
            password_hash=hash_password(payload.password),
            full_name=payload.full_name,
            is_active=True,
        )
        db.add(new_user)
        db.flush()

        membership = OrganizationMembership(
            id=uuid.uuid4(),
            user_id=new_user.id,
            organization_id=default_org.id,
            role="candidate",
        )
        db.add(membership)

        db.commit()
        db.refresh(new_user)

        return UserResponse(
            id=new_user.id,
            email=new_user.email,
            full_name=new_user.full_name,
            is_active=new_user.is_active,
            role="candidate",
        )

    except Exception:
        db.rollback()
        raise


@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Authenticate by email & password -> JWT Access Token",
)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()

    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user account",
        )

    role = get_user_role(user, db)

    token, session_id, expires_at = create_access_token(
        data={
            "sub": str(user.id),
            "email": user.email,
            "role": role,
        }
    )

    try:
        session = RefreshSession(
            id=session_id,
            user_id=user.id,
            expires_at=expires_at,
        )
        db.add(session)
        db.commit()

    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to create login session",
        )

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse(
            id=user.id,
            email=user.email,
            full_name=user.full_name,
            is_active=user.is_active,
            role=role,
        ),
    )

@router.get(
    "/me",
    response_model=UserResponse,
    summary="Return current user identity, role and status",
)
def get_me(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    role = get_user_role(current_user, db)
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
        is_active=current_user.is_active,
        role=role,
    )


@router.post(
    "/logout",
    response_model=MessageResponse,
    summary="Logout current user session",
)
def logout(
    auth: HTTPAuthorizationCredentials = Depends(HTTPBearer()),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        claims = verify_token(auth.credentials)
        session_id = uuid.UUID(claims["session_id"])

        session = (
            db.query(RefreshSession)
            .filter(
                RefreshSession.id == session_id,
                RefreshSession.user_id == current_user.id,
                RefreshSession.revoked_at.is_(None),
            )
            .first()
        )

        if not session:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Session already revoked or invalid",
            )

        session.revoked_at = datetime.now(timezone.utc)
        db.commit()

        return MessageResponse(message="Successfully logged out")

    except HTTPException:
        raise
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to revoke session",
        )
