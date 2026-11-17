from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.organization import Organization
from app.models.organization_membership import OrganizationMembership
from app.models.user import User
from app.schemas.challenge import (
    ChallengeCreate,
    CandidateChallengeResponse,
    ChallengeResponse,
    ChallengeUpdate,
)
from app.services.challenge import ChallengeService


router = APIRouter()


def get_recruiter_organization(
    user: User,
    db: Session,
) -> UUID:
    membership = (
        db.query(OrganizationMembership)
        .join(Organization)
        .filter(
            OrganizationMembership.user_id == user.id,
            Organization.slug == "debugarena-hq",
            Organization.is_active.is_(True),
            OrganizationMembership.role == "recruiter",
        )
        .first()
    )

    if not membership:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Recruiter access required",
        )

    return membership.organization_id


@router.post(
    "",
    response_model=ChallengeResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_challenge(
    payload: ChallengeCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    organization_id = get_recruiter_organization(current_user, db)

    return ChallengeService.create(
        db, organization_id, payload
    )


@router.get(
    "/{challenge_id}",
    response_model=ChallengeResponse,
)
def get_challenge(
    challenge_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    organization_id = get_recruiter_organization(current_user, db)

    return ChallengeService.get(
        db, challenge_id, organization_id
    )


@router.patch(
    "/{challenge_id}",
    response_model=ChallengeResponse,
)
def update_challenge(
    challenge_id: UUID,
    payload: ChallengeUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    organization_id = get_recruiter_organization(current_user, db)

    return ChallengeService.update(
        db, challenge_id, organization_id, payload
    )


@router.get(
    "/assessment/{assessment_id}/candidate",
    response_model=list[CandidateChallengeResponse],
)
def list_candidate_challenges(
    assessment_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    from app.api.deps import get_user_role
    from app.models.organization import Organization

    if get_user_role(current_user, db) != "candidate":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Candidate access required",
        )

    organization = (
        db.query(Organization)
        .filter(
            Organization.slug == "debugarena-hq",
            Organization.is_active.is_(True),
        )
        .first()
    )

    if not organization:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found",
        )

    return ChallengeService.list_for_candidate(
        db, assessment_id, organization.id
    )
