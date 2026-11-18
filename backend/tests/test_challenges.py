import uuid

from app.api.deps import get_current_user
from app.main import app
from app.models.assessment import Assessment
from app.models.challenge import Challenge
from app.models.organization import Organization
from app.models.user import User


def create_assessment(client):
    response = client.post(
        "/api/v1/assessments",
        json={
            "title": "DSA Assessment",
            "language": "Python",
            "difficulty": "medium",
            "duration_minutes": 60,
            "question_count": 2,
        },
    )
    assert response.status_code == 201
    return response.json()["id"]


def create_challenge(client, assessment_id):
    return client.post(
        "/api/v1/challenges",
        json={
            "assessment_id": assessment_id,
            "title": "Two Sum",
            "description": "Find two numbers that add up to the target.",
            "constraints": "2 <= nums.length <= 10000",
            "starter_code": "def two_sum(nums, target):",
            "order_index": 0,
            "test_cases": [
                {
                    "input": "[2, 7, 11, 15], 9",
                    "expected_output": "[0, 1]",
                    "is_hidden": False,
                    "points": 5,
                },
                {
                    "input": "[3, 2, 4], 6",
                    "expected_output": "[1, 2]",
                    "is_hidden": True,
                    "points": 5,
                },
            ],
        },
    )


def test_create_challenge_with_test_cases(client):
    assessment_id = create_assessment(client)

    response = create_challenge(client, assessment_id)

    assert response.status_code == 201

    data = response.json()
    assert data["title"] == "Two Sum"
    assert data["assessment_id"] == assessment_id
    assert len(data["test_cases"]) == 2
    assert {case["is_hidden"] for case in data["test_cases"]} == {
        False, True
    }


def test_get_challenge(client):
    assessment_id = create_assessment(client)
    create_response = create_challenge(client, assessment_id)
    challenge_id = create_response.json()["id"]

    response = client.get(f"/api/v1/challenges/{challenge_id}")

    assert response.status_code == 200
    assert response.json()["title"] == "Two Sum"
    assert len(response.json()["test_cases"]) == 2


def test_update_challenge(client):
    assessment_id = create_assessment(client)
    create_response = create_challenge(client, assessment_id)
    challenge_id = create_response.json()["id"]

    response = client.patch(
        f"/api/v1/challenges/{challenge_id}",
        json={"title": "Updated Two Sum"},
    )

    assert response.status_code == 200
    assert response.json()["title"] == "Updated Two Sum"


def test_empty_challenge_patch_returns_422(client):
    assessment_id = create_assessment(client)
    create_response = create_challenge(client, assessment_id)
    challenge_id = create_response.json()["id"]

    response = client.patch(
        f"/api/v1/challenges/{challenge_id}",
        json={},
    )

    assert response.status_code == 422


def test_challenge_creation_rejected_for_published_assessment(client):
    assessment_id = create_assessment(client)

    create_challenge(client, assessment_id)

    publish_response = client.post(
        f"/api/v1/assessments/{assessment_id}/publish"
    )
    assert publish_response.status_code == 200

    response = create_challenge(client, assessment_id)

    assert response.status_code == 409


def test_challenge_update_rejected_for_published_assessment(client):
    assessment_id = create_assessment(client)
    create_response = create_challenge(client, assessment_id)
    challenge_id = create_response.json()["id"]

    publish_response = client.post(
        f"/api/v1/assessments/{assessment_id}/publish"
    )
    assert publish_response.status_code == 200

    response = client.patch(
        f"/api/v1/challenges/{challenge_id}",
        json={"title": "Unauthorized Update"},
    )

    assert response.status_code == 409


def test_challenge_from_another_organization_returns_404(
    client, db, recruiter
):
    other_org = Organization(
        name="Other Organization",
        slug=f"other-{uuid.uuid4().hex[:8]}",
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
        question_count=1,
    )
    db.add(assessment)
    db.flush()

    challenge = Challenge(
        assessment_id=assessment.id,
        title="Private Challenge",
        description="This challenge belongs to another organization.",
    )
    db.add(challenge)
    db.commit()

    response = client.get(
        f"/api/v1/challenges/{challenge.id}"
    )

    assert response.status_code == 404


def test_candidate_cannot_access_recruiter_challenge_api(
    client, db
):
    candidate = User(
        email=f"candidate-{uuid.uuid4().hex[:8]}@test.com",
        password_hash="test-hash",
        full_name="Test Candidate",
        is_active=True,
    )
    db.add(candidate)
    db.commit()

    previous_override = app.dependency_overrides[get_current_user]
    app.dependency_overrides[get_current_user] = lambda: candidate

    try:
        response = client.post(
            "/api/v1/challenges",
            json={
                "assessment_id": str(uuid.uuid4()),
                "title": "Unauthorized Challenge",
                "description": "Should not be created.",
            },
        )
    finally:
        app.dependency_overrides[get_current_user] = previous_override

    assert response.status_code == 403



def make_candidate(db, recruiter):
    from app.models.organization_membership import OrganizationMembership

    membership = (
        db.query(OrganizationMembership)
        .filter(OrganizationMembership.user_id == recruiter.id)
        .first()
    )
    membership.role = "candidate"
    db.commit()


def test_candidate_receives_public_test_cases_only(client, db, recruiter):
    assessment_id = create_assessment(client)
    challenge_response = create_challenge(client, assessment_id)
    challenge_id = challenge_response.json()["id"]

    publish = client.post(
        f"/api/v1/assessments/{assessment_id}/publish"
    )
    assert publish.status_code == 200

    make_candidate(db, recruiter)

    response = client.get(
        f"/api/v1/challenges/assessment/{assessment_id}/candidate"
    )

    assert response.status_code == 200
    data = response.json()

    assert len(data) == 1
    assert data[0]["id"] == challenge_id
    assert len(data[0]["test_cases"]) == 1

    public_case = data[0]["test_cases"][0]
    assert public_case["input"] == "[2, 7, 11, 15], 9"
    assert public_case["expected_output"] == "[0, 1]"

    response_text = response.text
    assert "[3, 2, 4], 6" not in response_text
    assert "[1, 2]" not in response_text
    assert "is_hidden" not in response_text


def test_recruiter_cannot_access_candidate_challenge_endpoint(
    client, recruiter
):
    response = client.get(
        f"/api/v1/challenges/assessment/{uuid.uuid4()}/candidate"
    )

    assert response.status_code == 403


def test_candidate_cannot_access_draft_assessment(
    client, db, recruiter
):
    assessment_id = create_assessment(client)
    create_challenge(client, assessment_id)

    make_candidate(db, recruiter)

    response = client.get(
        f"/api/v1/challenges/assessment/{assessment_id}/candidate"
    )

    assert response.status_code == 404


def test_recruiter_still_receives_hidden_test_cases(
    client,
):
    assessment_id = create_assessment(client)
    challenge_response = create_challenge(client, assessment_id)
    challenge_id = challenge_response.json()["id"]

    response = client.get(
        f"/api/v1/challenges/{challenge_id}"
    )

    assert response.status_code == 200
    cases = response.json()["test_cases"]

    assert len(cases) == 2
    assert {case["is_hidden"] for case in cases} == {False, True}


def test_candidate_endpoint_requires_authentication(
    unauthenticated_client,
):
    response = unauthenticated_client.get(
        f"/api/v1/challenges/assessment/{uuid.uuid4()}/candidate"
    )

    assert response.status_code in (401, 403)
