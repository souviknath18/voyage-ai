from typing import Literal
from pydantic import BaseModel, Field


CostCategory = Literal[
  "food",
  "transport",
  "activity",
  "shopping",
  "other",
]


class ItineraryActivity(BaseModel):
  time: str
  duration_minutes: int | None = Field(
    default=None,
    ge=1,
    le=1440,
    description=(
      "Estimated activity duration in minutes. "
      "Use null when the duration is unknown."
    ),
  )
  title: str
  description: str
  location: str | None = None
  activity_type: Literal[
    "verified_place",
    "generic",
  ]
  place_id: str | None = None
  cost_category: CostCategory
  estimated_cost: float = Field(
    default=0,
    ge=0,
  )


class ItineraryDay(BaseModel):
  day_number: int = Field(
    ge=1,
  )
  date: str
  title: str
  activities: list[ItineraryActivity]


class GeneratedItineraryDay(BaseModel):
  day: ItineraryDay


class GeneratedItinerary(BaseModel):
  destination: str
  summary: str
  currency: str
  days: list[ItineraryDay]
  estimated_total_cost: float = Field(
    ge=0,
  )