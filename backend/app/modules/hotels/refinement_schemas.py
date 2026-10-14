
from typing import Literal

from pydantic import (
  BaseModel,
  ConfigDict,
  Field,
)

from app.modules.hotels.schemas import TripHotelsResponse


class HotelRefinementPreferences(BaseModel):
  """
  Structured hotel preferences extracted
  from the user's natural-language request.
  """

  model_config = ConfigDict(extra="forbid")

  sort_by: Literal[
    "cheapest",
    "highest_rated",
    "best",
  ] = "best"

  max_total_price: float | None = Field(
    default=None,
    gt=0,
  )

  max_price_per_night: float | None = Field(
    default=None,
    gt=0,
  )

  min_rating: float | None = Field(
    default=None,
    ge=0,
    le=10,
  )

  min_star_rating: float | None = Field(
    default=None,
    ge=0,
    le=5,
  )

  refundable_only: bool = False

  breakfast_included: bool = False

  required_amenities: list[str] = Field(
    default_factory=list,
  )


class HotelRefinementRequest(BaseModel):
  """
  Natural-language hotel refinement request.
  """

  model_config = ConfigDict(extra="forbid")

  message: str = Field(
    min_length=3,
    max_length=1000,
  )


class TripHotelsRefinementResponse(TripHotelsResponse):
  """
  Hotel search response with AI refinement
  metadata.
  """

  model_config = ConfigDict(extra="forbid")

  preferences: HotelRefinementPreferences

  explanation: str = Field(
    min_length=1,
  )

  total_offers: int = Field(
    ge=0,
  )

  matching_offers: int = Field(
    ge=0,
  )