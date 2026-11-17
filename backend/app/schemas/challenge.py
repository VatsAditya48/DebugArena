import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator


class TestCaseCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    input: str
    expected_output: str
    is_hidden: bool = False
    points: int = Field(default=1, ge=1)


class TestCaseResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    input: str
    expected_output: str
    is_hidden: bool
    points: int
    created_at: datetime


class ChallengeCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    assessment_id: uuid.UUID
    title: str = Field(min_length=1, max_length=200)
    description: str = Field(min_length=1)
    constraints: str | None = None
    starter_code: str | None = None
    order_index: int = Field(default=0, ge=0)
    test_cases: list[TestCaseCreate] = Field(default_factory=list)

    @field_validator("title", "description")
    @classmethod
    def strip_required_strings(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("This field cannot be blank")
        return value

    @field_validator("constraints", "starter_code")
    @classmethod
    def clean_optional_strings(cls, value: str | None) -> str | None:
        if value is None:
            return None
        return value.strip() or None


class ChallengeUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    title: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = Field(default=None, min_length=1)
    constraints: str | None = None
    starter_code: str | None = None
    order_index: int | None = Field(default=None, ge=0)

    @field_validator("title", "description")
    @classmethod
    def strip_required_strings(cls, value: str | None) -> str | None:
        if value is None:
            return None
        value = value.strip()
        if not value:
            raise ValueError("This field cannot be blank")
        return value

    @field_validator("constraints", "starter_code")
    @classmethod
    def clean_optional_strings(cls, value: str | None) -> str | None:
        if value is None:
            return None
        return value.strip() or None


class ChallengeResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    assessment_id: uuid.UUID
    title: str
    description: str
    constraints: str | None
    starter_code: str | None
    order_index: int
    test_cases: list[TestCaseResponse]
    created_at: datetime
    updated_at: datetime



class CandidateTestCaseResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    input: str
    expected_output: str
    points: int


class CandidateChallengeResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    assessment_id: uuid.UUID
    title: str
    description: str
    constraints: str | None
    starter_code: str | None
    order_index: int
    test_cases: list[CandidateTestCaseResponse]
