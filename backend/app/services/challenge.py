import uuid

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.challenge import Challenge
from app.models.test_case import TestCase
from app.repositories.assessment import AssessmentRepository
from app.repositories.challenge import ChallengeRepository
from app.schemas.challenge import ChallengeCreate, ChallengeUpdate


class ChallengeService:

    @staticmethod
    def create(
        db: Session,
        organization_id: uuid.UUID,
        payload: ChallengeCreate,
    ) -> Challenge:
        assessment = AssessmentRepository.get_by_id(
            db,
            payload.assessment_id,
            organization_id,
        )

        if not assessment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Assessment not found",
            )

        if assessment.status != "draft":
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Challenges can only be added to draft assessments",
            )

        challenge = Challenge(
            assessment_id=assessment.id,
            title=payload.title,
            description=payload.description,
            constraints=payload.constraints,
            starter_code=payload.starter_code,
            order_index=payload.order_index,
            test_cases=[
                TestCase(**test_case.model_dump())
                for test_case in payload.test_cases
            ],
        )

        try:
            ChallengeRepository.create(db, challenge)
            db.commit()
            db.refresh(challenge)
            return challenge
        except Exception:
            db.rollback()
            raise

    @staticmethod
    def get(
        db: Session,
        challenge_id: uuid.UUID,
        organization_id: uuid.UUID,
    ) -> Challenge:
        challenge = ChallengeRepository.get_by_id(
            db,
            challenge_id,
            organization_id,
        )

        if not challenge:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Challenge not found",
            )

        return challenge

    @staticmethod
    def update(
        db: Session,
        challenge_id: uuid.UUID,
        organization_id: uuid.UUID,
        payload: ChallengeUpdate,
    ) -> Challenge:
        challenge = ChallengeService.get(
            db,
            challenge_id,
            organization_id,
        )

        if challenge.assessment.status != "draft":
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Only challenges in draft assessments can be updated",
            )

        updates = payload.model_dump(exclude_unset=True)

        if not updates:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                detail="At least one field must be provided",
            )

        for field, value in updates.items():
            if value is None and field not in ("constraints", "starter_code"):
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                    detail=f"{field} cannot be null",
                )

        try:
            for field, value in updates.items():
                setattr(challenge, field, value)

            db.commit()
            db.refresh(challenge)
            return challenge
        except Exception:
            db.rollback()
            raise


    @staticmethod
    def list_for_candidate(db, assessment_id, organization_id):
        from fastapi import HTTPException, status
        from app.models.assessment import Assessment
        from app.models.test_case import TestCase
        from sqlalchemy.orm import selectinload, with_loader_criteria

        assessment = (
            db.query(Assessment)
            .filter(
                Assessment.id == assessment_id,
                Assessment.organization_id == organization_id,
                Assessment.status == "published",
            )
            .first()
        )

        if not assessment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Published assessment not found",
            )

        return (
            db.query(Challenge)
            .options(
                selectinload(Challenge.test_cases),
                with_loader_criteria(
                    TestCase,
                    TestCase.is_hidden.is_(False),
                ),
            )
            .filter(Challenge.assessment_id == assessment_id)
            .order_by(Challenge.order_index.asc())
            .execution_options(populate_existing=True)
            .all()
        )
