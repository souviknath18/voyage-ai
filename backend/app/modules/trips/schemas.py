import uuid
from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, Field, model_validator


class TripCreate(BaseModel):
  origin: str = Field(
    min_length=2,
    max_length=255,
  )

  destination: str = Field(
    min_length=2,
    max_length=255,
  )

  start_date: date
  end_date: date

  travelers: int = Field(
    default=1,
    ge=1,
  )

  budget: Decimal | None = Field(
    default=None,
    gt=0,
  )

  currency: str = Field(
    default="INR",
    min_length=3,
    max_length=3,
  )

  @model_validator(mode="after")
  def validate_dates(self):
    if self.end_date <= self.start_date:
      raise ValueError(
        "end_date must be after start_date"
      )

    return self


class TripUpdate(BaseModel):
  origin: str | None = Field(
    default=None,
    min_length=2,
    max_length=255,
  )

  destination: str | None = Field(
    default=None,
    min_length=2,
    max_length=255,
  )

  start_date: date | None = None
  end_date: date | None = None

  travelers: int | None = Field(
    default=None,
    ge=1,
  )

  budget: Decimal | None = Field(
    default=None,
    gt=0,
  )

  currency: str | None = Field(
    default=None,
    min_length=3,
    max_length=3,
  )


class TripResponse(BaseModel):
  id: uuid.UUID
  trip_id: str
  user_id: uuid.UUID

  origin: str
  destination: str

  start_date: date
  end_date: date

  travelers: int
  budget: Decimal | None
  currency: str
  status: str

  created_at: datetime
  updated_at: datetime

  model_config = {
    "from_attributes": True,
  }

  origin_name: str | None = None
  origin_country: str | None = None
  origin_country_code: str | None = None
  origin_latitude: Decimal | None = None
  origin_longitude: Decimal | None = None
  origin_timezone: str | None = None

  destination_name: str | None = None
  destination_country: str | None = None
  destination_country_code: str | None = None
  destination_latitude: Decimal | None = None
  destination_longitude: Decimal | None = None
  destination_timezone: str | None = None


class TripDestinationRequest(BaseModel):
  name: str
  country: str
  country_code: str
  latitude: float
  longitude: float
  timezone: str | None = None