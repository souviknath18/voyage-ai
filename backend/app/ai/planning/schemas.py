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


class GeneratedItinerary(BaseModel):
  destination: str
  summary: str
  currency: str
  days: list[ItineraryDay]
  estimated_total_cost: float = Field(
    ge=0,
  )