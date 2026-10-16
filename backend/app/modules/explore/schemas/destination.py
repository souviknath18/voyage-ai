
"""
Destination validation schemas for Vaycogo.

Validates normalized destination information
before database persistence.
"""

import re
from datetime import datetime
from uuid import UUID

from pydantic import (
  BaseModel,
  ConfigDict,
  Field,
  field_validator,
  model_validator,
)

from app.modules.explore.services.attribution import (
  format_image_artist,
)


class DestinationData(BaseModel):
  """Validated destination information."""

  model_config = ConfigDict(
    str_strip_whitespace=True,
    extra="forbid",
  )

  wikidata_id: str = Field(
    min_length=2,
    max_length=20,
  )

  name: str = Field(
    min_length=1,
    max_length=200,
  )

  country: str = Field(
    min_length=1,
    max_length=200,
  )

  country_code: str = Field(
    min_length=3,
    max_length=3,
  )

  latitude: float = Field(
    ge=-90,
    le=90,
    allow_inf_nan=False,
  )

  longitude: float = Field(
    ge=-180,
    le=180,
    allow_inf_nan=False,
  )

  source: str = Field(
    default="wikidata",
  )

  country_source: str = Field(
    default="natural_earth",
  )

  @field_validator("wikidata_id")
  @classmethod
  def validate_wikidata_id(
    cls,
    value: str,
  ) -> str:
    if not re.fullmatch(
      r"Q[1-9][0-9]*",
      value,
    ):
      raise ValueError(
        "Invalid Wikidata identifier."
      )

    return value

  @field_validator("country_code")
  @classmethod
  def validate_country_code(
    cls,
    value: str,
  ) -> str:
    value = value.upper()

    if not re.fullmatch(
      r"[A-Z]{3}",
      value,
    ):
      raise ValueError(
        "Country code must contain "
        "three letters."
      )

    return value

  @field_validator("source")
  @classmethod
  def validate_source(
    cls,
    value: str,
  ) -> str:
    if value != "wikidata":
      raise ValueError(
        "Unsupported destination source."
      )

    return value

  @field_validator("country_source")
  @classmethod
  def validate_country_source(
    cls,
    value: str,
  ) -> str:
    if value != "natural_earth":
      raise ValueError(
        "Unsupported country source."
      )

    return value

  @model_validator(mode="after")
  def validate_coordinates(self):
    if (
      self.latitude == 0
      and self.longitude == 0
    ):
      raise ValueError(
        "Coordinates (0, 0) require "
        "manual verification."
      )

    return self


class ExploreDestinationResponse(BaseModel):
  model_config = ConfigDict(from_attributes=True)

  id: UUID
  wikidata_id: str
  name: str
  country: str
  country_code: str
  latitude: float
  longitude: float
  source: str
  country_source: str

  # Destination description
  description: str | None = None
  description_source: str | None = None

  # Destination image
  image_url: str | None = None
  image_source: str | None = None

  # Wikimedia attribution
  image_artist: str | None = None
  image_page_url: str | None = None
  image_license: str | None = None
  image_license_url: str | None = None

  created_at: datetime
  updated_at: datetime

  @field_validator("image_artist", mode="before")
  @classmethod
  def sanitize_image_artist(
    cls,
    value: str | None,
  ) -> str | None:
    return format_image_artist(value)


class ExploreDestinationListResponse(BaseModel):
  items: list[ExploreDestinationResponse]
  total: int = Field(ge=0)
  limit: int = Field(ge=1, le=100)
  offset: int = Field(ge=0)