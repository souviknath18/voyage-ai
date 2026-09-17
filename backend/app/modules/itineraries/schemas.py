import uuid
from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel


class ItineraryItemResponse(BaseModel):
  id: uuid.UUID
  time: str
  title: str
  description: str
  location: str | None
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


class ItineraryResponse(BaseModel):
  id: uuid.UUID
  trip_id: uuid.UUID
  agent_run_id: uuid.UUID

  destination: str
  summary: str
  currency: str
  estimated_total_cost: Decimal

  days: list[ItineraryDayResponse]

  created_at: datetime
  updated_at: datetime

  model_config = {"from_attributes": True}