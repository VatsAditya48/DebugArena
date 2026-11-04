
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db


# Create a router for health-related endpoints
router = APIRouter(tags=["Health"])


# Application health check
@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "application": settings.app_name,
        "environment": settings.environment,
    }


# Database health check
@router.get("/health/database")
def database_health(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))

        return {
            "status": "healthy",
            "database": "connected",
        }

    except SQLAlchemyError:
        raise HTTPException(
            status_code=503,
            detail="Database connection unavailable",
        )
