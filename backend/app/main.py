
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db


# Create the FastAPI application
app = FastAPI(
    title=settings.app_name,
    description="Backend API for the DebugArena assessment platform",
    version=settings.app_version,
)


# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Root endpoint
@app.get("/")
def home():
    return {
        "message": "Welcome to DebugArena!",
        "status": "Backend is running",
        "application": settings.app_name,
    }


# Application health check
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "application": settings.app_name,
        "environment": settings.environment,
    }


# Database health check
@app.get("/health/database")
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
