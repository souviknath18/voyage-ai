import uuid
from datetime import datetime

from pydantic import (
  BaseModel,
  Field,
)


class TripPreferenceCreate(BaseModel):
  pace: str = Field(
    default="balanced",
    min_length=1,
    max_length=20,
  )

  interests: list[str] = Field(
    default_factory=list,
  )

  ai_brief: str | None = Field(
    default=None,
    max_length=2000,
  )

  budget_level: int = Field(
    default=50,
    ge=0,
    le=100,
  )


class TripPreferenceUpdate(BaseModel):
  pace: str | None = Field(
    default=None,
    min_length=1,
    max_length=20,
  )

  interests: list[str] | None = None

  ai_brief: str | None = Field(
    default=None,
    max_length=2000,
  )

  budget_level: int | None = Field(
    default=None,
    ge=0,
    le=100,
  )


class TripPreferenceResponse(BaseModel):
  id: uuid.UUID
  trip_id: uuid.UUID

  pace: str
  interests: list[str]
  ai_brief: str | None
  budget_level: int

  created_at: datetime
  updated_at: datetime

  model_config = {
    "from_attributes": True,
  }