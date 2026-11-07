
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


# Locate the backend directory
BACKEND_DIR = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):

    # Configuration for reading environment variables
    model_config = SettingsConfigDict(
        env_file=BACKEND_DIR / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
        
    )

    # Application information
    app_name: str = "DebugArena API"
    app_version: str = "0.1.0"
    environment: str = "development"
    database_url: str
    cors_origins: str = "http://localhost:5173"

    # Frontend URLs allowed to communicate with the backend
    cors_origins: str = "http://localhost:5173"

    @property
    def cors_origin_list(self) -> list[str]:
        return [
            origin.strip()
            for origin in self.cors_origins.split(",")
            if origin.strip()
        ]


# Create one shared settings object
settings = Settings()
