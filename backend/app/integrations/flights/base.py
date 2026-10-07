from typing import Protocol

from app.integrations.flights.schemas import (
  FlightOffer,
  FlightSearchRequest,
)


class FlightProvider(Protocol):
  async def search_flights(
    self,
    search: FlightSearchRequest,
  ) -> list[FlightOffer]:
    ...