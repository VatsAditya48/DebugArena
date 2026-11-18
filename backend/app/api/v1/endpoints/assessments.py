from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.organization import Organization
from app.models.organization_membership import OrganizationMembership
from app.models.user import User
from app.schemas.assessment import (
    AssessmentCreate,
    AssessmentResponse,
    AssessmentUpdate,
)
from app.schemas.auth import MessageResponse
from app.services.assessment import AssessmentService


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
    response_model=AssessmentResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_assessment(
    payload: AssessmentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    organization_id = get_recruiter_organization(current_user, db)

    return AssessmentService.create(
        db, organization_id, current_user.id, payload
    )


@router.get(
    "",
    response_model=list[AssessmentResponse],
)
def list_assessments(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    organization_id = get_recruiter_organization(current_user, db)

    return AssessmentService.list_all(db, organization_id)


@router.get(
    "/{assessment_id}",
    response_model=AssessmentResponse,
)
def get_assessment(
    assessment_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    organization_id = get_recruiter_organization(current_user, db)

    return AssessmentService.get(db, assessment_id, organization_id)


@router.patch(
    "/{assessment_id}",
    response_model=AssessmentResponse,
)
def update_assessment(
    assessment_id: UUID,
    payload: AssessmentUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    organization_id = get_recruiter_organization(current_user, db)

    return AssessmentService.update(
        db, assessment_id, organization_id, payload
    )


@router.delete(
    "/{assessment_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_assessment(
    assessment_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    organization_id = get_recruiter_organization(current_user, db)

    AssessmentService.delete(db, assessment_id, organization_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post(
    "/{assessment_id}/publish",
    response_model=AssessmentResponse,
)
def publish_assessment(
    assessment_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    organization_id = get_recruiter_organization(current_user, db)

    return AssessmentService.publish(db, assessment_id, organization_id)
