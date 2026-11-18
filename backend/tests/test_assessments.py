import uuid

from app.models.assessment import Assessment
from app.models.challenge import Challenge
from app.models.test_case import TestCase
from app.models.organization_membership import OrganizationMembership


VALID_ASSESSMENT = {
    "title": "Python Fundamentals",
    "description": "Basic Python assessment",
    "language": "Python",
    "difficulty": "easy",
    "duration_minutes": 30,
    "question_count": 10,
}



def add_challenge(db, assessment_id, with_test_case=True):
    challenge = Challenge(
        assessment_id=uuid.UUID(str(assessment_id)),
        title="Two Sum",
        description="Find two numbers that add up to the target.",
        order_index=0,
    )
    db.add(challenge)
    db.flush()

    if with_test_case:
        db.add(TestCase(
            challenge_id=challenge.id,
            input="[2, 7, 11, 15], 9",
            expected_output="[0, 1]",
            is_hidden=False,
            points=1,
        ))

    db.commit()
    return challenge


def test_create_assessment(client):
    response = client.post(
        "/api/v1/assessments",
        json=VALID_ASSESSMENT,
    )

    assert response.status_code == 201
    data = response.json()

    assert data["title"] == "Python Fundamentals"
    assert data["status"] == "draft"
    assert data["duration_minutes"] == 30
    assert data["question_count"] == 10


def test_list_assessments(client):
    client.post("/api/v1/assessments", json=VALID_ASSESSMENT)

    response = client.get("/api/v1/assessments")

    assert response.status_code == 200
    assert len(response.json()) == 1


def test_update_draft_assessment(client):
    created = client.post(
        "/api/v1/assessments",
        json=VALID_ASSESSMENT,
    ).json()

    response = client.patch(
        f"/api/v1/assessments/{created['id']}",
        json={"title": "Updated Python Assessment"},
    )

    assert response.status_code == 200
    assert response.json()["title"] == "Updated Python Assessment"


def test_publish_assessment(client, db):
    created = client.post(
        "/api/v1/assessments",
        json=VALID_ASSESSMENT,
    ).json()

    add_challenge(db, created["id"])

    response = client.post(
        f"/api/v1/assessments/{created['id']}/publish"
    )

    assert response.status_code == 200
    assert response.json()["status"] == "published"



def test_cannot_publish_assessment_without_challenges(client):
    created = client.post(
        "/api/v1/assessments",
        json=VALID_ASSESSMENT,
    ).json()

    response = client.post(
        f"/api/v1/assessments/{created['id']}/publish"
    )

    assert response.status_code == 422
    assert client.get(
        f"/api/v1/assessments/{created['id']}"
    ).json()["status"] == "draft"


def test_cannot_publish_challenge_without_test_cases(client, db):
    created = client.post(
        "/api/v1/assessments",
        json=VALID_ASSESSMENT,
    ).json()

    add_challenge(db, created["id"], with_test_case=False)

    response = client.post(
        f"/api/v1/assessments/{created['id']}/publish"
    )

    assert response.status_code == 422
    assert "at least one test case" in response.json()["error"]["message"]
    assert client.get(
        f"/api/v1/assessments/{created['id']}"
    ).json()["status"] == "draft"


def test_published_assessment_cannot_be_updated(client, db):
    created = client.post(
        "/api/v1/assessments",
        json=VALID_ASSESSMENT,
    ).json()

    assessment_id = created["id"]
    add_challenge(db, assessment_id)

    client.post(
        f"/api/v1/assessments/{assessment_id}/publish"
    )

    response = client.patch(
        f"/api/v1/assessments/{assessment_id}",
        json={"title": "Should Fail"},
    )

    assert response.status_code == 409


def test_published_assessment_cannot_be_deleted(client, db):
    created = client.post(
        "/api/v1/assessments",
        json=VALID_ASSESSMENT,
    ).json()

    assessment_id = created["id"]
    add_challenge(db, assessment_id)

    client.post(
        f"/api/v1/assessments/{assessment_id}/publish"
    )

    response = client.delete(
        f"/api/v1/assessments/{assessment_id}"
    )

    assert response.status_code == 409


