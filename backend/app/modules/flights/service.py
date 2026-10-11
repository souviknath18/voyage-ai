import uuid
import hashlib
import json
from decimal import Decimal, ROUND_HALF_UP
import asyncio
import httpx
import logging
from time import perf_counter
from dataclasses import dataclass
from datetime import date, datetime, timezone

logger = logging.getLogger(__name__)

from fastapi import (
  HTTPException,
  status,
)
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.encoders import jsonable_encoder

from app.core.cache import cache_get, cache_set
from app.modules.flights.schemas import TripFlightsResponse

from app.integrations.flights.duffel import (
  DuffelFlightProvider,
)
from app.integrations.flights.schemas import (
  FlightSearchRequest,
)
from app.modules.trips.service import (
  get_user_trip,
)
from app.integrations.currency.frankfurter import (
  FrankfurterCurrencyProvider,
)
from app.modules.flights.repository import (
  get_selected_flight,
  save_selected_flight,
  delete_selected_flight,
)
from app.modules.flights.ranking import (
  FlightCandidate,
  rank_flights,
)

@dataclass
class FlightTripContext:
  origin: str
  origin_name: str | None
  origin_country_code: str | None
  origin_latitude: Decimal | float | None
  origin_longitude: Decimal | float | None

  destination: str
  destination_name: str | None
  destination_country_code: str | None
  destination_latitude: Decimal | float | None
  destination_longitude: Decimal | float | None

  start_date: date
  end_date: date
  travelers: int
  currency: str


def log_flight_time(label: str, started: float) -> None:
  logger.warning(
    "[Flights] %s: %.0fms",
    label,
    (perf_counter() - started) * 1000,
  )


FLIGHT_CACHE_MAX_TTL_SECONDS = 30
FLIGHT_CACHE_EXPIRY_BUFFER_SECONDS = 5
FLIGHT_RESPONSE_MAX_OFFERS = 30
AIRPORT_CACHE_TTL_SECONDS = 24 * 60 * 60


def build_flight_cache_key(trip) -> str:
  params = {
    "provider": "duffel",
    "version": 2,
    "trip_id": str(trip.id),
    "origin": trip.origin,
    "origin_name": trip.origin_name,
    "origin_country_code": trip.origin_country_code,
    "origin_latitude": str(trip.origin_latitude),
    "origin_longitude": str(trip.origin_longitude),
    "destination": trip.destination,
    "destination_name": trip.destination_name,
    "destination_country_code": trip.destination_country_code,
    "destination_latitude": str(trip.destination_latitude),
    "destination_longitude": str(trip.destination_longitude),
    "departure": trip.start_date.isoformat(),
    "return": trip.end_date.isoformat(),
    "travelers": trip.travelers,
    "cabin_class": "economy",
    "currency": trip.currency.upper(),
  }

  digest = hashlib.sha256(
    json.dumps(params, sort_keys=True).encode("utf-8")
  ).hexdigest()

  return f"voyageai:flights:search:v2:{digest}"


def get_flight_cache_ttl(offers: list[dict]) -> int:
  now = datetime.now(timezone.utc)
  ttl = FLIGHT_CACHE_MAX_TTL_SECONDS

  if not offers:
    return 0

  for offer in offers:
    raw_expiry = offer.get("expires_at")

    # Don't cache offers without a verifiable expiration.
    if not raw_expiry:
      return 0

    try:
      expires_at = datetime.fromisoformat(
        raw_expiry.replace("Z", "+00:00")
      )
    except (TypeError, ValueError, AttributeError):
      return 0

    if expires_at.tzinfo is None:
      return 0

    remaining = int(
      (expires_at - now).total_seconds()
    ) - FLIGHT_CACHE_EXPIRY_BUFFER_SECONDS

    ttl = min(ttl, remaining)

  return max(0, ttl)


