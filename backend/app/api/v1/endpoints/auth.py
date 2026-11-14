import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_user_role
from app.core.database import get_db
from app.core.security import create_access_token, hash_password, verify_password
from app.models.organization import Organization
from app.models.organization_membership import OrganizationMembership
from app.models.user import User
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
    summary="Register candidate or recruiter with hashed password",
)
def register(payload: UserRegister, db: Session = Depends(get_db)):
    # 1. Check if email already registered
    existing_user = db.query(User).filter(User.email == payload.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Email '{payload.email}' is already registered.",
        )

    # 2. Hash password and create User
    hashed_pwd = hash_password(payload.password)
    user_id = uuid.uuid4()
    new_user = User(
        id=user_id,
        email=payload.email,
        password_hash=hashed_pwd,
        full_name=payload.full_name,
        is_active=True,
    )
    db.add(new_user)
    db.flush()

    # 3. Handle Organization Membership
    target_org_id = payload.organization_id
    if target_org_id:
        org_exists = (
            db.query(Organization)
            .filter(Organization.id == target_org_id)
            .first()
        )
        if not org_exists:
            target_org_id = None

    if not target_org_id:
        default_org = (
            db.query(Organization)
            .filter(Organization.slug == "debugarena-hq")
            .first()
        )
        if not default_org:
            default_org = (
                db.query(Organization).order_by(Organization.created_at.asc()).first()
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
        target_org_id = default_org.id

    membership = OrganizationMembership(
        id=uuid.uuid4(),
        user_id=new_user.id,
        organization_id=target_org_id,
        role=payload.role,
    )
    db.add(membership)
    db.commit()
    db.refresh(new_user)

    return UserResponse(
        id=new_user.id,
        email=new_user.email,
        full_name=new_user.full_name,
        is_active=new_user.is_active,
        role=payload.role,
    )


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
    token = create_access_token(
        data={"sub": str(user.id), "email": user.email, "role": role}
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
def logout(current_user: User = Depends(get_current_user)):
    return MessageResponse(message="Successfully logged out")
