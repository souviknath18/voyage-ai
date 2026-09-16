from pydantic import BaseModel, Field


class ItineraryActivity(BaseModel):
  time: str = Field(
    description="Suggested local time, for example 09:00"
  )

  title: str

  description: str

  location: str | None = None

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