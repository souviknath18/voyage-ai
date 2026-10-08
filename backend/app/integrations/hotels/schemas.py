
from datetime import date
from decimal import Decimal

from pydantic import BaseModel, Field


class HotelSearchRequest(BaseModel):
  latitude: float
  longitude: float

  check_in: date
  check_out: date

  adults: int = Field(default=1, ge=1)
  rooms: int = Field(default=1, ge=1)
  currency: str = "USD"
  guest_nationality: str = "IN"


class HotelRoom(BaseModel):
  id: str
  name: str

  description: str | None = None
  bed_type: str | None = None
  board_type: str | None = None

  refundable: bool | None = None
  cancellation_policy: str | None = None


class HotelOffer(BaseModel):
  id: str
  hotel_id: str

  name: str
  address: str | None = None

  latitude: float | None = None
  longitude: float | None = None

  rating: float | None = None
  star_rating: float | None = None

  image_url: str | None = None
  amenities: list[str] = Field(default_factory=list)

  room: HotelRoom

  check_in: date
  check_out: date
  nights: int

  total_price: Decimal
  currency: str

  price_per_night: Decimal | None = None