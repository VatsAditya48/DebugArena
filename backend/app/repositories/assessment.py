import uuid

from sqlalchemy.orm import Session

from app.models.assessment import Assessment


class AssessmentRepository:

    @staticmethod
    def create(db: Session, assessment: Assessment) -> Assessment:
        db.add(assessment)
        db.flush()
        return assessment

    @staticmethod
    def get_by_id(
        db: Session,
        assessment_id: uuid.UUID,
        organization_id: uuid.UUID,
    ) -> Assessment | None:
        return (
            db.query(Assessment)
            .filter(
                Assessment.id == assessment_id,
                Assessment.organization_id == organization_id,
            )
            .first()
        )

    @staticmethod
    def list_by_organization(
        db: Session,
        organization_id: uuid.UUID,
    ) -> list[Assessment]:
        return (
            db.query(Assessment)
            .filter(Assessment.organization_id == organization_id)
            .order_by(Assessment.created_at.desc())
            .all()
        )

    @staticmethod
    def delete(db: Session, assessment: Assessment) -> None:
        db.delete(assessment)
