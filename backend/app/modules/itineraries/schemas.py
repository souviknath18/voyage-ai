import uuid
from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel


class ItineraryItemResponse(BaseModel):

  id: uuid.UUID

  time: str

  duration_minutes: int | None = None

  title: str

  description: str

  location: str | None

  activity_type: str

  cost_category: str

  place_id: str | None

  estimated_cost: Decimal

  model_config = {
    "from_attributes": True,
  }


class ItineraryDayResponse(BaseModel):
  id: uuid.UUID
  day_number: int
  date: date
  title: str
  activities: list[ItineraryItemResponse]
  model_config = {"from_attributes": True}


class ItineraryVersionResponse(BaseModel):
  id: uuid.UUID
  agent_run_id: uuid.UUID

  version: int

  destination: str
  summary: str
  currency: str
  estimated_total_cost: Decimal

  created_at: datetime

  model_config = {
    "from_attributes": True,
  }


class ItineraryResponse(BaseModel):
  id: uuid.UUID
  trip_id: uuid.UUID
  agent_run_id: uuid.UUID

  destination: str
  summary: str
  currency: str
  estimated_total_cost: Decimal

  days: list[ItineraryDayResponse]
  validation_warnings: list[str] = []

  created_at: datetime
  updated_at: datetime

  version: int

  model_config = {"from_attributes": True}