def test_delete_draft_assessment(client):
    created = client.post(
        "/api/v1/assessments",
        json=VALID_ASSESSMENT,
    ).json()

    response = client.delete(
        f"/api/v1/assessments/{created['id']}"
    )

    assert response.status_code == 204


def test_candidate_cannot_create_assessment(client, db, recruiter):
    membership = (
        db.query(OrganizationMembership)
        .filter(OrganizationMembership.user_id == recruiter.id)
        .first()
    )
    membership.role = "candidate"
    db.commit()

    response = client.post(
        "/api/v1/assessments",
        json=VALID_ASSESSMENT,
    )

    assert response.status_code == 403


def test_assessment_from_another_organization_is_hidden(
    client, db, recruiter
):
    other_org = __import__(
        "app.models.organization", fromlist=["Organization"]
    ).Organization(
        name="Another Organization",
        slug="another-organization",
        is_active=True,
    )
    db.add(other_org)
    db.flush()

    assessment = Assessment(
        organization_id=other_org.id,
        created_by=recruiter.id,
        title="Private Assessment",
        language="Python",
        difficulty="easy",
        duration_minutes=30,
        question_count=5,
        status="draft",
    )
    db.add(assessment)
    db.commit()

    response = client.get(
        f"/api/v1/assessments/{assessment.id}"
    )

    assert response.status_code == 404


def test_invalid_assessment_data(client):
    invalid_data = {
        **VALID_ASSESSMENT,
        "duration_minutes": 2,
    }

    response = client.post(
        "/api/v1/assessments",
        json=invalid_data,
    )

    assert response.status_code == 422


def test_unauthenticated_user_cannot_access_assessments(
    unauthenticated_client,
):
    response = unauthenticated_client.get("/api/v1/assessments")

    assert response.status_code in (401, 403)


def test_list_only_returns_own_organization_assessments(
    client, db, recruiter
):
    from app.models.organization import Organization

    other_org = Organization(
        name="Other Organization",
        slug="other-org",
        is_active=True,
    )
    db.add(other_org)
    db.flush()

    db.add(Assessment(
        organization_id=other_org.id,
        created_by=recruiter.id,
        title="Other Org Assessment",
        language="Python",
        difficulty="easy",
        duration_minutes=30,
        question_count=5,
    ))
    db.commit()

    response = client.get("/api/v1/assessments")

    assert response.status_code == 200
    assert response.json() == []


def test_cannot_update_or_delete_another_organizations_assessment(
    client, db, recruiter
):
    from app.models.organization import Organization

    other_org = Organization(
        name="Other Organization",
        slug="other-org",
        is_active=True,
    )
    db.add(other_org)
    db.flush()

    assessment = Assessment(
        organization_id=other_org.id,
        created_by=recruiter.id,
        title="Private Assessment",
        language="Python",
        difficulty="easy",
        duration_minutes=30,
        question_count=5,
    )
    db.add(assessment)
    db.commit()

    assessment_id = assessment.id

    update_response = client.patch(
        f"/api/v1/assessments/{assessment_id}",
        json={"title": "Unauthorized Update"},
    )
    delete_response = client.delete(
        f"/api/v1/assessments/{assessment_id}"
    )

    assert update_response.status_code == 404
    assert delete_response.status_code == 404


def test_empty_patch_returns_422(client, recruiter):
    response = client.post(
        "/api/v1/assessments",
        json={
            "title": "Test Assessment",
            "language": "Python",
            "difficulty": "easy",
            "duration_minutes": 30,
            "question_count": 5,
        },
    )
    assessment_id = response.json()["id"]

    patch_response = client.patch(
        f"/api/v1/assessments/{assessment_id}",
        json={},
    )

    assert patch_response.status_code == 422


def test_blank_title_is_rejected(client):
    response = client.post(
        "/api/v1/assessments",
        json={
            "title": "   ",
            "language": "Python",
            "difficulty": "easy",
            "duration_minutes": 30,
            "question_count": 5,
        },
    )

    assert response.status_code == 422


def test_blank_language_is_rejected(client):
    response = client.post(
        "/api/v1/assessments",
        json={
            "title": "Test Assessment",
            "language": "   ",
            "difficulty": "easy",
            "duration_minutes": 30,
            "question_count": 5,
        },
    )

    assert response.status_code == 422
