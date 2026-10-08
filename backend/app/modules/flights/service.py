import uuid
from decimal import Decimal, ROUND_HALF_UP
import httpx
from dataclasses import dataclass
from datetime import date

from fastapi import (
  HTTPException,
  status,
)
from sqlalchemy.ext.asyncio import AsyncSession

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
)
from app.modules.flights.ranking import (
  FlightCandidate,
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

  search = FlightSearchRequest(
    origin=origin_code,
    destination=destination_code,
    departure_date=trip.start_date,
    return_date=trip.end_date,
    adults=trip.travelers,
    cabin_class="economy",
  )

  offers = await provider.search_flights(
    search
  )

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

  for offer in offers:
    source_currency = (
      offer.currency.upper()
    )

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
  trip = await get_user_trip(
    db=db,
    trip_id=public_trip_id,
    user_id=user_id,
  )

  try:
    result = (
      await search_trip_flight_candidates(
        trip
      )
    )

    converted_offers = []

    for candidate in result[
      "candidates"
    ]:
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

  return {
    "trip_id": trip.trip_id,

    "origin": result["origin"],
    "destination": result[
      "destination"
    ],

    "origin_code": result[
      "origin_code"
    ],
    "destination_code": result[
      "destination_code"
    ],

    "travelers": trip.travelers,
    "start_date": trip.start_date,
    "end_date": trip.end_date,

    "currency": result["currency"],

    "offers": converted_offers,
  }


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