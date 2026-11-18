import pytest

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.api.deps import get_current_user
from app.core.database import get_db
from app.models import Base
from app.models.organization import Organization
from app.models.organization_membership import OrganizationMembership
from app.models.user import User


@pytest.fixture
def db():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )

    Base.metadata.create_all(bind=engine)

    TestingSessionLocal = sessionmaker(
        bind=engine,
        autoflush=False,
        autocommit=False,
    )

    session = TestingSessionLocal()

    yield session

    session.close()
    Base.metadata.drop_all(bind=engine)
    engine.dispose()


@pytest.fixture
def recruiter(db):
    organization = Organization(
        name="DebugArena HQ",
        slug="debugarena-hq",
        is_active=True,
    )

    user = User(
        email="recruiter@test.com",
        password_hash="test-hash",
        full_name="Test Recruiter",
        is_active=True,
    )

    db.add_all([organization, user])
    db.flush()

    membership = OrganizationMembership(
        user_id=user.id,
        organization_id=organization.id,
        role="recruiter",
    )

    db.add(membership)
    db.commit()

    return user


@pytest.fixture
def client(db, recruiter):
    previous_overrides = app.dependency_overrides.copy()

    def override_get_db():
        yield db

    def override_get_current_user():
        return recruiter

    app.dependency_overrides[get_db] = override_get_db
    app.dependency_overrides[get_current_user] = override_get_current_user

    try:
        with TestClient(app) as test_client:
            yield test_client
    finally:
        app.dependency_overrides.clear()
        app.dependency_overrides.update(previous_overrides)


@pytest.fixture
def unauthenticated_client(db):
    previous_overrides = app.dependency_overrides.copy()

    def override_get_db():
        yield db

    app.dependency_overrides[get_db] = override_get_db

    try:
        with TestClient(app) as test_client:
            yield test_client
    finally:
        app.dependency_overrides.clear()
        app.dependency_overrides.update(previous_overrides)
