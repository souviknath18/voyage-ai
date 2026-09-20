from decimal import Decimal
from typing import Any

from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.places.models import TripPlace


async def replace_trip_places(
  db: AsyncSession,
  trip_id,
  places: list[dict[str, Any]],
) -> list[TripPlace]:
  """
  Replace the stored provider places for a trip
  with the places used by the latest planning run.
  """

  await db.execute(
    delete(TripPlace).where(
      TripPlace.trip_id == trip_id
    )
  )

  stored_places: list[TripPlace] = []

  for place in places:
    provider_place_id = place.get(
      "provider_place_id"
    )

    # We need a real provider identity for
    # itinerary-to-place linking.
    if not provider_place_id:
      continue

    trip_place = TripPlace(
      trip_id=trip_id,
      provider=place.get(
        "source",
        "geoapify",
      ),
      provider_place_id=(
        provider_place_id
      ),
      name=place["name"],
      categories=place.get(
        "categories",
        [],
      ),
      address=place.get(
        "address"
      ),
      latitude=Decimal(
        str(place["latitude"])
      ),
      longitude=Decimal(
        str(place["longitude"])
      ),
      distance=(
        Decimal(
          str(place["distance"])
        )
        if place.get("distance")
        is not None
        else None
      ),
      search_group=place.get(
        "search_group"
      ),
    )

    db.add(trip_place)

    stored_places.append(
      trip_place
    )

  await db.flush()

  return stored_places


async def get_trip_places(
  db: AsyncSession,
  trip_id,
) -> list[TripPlace]:
  result = await db.execute(
    select(TripPlace)
    .where(
      TripPlace.trip_id == trip_id
    )
    .order_by(
      TripPlace.distance.asc()
    )
  )

  return list(
    result.scalars().all()
  )