async def resolve_airport_cached(
  provider: DuffelFlightProvider,
  query: str,
  country_code: str | None = None,
  latitude: float | None = None,
  longitude: float | None = None,
) -> str:
  params = {
    "provider": "duffel",
    "version": 1,
    "query": query.strip().casefold(),
    "country_code": (
      country_code.upper()
      if country_code
      else None
    ),
    "latitude": latitude,
    "longitude": longitude,
  }

  digest = hashlib.sha256(
    json.dumps(
      params,
      sort_keys=True,
    ).encode("utf-8")
  ).hexdigest()

  cache_key = (
    f"voyageai:flights:airport:v1:{digest}"
  )

  cached_code = await cache_get(cache_key)

  if (
    isinstance(cached_code, str)
    and len(cached_code) == 3
    and cached_code.isalpha()
  ):
    logger.warning(
      "[Flights] AIRPORT CACHE HIT: %s -> %s",
      query,
      cached_code,
    )
    return cached_code

  logger.warning(
    "[Flights] AIRPORT CACHE MISS: %s",
    query,
  )

  airport_code = await provider.resolve_place(
    query=query,
    country_code=country_code,
    latitude=latitude,
    longitude=longitude,
  )

  if (
    isinstance(airport_code, str)
    and len(airport_code) == 3
    and airport_code.isalpha()
  ):
    airport_code = airport_code.upper()

    await cache_set(
      key=cache_key,
      value=airport_code,
      ttl_seconds=AIRPORT_CACHE_TTL_SECONDS,
    )

    logger.warning(
      "[Flights] AIRPORT CACHE STORED: %s -> %s",
      query,
      airport_code,
    )

  return airport_code


async def search_trip_flight_candidates(
  trip,
) -> dict:
  provider = DuffelFlightProvider()

  origin_name = (
    trip.origin_name
    or trip.origin
  )

  destination_name = (
    trip.destination_name
    or trip.destination
  )

  started = perf_counter()

  origin_code, destination_code = await asyncio.gather(
    resolve_airport_cached(
      provider=provider,
      query=origin_name,
      country_code=trip.origin_country_code,
      latitude=(
        float(trip.origin_latitude)
        if trip.origin_latitude is not None
        else None
      ),
      longitude=(
        float(trip.origin_longitude)
        if trip.origin_longitude is not None
        else None
      ),
    ),
    resolve_airport_cached(
      provider=provider,
      query=destination_name,
      country_code=trip.destination_country_code,
      latitude=(
        float(trip.destination_latitude)
        if trip.destination_latitude is not None
        else None
      ),
      longitude=(
        float(trip.destination_longitude)
        if trip.destination_longitude is not None
        else None
      ),
    ),
  )

  log_flight_time("Airport resolution", started)

  search = FlightSearchRequest(
    origin=origin_code,
    destination=destination_code,
    departure_date=trip.start_date,
    return_date=trip.end_date,
    adults=trip.travelers,
    cabin_class="economy",
  )

  started = perf_counter()

  offers = await provider.search_flights(search)

  log_flight_time("Duffel search", started)

  currency_provider = (
    FrankfurterCurrencyProvider()
  )

  target_currency = (
    trip.currency.upper()
  )

  exchange_rates: dict[
    tuple[str, str],
    Decimal,
  ] = {}

  candidates: list[
    FlightCandidate
  ] = []

  started = perf_counter()

  for offer in offers:
    source_currency = offer.currency.upper()

    rate_key = (
      source_currency,
      target_currency,
    )

    if rate_key not in exchange_rates:
      exchange_rates[rate_key] = (
        await currency_provider.get_rate(
          source_currency=source_currency,
          target_currency=target_currency,
        )
      )

    exchange_rate = (
      exchange_rates[rate_key]
    )

    converted_price = (
      offer.price * exchange_rate
    ).quantize(
      Decimal("0.01"),
      rounding=ROUND_HALF_UP,
    )

    candidates.append(
      FlightCandidate(
        offer=offer,
        converted_price=converted_price,
        converted_currency=target_currency,
        exchange_rate=exchange_rate,
      )
    )

  log_flight_time("Currency conversion", started)

  return {
    "origin": origin_name,
    "destination": destination_name,

    "origin_code": origin_code,
    "destination_code": destination_code,

    "currency": target_currency,

    "candidates": candidates,
  }

