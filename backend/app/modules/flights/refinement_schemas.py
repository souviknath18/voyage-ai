
from typing import Literal

from pydantic import (
  BaseModel,
  ConfigDict,
  Field,
)
from app.modules.flights.schemas import TripFlightsResponse


class FlightRefinementPreferences(BaseModel):
  """
  Structured preferences extracted from
  the user's natural-language request.
  """

  model_config = ConfigDict(extra="forbid")

  sort_by: Literal[
    "cheapest",
    "fastest",
    "fewest_stops",
    "best",
  ] = "best"

  max_stops: int | None = Field(
    default=None,
    ge=0,
    le=5,
  )

  max_price: float | None = Field(
    default=None,
    gt=0,
  )

  preferred_airlines: list[str] = Field(
    default_factory=list,
  )

  excluded_airlines: list[str] = Field(
    default_factory=list,
  )

  departure_period: Literal[
    "morning",
    "afternoon",
    "evening",
    "night",
  ] | None = None

  avoid_overnight_layovers: bool = False


class FlightRefinementRequest(BaseModel):
  """
  Request submitted by the existing
  AI Refine Flights UI.
  """

  model_config = ConfigDict(extra="forbid")

  message: str = Field(
    min_length=3,
    max_length=1000,
  )


class FlightRefinementResponse(BaseModel):
  """
  Preferences and explanation returned
  to the frontend.
  """

  preferences: FlightRefinementPreferences

  explanation: str

  model_config = ConfigDict(extra="forbid")



class TripFlightsRefinementResponse(TripFlightsResponse):
  """
  Complete AI flight refinement response.

  Preserves the existing flight search response
  structure and adds AI refinement metadata.
  """

  model_config = ConfigDict(extra="forbid")

  preferences: FlightRefinementPreferences

  explanation: str = Field(
    min_length=1,
  )

  total_offers: int = Field(
    ge=0,
  )

  matching_offers: int = Field(
    ge=0,
  )