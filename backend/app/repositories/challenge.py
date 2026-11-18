import uuid

from sqlalchemy.orm import Session, selectinload

from app.models.assessment import Assessment
from app.models.challenge import Challenge


class ChallengeRepository:

    @staticmethod
    def create(db: Session, challenge: Challenge) -> Challenge:
        db.add(challenge)
        db.flush()
        return challenge

    @staticmethod
    def get_by_id(
        db: Session,
        challenge_id: uuid.UUID,
        organization_id: uuid.UUID,
    ) -> Challenge | None:
        return (
            db.query(Challenge)
            .join(Assessment)
            .options(selectinload(Challenge.test_cases))
            .filter(
                Challenge.id == challenge_id,
                Assessment.organization_id == organization_id,
            )
            .first()
        )

    @staticmethod
    def list_by_assessment(
        db: Session,
        assessment_id: uuid.UUID,
    ) -> list[Challenge]:
        return (
            db.query(Challenge)
            .filter(Challenge.assessment_id == assessment_id)
            .order_by(Challenge.order_index.asc())
            .all()
        )
