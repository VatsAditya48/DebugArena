from fastapi import APIRouter

from app.api.v1.endpoints import auth, health


# Create the central API router
api_router = APIRouter()


# Register health-related endpoints
api_router.include_router(health.router)

# Register authentication-related endpoints
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
