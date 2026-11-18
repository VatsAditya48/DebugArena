import uuid
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator


Difficulty = Literal["easy", "medium", "hard"]
AssessmentStatus = Literal["draft", "published"]


class AssessmentCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    title: str = Field(min_length=1, max_length=200)
    description: str | None = None
    language: str = Field(min_length=1, max_length=30)
    difficulty: Difficulty
    duration_minutes: int = Field(ge=5)
    question_count: int = Field(ge=1)

    @field_validator("title", "language")
    @classmethod
    def strip_required_strings(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("This field cannot be blank")
        return value

    @field_validator("description")
    @classmethod
    def clean_description(cls, value: str | None) -> str | None:
        if value is None:
            return None
        value = value.strip()
        return value or None


class AssessmentUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    title: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = None
    language: str | None = Field(default=None, min_length=1, max_length=30)
    difficulty: Difficulty | None = None
    duration_minutes: int | None = Field(default=None, ge=5)
    question_count: int | None = Field(default=None, ge=1)

    @field_validator("title", "language")
    @classmethod
    def strip_required_strings(cls, value: str | None) -> str | None:
        if value is None:
            return None
        value = value.strip()
        if not value:
            raise ValueError("This field cannot be blank")
        return value

    @field_validator("description")
    @classmethod
    def clean_description(cls, value: str | None) -> str | None:
        if value is None:
            return None
        value = value.strip()
        return value or None


class AssessmentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    title: str
    description: str | None
    language: str
    difficulty: str
    duration_minutes: int
    question_count: int
    status: AssessmentStatus
    created_at: datetime
    updated_at: datetime