async def get_trip_flights(
  db: AsyncSession,
  public_trip_id: str,
  user_id: uuid.UUID,
) -> dict:
  total_started = perf_counter()
  started = perf_counter()

  trip = await get_user_trip(
    db=db,
    trip_id=public_trip_id,
    user_id=user_id,
  )
  log_flight_time("Trip lookup", started)

  cache_key = build_flight_cache_key(trip)

  logger.warning(
    "[Flights] CACHE KEY: %s",
    cache_key,
  )

  cached_result = await cache_get(cache_key)

  if cached_result is not None:
    try:
      validated = TripFlightsResponse.model_validate(
        cached_result
      )

      cached_offers = cached_result.get("offers", [])

      if get_flight_cache_ttl(cached_offers) > 0:
        logger.warning("[Flights] CACHE HIT")
        log_flight_time(
          "TOTAL flight search (cached)",
          total_started,
        )
        return validated.model_dump(mode="json")

    except (ValueError, TypeError, AttributeError):
      logger.warning("[Flights] Invalid cached response")

  logger.warning("[Flights] CACHE MISS")

  try:
    result = (
      await search_trip_flight_candidates(
        trip
      )
    )

    ranked_candidates = rank_flights(
      result["candidates"]
    )

    shortlisted_candidates = ranked_candidates[
      :FLIGHT_RESPONSE_MAX_OFFERS
    ]

    logger.warning(
      "[Flights] OFFERS: %s total -> %s shortlisted",
      len(result["candidates"]),
      len(shortlisted_candidates),
    )

    converted_offers = []

    for candidate in shortlisted_candidates:
      offer = candidate.offer

      converted_offers.append({
        **offer.model_dump(),

        "converted_price": (
          candidate.converted_price
        ),

        "converted_currency": (
          candidate.converted_currency
        ),

        "exchange_rate": (
          candidate.exchange_rate
        ),
      })

  except httpx.HTTPStatusError as exc:
    raise HTTPException(
      status_code=(
        status.HTTP_502_BAD_GATEWAY
      ),
      detail=(
        "Flight provider request failed."
      ),
    ) from exc

  except httpx.RequestError as exc:
    raise HTTPException(
      status_code=(
        status.HTTP_503_SERVICE_UNAVAILABLE
      ),
      detail=(
        "Flight provider is currently "
        "unavailable."
      ),
    ) from exc

  except ValueError as exc:
    raise HTTPException(
      status_code=(
        status.HTTP_422_UNPROCESSABLE_ENTITY
      ),
      detail=str(exc),
    ) from exc

  response = {
    "trip_id": trip.trip_id,
    "origin": result["origin"],
    "destination": result["destination"],
    "origin_code": result["origin_code"],
    "destination_code": result["destination_code"],
    "travelers": trip.travelers,
    "start_date": trip.start_date,
    "end_date": trip.end_date,
    "currency": result["currency"],
    "offers": converted_offers,
  }

  serialized_response = jsonable_encoder(response)

  ttl = get_flight_cache_ttl(
    serialized_response["offers"]
  )

  if ttl > 0:
    await cache_set(
      key=cache_key,
      value=serialized_response,
      ttl_seconds=ttl,
    )
    logger.warning(
      "[Flights] CACHE STORED: %ss",
      ttl,
    )
  else:
    logger.warning(
      "[Flights] CACHE SKIPPED: offer expiration unavailable or too close"
    )

  log_flight_time("TOTAL flight search", total_started)

  return serialized_response


