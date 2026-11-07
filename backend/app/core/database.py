
from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import settings


# 1. Create the SQLAlchemy engine
engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,
)


# 2. Create the database session factory
SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
)


# 3. Provide a database session to FastAPI
def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()
