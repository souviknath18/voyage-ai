
import hashlib
import json
import logging
import httpx
from datetime import date
from decimal import Decimal, ROUND_HALF_UP

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.encoders import jsonable_encoder

from time import perf_counter

from app.core.cache import cache_get, cache_set
from app.modules.hotels.schemas import TripHotelsResponse

logger = logging.getLogger(__name__)

from app.core.config import settings
from app.integrations.hotels.liteapi import (
  LiteAPIHotelProvider,
)
from app.integrations.hotels.schemas import (
  HotelSearchRequest,
)
from app.modules.trips.service import (
  get_user_trip,
)
from app.integrations.currency.frankfurter import (
  FrankfurterCurrencyProvider,
)
from app.modules.hotels.schemas import ConvertedHotelOffer
from app.modules.hotels.ranking import (
  HOTEL_BUDGET_SHARE,
  rank_hotels,
)


async def search_and_rank_hotels(
  *,
  latitude: float,
  longitude: float,
  check_in: date,
  check_out: date,
  travelers: int,
  currency: str,
  budget: Decimal | None,
):
  if check_out <= check_in:
    raise HTTPException(
      status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
      detail="Invalid hotel stay dates",
    )

  if not settings.liteapi_api_key:
    raise HTTPException(
      status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
      detail="Hotel provider is not configured",
    )

  provider = LiteAPIHotelProvider(
    api_key=settings.liteapi_api_key,
    base_url=settings.liteapi_base_url,
  )

  search = HotelSearchRequest(
    latitude=latitude,
    longitude=longitude,
    check_in=check_in,
    check_out=check_out,
    adults=travelers,
    rooms=1,
    currency="USD",
    guest_nationality="IN",
  )

  try:
    search_started = perf_counter()

    try:
      offers = await provider.search_hotels(search)
    finally:
      logger.info(
        "[Hotels] LiteAPI search: %.0fms",
        (perf_counter() - search_started) * 1000,
      )

    target_currency = currency.upper()
    currency_provider = FrankfurterCurrencyProvider()

    exchange_rates: dict[
      tuple[str, str], Decimal
    ] = {}

    converted_offers = []

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

      exchange_rate = exchange_rates[rate_key]

      converted_price = (
        offer.total_price * exchange_rate
      ).quantize(
        Decimal("0.01"),
        rounding=ROUND_HALF_UP,
      )

      converted_price_per_night = (
        converted_price / Decimal(offer.nights)
      ).quantize(
        Decimal("0.01"),
        rounding=ROUND_HALF_UP,
      )

      converted_offers.append({
        **offer.model_dump(),
        "converted_price": converted_price,
        "converted_price_per_night": (
          converted_price_per_night
        ),
        "converted_currency": target_currency,
        "exchange_rate": exchange_rate,
      })

  except httpx.HTTPError as exc:
    raise HTTPException(
      status_code=status.HTTP_502_BAD_GATEWAY,
      detail="Hotel search or currency service failed",
    ) from exc

  except ValueError as exc:
    raise HTTPException(
      status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
      detail=str(exc),
    ) from exc

  ranked_offers = rank_hotels(
    offers=[
      ConvertedHotelOffer.model_validate(offer)
      for offer in converted_offers
    ],
    trip_budget=budget,
  )

  hotel_budget = (
    (budget * HOTEL_BUDGET_SHARE).quantize(
      Decimal("0.01"),
      rounding=ROUND_HALF_UP,
    )
    if budget is not None
    else None
  )

  recommended_hotel_id = (
    ranked_offers[0]["id"]
    if ranked_offers
    else None
  )

  return {
    "currency": target_currency,
    "hotel_budget": hotel_budget,
    "recommended_hotel_id": recommended_hotel_id,
    "offers": ranked_offers,
  }


def build_hotel_cache_key(trip) -> str:
  params = {
    "provider": "liteapi",
    "version": 1,
    "trip_id": str(trip.id),
    "latitude": str(trip.destination_latitude),
    "longitude": str(trip.destination_longitude),
    "check_in": trip.start_date.isoformat(),
    "check_out": trip.end_date.isoformat(),
    "travelers": trip.travelers,
    "currency": trip.currency,
    "budget": str(trip.budget),
  }

  serialized = json.dumps(
    params,
    sort_keys=True,
  )

  digest = hashlib.sha256(
    serialized.encode("utf-8")
  ).hexdigest()

  return f"voyageai:hotels:search:v1:{digest}"


async def get_trip_hotels(
  db: AsyncSession,
  public_trip_id: str,
  user_id,
  *,
  use_cache: bool = True,
):
  trip = await get_user_trip(
    db=db,
    trip_id=public_trip_id,
    user_id=user_id,
  )

  if trip is None:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND,
      detail="Trip not found",
    )

  if (
    trip.destination_latitude is None
    or trip.destination_longitude is None
  ):
    raise HTTPException(
      status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
      detail="Trip destination coordinates are missing",
    )

  cache_key = build_hotel_cache_key(trip)

  # 1. Check Redis for normal display searches.
  if use_cache:
    cached_result = await cache_get(cache_key)

    if cached_result is not None:
      # Validate cached data against the API schema.
      try:
        return TripHotelsResponse.model_validate(
          cached_result
        ).model_dump(mode="json")
      except ValueError:
        logger.warning(
          "[Hotels] Invalid cached response"
        )

  # 2. Cache miss: search LiteAPI.
  result = await search_and_rank_hotels(
    latitude=float(trip.destination_latitude),
    longitude=float(trip.destination_longitude),
    check_in=trip.start_date,
    check_out=trip.end_date,
    travelers=trip.travelers,
    currency=trip.currency,
    budget=trip.budget,
  )

  response = {
    "trip_id": trip.trip_id,
    "destination": trip.destination,
    "travelers": trip.travelers,
    "check_in": trip.start_date,
    "check_out": trip.end_date,
    **result,
  }

  # 3. Serialize dates and Decimals safely.
  serialized_response = jsonable_encoder(response)

  # 4. Cache successful display results.
  if use_cache:
    await cache_set(
      key=cache_key,
      value=serialized_response,
      ttl_seconds=settings.hotel_cache_ttl_seconds,
    )

  return serialized_response