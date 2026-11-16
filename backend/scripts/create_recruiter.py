
from getpass import getpass

from app.core.database import SessionLocal
from app.core.security import hash_password
from app.models.organization import Organization
from app.models.organization_membership import OrganizationMembership
from app.models.user import User
from app.schemas.auth import UserRegister


def create_recruiter():
    print("\n=== DebugArena Recruiter Setup ===")

    email = input("Recruiter email: ").strip()
    full_name = input("Recruiter full name: ").strip()
    password = getpass("Password: ")
    confirm = getpass("Confirm password: ")

    if password != confirm:
        raise SystemExit("Passwords do not match.")

    payload = UserRegister(
        email=email,
        full_name=full_name,
        password=password,
    )

    with SessionLocal() as db:
        existing = (
            db.query(User)
            .filter(User.email == payload.email)
            .first()
        )

        if existing:
            raise SystemExit("This email is already registered.")

        try:
            organization = (
                db.query(Organization)
                .filter(
                    Organization.slug == "debugarena-hq"
                )
                .first()
            )

            if organization and not organization.is_active:
                raise ValueError("Organization is inactive.")

            if organization is None:
                organization = Organization(
                    name="DebugArena HQ",
                    slug="debugarena-hq",
                    is_active=True,
                )
                db.add(organization)
                db.flush()

            recruiter = User(
                email=payload.email,
                full_name=payload.full_name,
                password_hash=hash_password(payload.password),
                is_active=True,
            )

            db.add(recruiter)
            db.flush()

            membership = OrganizationMembership(
                user_id=recruiter.id,
                organization_id=organization.id,
                role="recruiter",
            )

            db.add(membership)
            db.commit()

            print("\nRecruiter created successfully!")
            print(f"Email: {recruiter.email}")
            print("Role: recruiter")

        except Exception:
            db.rollback()
            raise


if __name__ == "__main__":
    create_recruiter()
