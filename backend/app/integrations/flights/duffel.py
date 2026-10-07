from decimal import Decimal
from typing import Any

import httpx

from app.core.config import settings
from app.integrations.flights.schemas import (
  FlightOffer,
  FlightSearchRequest,
  FlightSegment,
  FlightSlice,
)


TIMEOUT_SECONDS = 30.0


class DuffelFlightProvider:
  def __init__(self) -> None:
    self.base_url = (
      settings.duffel_api_base_url.rstrip("/")
    )

    self.headers = {
      "Authorization": (
        f"Bearer {settings.duffel_access_token}"
      ),
      "Duffel-Version": (
        settings.duffel_api_version
      ),
      "Accept": "application/json",
      "Content-Type": "application/json",
    }

  async def search_flights(
    self,
    search: FlightSearchRequest,
  ) -> list[FlightOffer]:
    slices = [
      {
        "origin": search.origin,
        "destination": search.destination,
        "departure_date": (
          search.departure_date.isoformat()
        ),
      }
    ]

    if search.return_date:
        slices.append(
          {
            "origin": search.destination,
            "destination": search.origin,
            "departure_date": (
              search.return_date.isoformat()
            ),
          }
        )

    passengers = [
      {
        "type": "adult",
      }
      for _ in range(search.adults)
    ]

    payload = {
      "data": {
        "slices": slices,
        "passengers": passengers,
        "cabin_class": (
          search.cabin_class
        ),
      }
    }

    async with httpx.AsyncClient(
      timeout=TIMEOUT_SECONDS,
    ) as client:
      response = await client.post(
        f"{self.base_url}/air/offer_requests",
        headers=self.headers,
        json=payload,
      )

      response.raise_for_status()

      data = response.json()

    offers = (
      data.get("data", {})
      .get("offers", [])
    )

    return [
      self._normalize_offer(offer)
      for offer in offers
    ]

  async def get_offer(
    self,
    offer_id: str,
  ) -> FlightOffer:
    async with httpx.AsyncClient(
      timeout=TIMEOUT_SECONDS,
    ) as client:
      response = await client.get(
        f"{self.base_url}/air/offers/{offer_id}",
        headers=self.headers,
      )

      response.raise_for_status()

      data = response.json()

    offer = data.get("data")

    if not offer:
      raise ValueError(
        "Duffel offer was not found."
      )

    return self._normalize_offer(
      offer
    )

  def _normalize_offer(
    self,
    offer: dict[str, Any],
  ) -> FlightOffer:
    slices = offer.get(
      "slices",
      [],
    )

    if not slices:
      raise ValueError(
        "Duffel offer contains no slices."
      )

    owner = offer.get(
      "owner",
      {},
    )

    airline_name = (
      owner.get("name")
      or "Unknown airline"
    )

    airline_code = owner.get(
      "iata_code"
    )

    outbound = self._normalize_slice(
      slices[0]
    )

    return_flight = None

    if len(slices) > 1:
      return_flight = self._normalize_slice(
        slices[1]
      )

    return FlightOffer(
      id=offer["id"],

      airline=airline_name,
      airline_code=airline_code,

      outbound=outbound,
      return_flight=return_flight,

      baggage=None,
      wifi=None,

      price=Decimal(
        offer.get(
          "total_amount",
          "0",
        )
      ),

      currency=offer.get(
        "total_currency",
        "",
      ),

      expires_at=offer.get(
        "expires_at"
      ),
    )

  @staticmethod
  def _build_flight_number(
    segment: dict[str, Any],
  ) -> str:
    carrier = segment.get(
      "marketing_carrier",
      {},
    )

    code = (
      carrier.get("iata_code")
      or ""
    )

    number = (
      segment.get(
        "marketing_carrier_flight_number"
      )
      or ""
    )

    return f"{code}{number}".strip()

  @staticmethod
  def _build_stop_description(
    segments: list[dict[str, Any]],
  ) -> str | None:
    if len(segments) <= 1:
      return "Non-stop"

    stop_names = []

    for segment in segments[:-1]:
      destination = segment.get(
        "destination",
        {},
      )

      stop_names.append(
        destination.get(
          "iata_code",
          "",
        )
      )

    stop_names = [
      stop
      for stop in stop_names
      if stop
    ]

    if not stop_names:
      return (
        f"{len(segments) - 1} stop"
      )

    return (
      f"{len(stop_names)} stop"
      f"{'s' if len(stop_names) > 1 else ''}"
      f" via {', '.join(stop_names)}"
    )


  async def resolve_place(
    self,
    query: str,
    country_code: str | None = None,
    latitude: float | None = None,
    longitude: float | None = None,
  ) -> str:
    async with httpx.AsyncClient(
      timeout=TIMEOUT_SECONDS,
    ) as client:

      # Prefer coordinates because trip locations
      # already contain latitude / longitude.
      if latitude is not None and longitude is not None:
        response = await client.get(
          f"{self.base_url}/places/suggestions",
          headers=self.headers,
          params={
            "lat": latitude,
            "lng": longitude,
            "rad": 100000,
          },
        )

        response.raise_for_status()

        places = response.json().get(
          "data",
          [],
        )

        airport_code = self._select_airport(
          places=places,
          country_code=country_code,
        )

        if airport_code:
          return airport_code

      # Fallback to text search.
      response = await client.get(
        f"{self.base_url}/places/suggestions",
        headers=self.headers,
        params={
          "query": query,
        },
      )

      response.raise_for_status()

      places = response.json().get(
        "data",
        [],
      )

      airport_code = self._select_airport(
        places=places,
        country_code=country_code,
      )

      if airport_code:
        return airport_code

    raise ValueError(
      f"No flight location found for {query}."
    )


  @staticmethod
  def _select_airport(
    places: list[dict[str, Any]],
    country_code: str | None = None,
  ) -> str | None:
    if not places:
      return None

    expected_country = (
      country_code.upper()
      if country_code
      else None
    )

    for place in places:
        place_country = (
          place.get(
            "iata_country_code",
            "",
          ).upper()
        )

        if (
          expected_country
          and place_country != expected_country
        ):
          continue

        if place.get("type") == "airport":
          iata_code = place.get("iata_code")

          if iata_code:
            return iata_code

        if place.get("type") == "city":
          airports = place.get(
            "airports",
            [],
          )

          if airports:
            iata_code = airports[0].get(
              "iata_code"
            )

            if iata_code:
              return iata_code

    return None


  def _normalize_slice(
    self,
    flight_slice: dict[str, Any],
  ) -> FlightSlice:
    raw_segments = flight_slice.get(
      "segments",
      [],
    )

    if not raw_segments:
      raise ValueError(
        "Duffel flight slice contains no segments."
      )

    segments = [
      self._normalize_segment(segment)
      for segment in raw_segments
    ]

    first_segment = segments[0]
    last_segment = segments[-1]

    stops = max(
      len(segments) - 1,
      0,
    )

    return FlightSlice(
      origin=first_segment.origin,
      destination=last_segment.destination,

      departure_at=(
        first_segment.departure_at
      ),
      arrival_at=(
        last_segment.arrival_at
      ),

      duration=flight_slice.get(
        "duration",
        "",
      ),

      stops=stops,

      stop_description=(
        self._build_stop_description(
          raw_segments
        )
        or "Non-stop"
      ),

      segments=segments,
    )


  def _normalize_segment(
    self,
    segment: dict[str, Any],
  ) -> FlightSegment:
    marketing_carrier = segment.get(
      "marketing_carrier",
      {},
    )

    passengers = segment.get(
      "passengers",
      [],
    )

    cabin = None

    if passengers:
      cabin = passengers[0].get(
        "cabin_class"
      )

    return FlightSegment(
      airline=(
        marketing_carrier.get("name")
        or "Unknown airline"
      ),

      airline_code=(
        marketing_carrier.get(
          "iata_code"
        )
      ),

      flight_number=(
        self._build_flight_number(
          segment
        )
      ),

      origin=(
        segment.get(
          "origin",
          {},
        ).get(
          "iata_code",
          "",
        )
      ),

      destination=(
        segment.get(
          "destination",
          {},
        ).get(
          "iata_code",
          "",
        )
      ),

      departure_at=segment.get(
        "departing_at",
        "",
      ),

      arrival_at=segment.get(
        "arriving_at",
        "",
      ),

      duration=segment.get(
        "duration"
      ),

      cabin=cabin,
    )