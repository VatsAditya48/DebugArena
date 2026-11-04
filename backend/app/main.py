
from fastapi import FastAPI
from app.core.exception_handlers import register_exception_handlers
from fastapi.middleware.cors import CORSMiddleware
from app.core.logging_config import configure_logging
from app.core.config import settings
from app.api.v1.router import api_router

logger = configure_logging(settings.environment)

logger.info("DebugArena logging initialized")
# Create the FastAPI application
app = FastAPI(
    title=settings.app_name,
    description="Backend API for the DebugArena technical assessment platform",
    version=settings.app_version,
)

# Register centralized exception handlers
register_exception_handlers(app)

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


# Register version 1 API routes
app.include_router(
    api_router,
    prefix="/api/v1",
)