async def select_trip_flight(
  db: AsyncSession,
  public_trip_id: str,
  user_id: uuid.UUID,
  offer_id: str,
):
  # 1. Verify the trip exists and belongs to this user.
  trip = await get_user_trip(
    db=db,
    trip_id=public_trip_id,
    user_id=user_id,
  )

  provider = DuffelFlightProvider()

  try:
    # 2. Fetch the latest authoritative offer
    # directly from Duffel.
    offer = await provider.get_offer(
      offer_id=offer_id,
    )

    if offer.expires_at:
      try:
        expires_at = datetime.fromisoformat(
          offer.expires_at.replace("Z", "+00:00")
        )
      except ValueError as exc:
        raise HTTPException(
          status_code=status.HTTP_502_BAD_GATEWAY,
          detail="Flight provider returned an invalid offer expiration.",
        ) from exc

      if expires_at.tzinfo is None:
        raise HTTPException(
          status_code=status.HTTP_502_BAD_GATEWAY,
          detail="Flight provider returned an expiration without timezone.",
        )

      if expires_at <= datetime.now(timezone.utc):
        raise HTTPException(
          status_code=status.HTTP_409_CONFLICT,
          detail=(
            "This flight offer has expired. "
            "Please search for updated flights."
          ),
        )

    # 3. Resolve the trip airports again so we can
    # verify that this offer belongs to this trip.
    origin_name = (
      trip.origin_name
      or trip.origin
    )

    destination_name = (
      trip.destination_name
      or trip.destination
    )

    origin_code = await provider.resolve_place(
      query=origin_name,
      country_code=trip.origin_country_code,
      latitude=(
        float(trip.origin_latitude)
        if trip.origin_latitude is not None
        else None
      ),
      longitude=(
        float(trip.origin_longitude)
        if trip.origin_longitude is not None
        else None
      ),
    )

    destination_code = await provider.resolve_place(
      query=destination_name,
      country_code=trip.destination_country_code,
      latitude=(
        float(trip.destination_latitude)
        if trip.destination_latitude is not None
        else None
      ),
      longitude=(
        float(trip.destination_longitude)
        if trip.destination_longitude is not None
        else None
      ),
    )

    # 4. Validate outbound route.
    if (
      offer.outbound.origin != origin_code
      or offer.outbound.destination
      != destination_code
    ):
      raise HTTPException(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        detail=(
          "Selected flight does not match "
          "this trip route."
        ),
      )

    # 5. Validate return route for round trips.
    if offer.return_flight is None:
      raise HTTPException(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        detail=(
          "Selected flight does not contain "
          "the required return journey."
        ),
      )

    if (
      offer.return_flight.origin
      != destination_code
      or offer.return_flight.destination
      != origin_code
    ):
      raise HTTPException(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        detail=(
          "Selected return flight does not "
          "match this trip route."
        ),
      )

    # 6. Convert the authoritative Duffel price
    # into the trip currency.
    currency_provider = (
      FrankfurterCurrencyProvider()
    )

    source_currency = (
      offer.currency.upper()
    )

    target_currency = (
      trip.currency.upper()
    )

    exchange_rate = (
      await currency_provider.get_rate(
        source_currency=source_currency,
        target_currency=target_currency,
      )
    )

    converted_price = (
      offer.price * exchange_rate
    ).quantize(
      Decimal("0.01"),
      rounding=ROUND_HALF_UP,
    )

    # 7. Persist a snapshot.
    selected = await save_selected_flight(
      db=db,
      trip_id=trip.id,

      provider="duffel",
      provider_offer_id=offer.id,

      airline=offer.airline,
      airline_code=offer.airline_code,

      original_price=offer.price,
      original_currency=source_currency,

      converted_price=converted_price,
      converted_currency=target_currency,
      exchange_rate=exchange_rate,

      outbound=offer.outbound.model_dump(
        mode="json",
      ),

      return_flight=(
        offer.return_flight.model_dump(
          mode="json",
        )
        if offer.return_flight
        else None
      ),

      baggage=offer.baggage,
      expires_at=offer.expires_at,
    )

    return selected

  except HTTPException:
    raise

  except httpx.HTTPStatusError as exc:
    if exc.response.status_code == 404:
      raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=(
          "Flight offer was not found or "
          "is no longer available."
        ),
      ) from exc

    raise HTTPException(
      status_code=status.HTTP_502_BAD_GATEWAY,
      detail=(
        "Flight provider request failed."
      ),
    ) from exc

  except httpx.RequestError as exc:
    raise HTTPException(
      status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
      detail=(
        "Flight provider is currently "
        "unavailable."
      ),
    ) from exc

  except ValueError as exc:
    raise HTTPException(
      status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
      detail=str(exc),
    ) from exc


async def get_trip_selected_flight(
  db: AsyncSession,
  public_trip_id: str,
  user_id: uuid.UUID,
):
  trip = await get_user_trip(
    db=db,
    trip_id=public_trip_id,
    user_id=user_id,
  )

  return await get_selected_flight(
    db=db,
    trip_id=trip.id,
  )


async def clear_trip_selected_flight(
  db: AsyncSession,
  public_trip_id: str,
  user_id: uuid.UUID,
) -> bool:
  trip = await get_user_trip(
    db=db,
    trip_id=public_trip_id,
    user_id=user_id,
  )

  return await delete_selected_flight(
    db=db,
    trip_id=trip.id,
  )