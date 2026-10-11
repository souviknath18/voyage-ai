import uuid

from app.modules.trips.models import Trip
from decimal import Decimal
from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.places.models import TripPlace


async def replace_trip_places(
  db: AsyncSession,
  trip_id,
  places: list[dict[str, Any]],
) -> list[TripPlace]:
  """
  Refresh provider places for a trip while preserving
  bookmarked places and stable database IDs.
  """

  result = await db.execute(
    select(TripPlace).where(
      TripPlace.trip_id == trip_id
    )
  )

  existing = {
    (item.provider, item.provider_place_id): item
    for item in result.scalars().all()
  }

  incoming_keys = {
    (
      place.get("source", "geoapify"),
      str(place["provider_place_id"]),
    )
    for place in places
    if place.get("provider_place_id")
  }

  # Remove stale, unsaved places only.
  for key, item in existing.items():
    if key not in incoming_keys and not item.is_saved:
      await db.delete(item)

  stored_places: list[TripPlace] = []

  for place in places:
    provider_place_id = place.get(
      "provider_place_id"
    )

    if not provider_place_id:
      continue

    provider = place.get("source", "geoapify")

    key = (
      provider,
      str(provider_place_id),
    )

    trip_place = existing.get(key)

    if trip_place is None:
      trip_place = TripPlace(
        trip_id=trip_id,
        provider=provider,
        provider_place_id=str(provider_place_id),
      )
      db.add(trip_place)

    # Update metadata without resetting is_saved.
    trip_place.name = place["name"]

    trip_place.categories = place.get(
      "categories",
      [],
    )

    trip_place.address = place.get("address")

    trip_place.latitude = Decimal(
      str(place["latitude"])
    )

    trip_place.longitude = Decimal(
      str(place["longitude"])
    )

    trip_place.distance = (
      Decimal(str(place["distance"]))
      if place.get("distance") is not None
      else None
    )

    trip_place.search_group = place.get(
      "search_group"
    )

    stored_places.append(trip_place)

  await db.flush()

  return stored_places


async def get_trip_places(
  db: AsyncSession,
  trip_id,
) -> list[TripPlace]:
  result = await db.execute(
    select(TripPlace)
    .where(TripPlace.trip_id == trip_id)
    .order_by(TripPlace.distance.asc())
  )

  return list(result.scalars().all())


async def get_trip_place(
  db: AsyncSession,
  trip_id,
  place_id,
) -> TripPlace | None:
  result = await db.execute(
    select(TripPlace).where(
      TripPlace.trip_id == trip_id,
      TripPlace.id == place_id,
    )
  )

  return result.scalar_one_or_none()


async def get_saved_places_for_user(
  db: AsyncSession,
  user_id: uuid.UUID,
) -> list[tuple[TripPlace, Trip]]:
  """
  Get all saved places belonging to the
  authenticated user's trips.
  """

  result = await db.execute(
    select(TripPlace, Trip)
    .join(
      Trip,
      TripPlace.trip_id == Trip.id,
    )
    .where(
      Trip.user_id == user_id,
      TripPlace.is_saved.is_(True),
    )
    .order_by(
      TripPlace.created_at.desc(),
      TripPlace.id,
    )
  )

  return [
    (place, trip)
    for place, trip in result.all()
  ]