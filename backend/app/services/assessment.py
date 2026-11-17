import uuid

from fastapi import HTTPException, status
from sqlalchemy.orm import Session, selectinload

from app.models.challenge import Challenge

from app.models.assessment import Assessment
from app.repositories.assessment import AssessmentRepository
from app.schemas.assessment import AssessmentCreate, AssessmentUpdate


class AssessmentService:

    @staticmethod
    def create(
        db: Session,
        organization_id: uuid.UUID,
        user_id: uuid.UUID,
        payload: AssessmentCreate,
    ) -> Assessment:
        assessment = Assessment(
            organization_id=organization_id,
            created_by=user_id,
            **payload.model_dump(),
        )

        try:
            AssessmentRepository.create(db, assessment)
            db.commit()
            db.refresh(assessment)
            return assessment
        except Exception:
            db.rollback()
            raise

    @staticmethod
    def list_all(
        db: Session,
        organization_id: uuid.UUID,
    ) -> list[Assessment]:
        return AssessmentRepository.list_by_organization(
            db, organization_id
        )

    @staticmethod
    def get(
        db: Session,
        assessment_id: uuid.UUID,
        organization_id: uuid.UUID,
    ) -> Assessment:
        assessment = AssessmentRepository.get_by_id(
            db, assessment_id, organization_id
        )

        if not assessment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Assessment not found",
            )

        return assessment

    @staticmethod
    def update(
        db: Session,
        assessment_id: uuid.UUID,
        organization_id: uuid.UUID,
        payload: AssessmentUpdate,
    ) -> Assessment:
        assessment = AssessmentService.get(
            db, assessment_id, organization_id
        )

        if assessment.status != "draft":
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Only draft assessments can be updated",
            )

        updates = payload.model_dump(exclude_unset=True)

        if not updates:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                detail="At least one field must be provided",
            )

        for field, value in updates.items():
            if value is None and field != "description":
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                    detail=f"{field} cannot be null",
                )

        try:
            for field, value in updates.items():
                setattr(assessment, field, value)

            db.commit()
            db.refresh(assessment)
            return assessment
        except Exception:
            db.rollback()
            raise

    @staticmethod
    def delete(
        db: Session,
        assessment_id: uuid.UUID,
        organization_id: uuid.UUID,
    ) -> None:
        assessment = AssessmentService.get(
            db, assessment_id, organization_id
        )

        if assessment.status != "draft":
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Only draft assessments can be deleted",
            )

        try:
            AssessmentRepository.delete(db, assessment)
            db.commit()
        except Exception:
            db.rollback()
            raise

    @staticmethod
    def publish(
        db: Session,
        assessment_id: uuid.UUID,
        organization_id: uuid.UUID,
    ) -> Assessment:
        assessment = AssessmentService.get(
            db, assessment_id, organization_id
        )

        if assessment.status != "draft":
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Only draft assessments can be published",
            )

        challenges = (
            db.query(Challenge)
            .options(selectinload(Challenge.test_cases))
            .filter(Challenge.assessment_id == assessment.id)
            .all()
        )

        if not challenges:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                detail="Assessment must contain at least one challenge",
            )

        for challenge in challenges:
            if not challenge.test_cases:
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                    detail=(
                        f"Challenge '{challenge.title}' must contain "
                        "at least one test case"
                    ),
                )

        try:
            assessment.status = "published"
            db.commit()
            db.refresh(assessment)
            return assessment
        except Exception:
            db.rollback()
            raise
