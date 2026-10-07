from datetime import date
from decimal import Decimal

from pydantic import BaseModel


class FlightSearchRequest(BaseModel):
  origin: str
  destination: str

  departure_date: date
  return_date: date | None = None

  adults: int = 1
  cabin_class: str = "economy"


class FlightSegment(BaseModel):
  airline: str
  airline_code: str | None = None
  flight_number: str

  origin: str
  destination: str

  departure_at: str
  arrival_at: str

  duration: str | None = None
  cabin: str | None = None


class FlightSlice(BaseModel):
  origin: str
  destination: str

  departure_at: str
  arrival_at: str

  duration: str

  stops: int
  stop_description: str

  segments: list[FlightSegment]


class FlightOffer(BaseModel):
  id: str

  airline: str
  airline_code: str | None = None

  outbound: FlightSlice
  return_flight: FlightSlice | None = None

  baggage: str | None = None
  wifi: bool | None = None

  price: Decimal
  currency: str

  expires_at: str | None = None