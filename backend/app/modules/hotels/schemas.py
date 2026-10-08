from uuid import UUID
from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict

from app.integrations.hotels.schemas import HotelOffer


class ConvertedHotelOffer(HotelOffer):
  converted_price: Decimal
  converted_price_per_night: Decimal
  converted_currency: str
  exchange_rate: Decimal


class RankedHotelOffer(ConvertedHotelOffer):
  rank: int
  ranking_score: float
  within_hotel_budget: bool | None = None


class TripHotelsResponse(BaseModel):
  trip_id: str
  destination: str
  travelers: int

  check_in: date
  check_out: date

  currency: str

  hotel_budget: Decimal | None = None
  recommended_hotel_id: str | None = None

  offers: list[RankedHotelOffer]


class SelectHotelRequest(BaseModel):
  offer_id: str


class SelectedHotelResponse(BaseModel):
  model_config = ConfigDict(from_attributes=True)

  id: UUID
  trip_id: UUID
  provider: str
  provider_offer_id: str
  hotel_id: str
  hotel_name: str

  original_price: Decimal
  original_currency: str

  converted_price: Decimal
  converted_currency: str
  exchange_rate: Decimal

  hotel_snapshot: dict
  selected_at: datetime
  updated_at: datetime