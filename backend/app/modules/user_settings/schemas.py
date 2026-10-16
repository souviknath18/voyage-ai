
from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class UserSettingsUpdate(BaseModel):
  """Fields that a user can update."""

  phone: str | None = Field(
    default=None,
    max_length=30,
  )
  home_city: str | None = Field(
    default=None,
    max_length=255,
  )
  preferred_airport: str | None = Field(
    default=None,
    max_length=255,
  )

  currency: str | None = Field(
    default=None,
    min_length=3,
    max_length=3,
  )
  region: str | None = Field(
    default=None,
    min_length=2,
    max_length=10,
  )

  travel_pace: Literal[
    "relaxed",
    "balanced",
    "packed",
  ] | None = None

  accommodation_preferences: list[str] | None = None

  dietary_requirement: str | None = Field(
    default=None,
    max_length=100,
  )

  email_notifications: bool | None = None
  trip_updates: bool | None = None
  price_alerts: bool | None = None
  weather_alerts: bool | None = None
  ai_activity_alerts: bool | None = None
  marketing_emails: bool | None = None


class UserSettingsResponse(BaseModel):
  """Settings returned to the frontend."""

  model_config = ConfigDict(from_attributes=True)

  user_id: UUID

  phone: str | None
  home_city: str | None
  preferred_airport: str | None

  currency: str
  region: str
  travel_pace: str
  accommodation_preferences: list[str]
  dietary_requirement: str

  email_notifications: bool
  trip_updates: bool
  price_alerts: bool
  weather_alerts: bool
  ai_activity_alerts: bool
  marketing_emails: bool

  created_at: datetime
  updated_at: datetime