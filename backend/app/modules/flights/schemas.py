import uuid

from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel


class FlightSegmentResponse(BaseModel):
  airline: str
  airline_code: str | None = None
  flight_number: str

  origin: str
  destination: str

  departure_at: str
  arrival_at: str

  duration: str | None = None
  cabin: str | None = None


class FlightSliceResponse(BaseModel):
  origin: str
  destination: str

  departure_at: str
  arrival_at: str

  duration: str

  stops: int
  stop_description: str

  segments: list[FlightSegmentResponse]


class FlightOfferResponse(BaseModel):
  id: str

  airline: str
  airline_code: str | None = None

  outbound: FlightSliceResponse
  return_flight: FlightSliceResponse | None = None

  baggage: str | None = None
  wifi: bool | None = None

  price: Decimal
  currency: str

  converted_price: Decimal
  converted_currency: str
  exchange_rate: Decimal

  expires_at: str | None = None


class TripFlightsResponse(BaseModel):
  trip_id: str

  origin: str
  destination: str

  origin_code: str
  destination_code: str

  travelers: int
  start_date: date
  end_date: date

  currency: str

  offers: list[FlightOfferResponse]


class SelectFlightRequest(BaseModel):
  offer_id: str


class SelectedFlightResponse(BaseModel):
  id: uuid.UUID
  trip_id: uuid.UUID

  provider: str
  provider_offer_id: str

  airline: str
  airline_code: str | None = None

  original_price: Decimal
  original_currency: str

  converted_price: Decimal
  converted_currency: str
  exchange_rate: Decimal

  outbound: dict
  return_flight: dict | None = None

  baggage: str | None = None
  expires_at: str | None = None

  selected_at: datetime
  updated_at: datetime

  model_config = {
    "from_attributes": True,
  }