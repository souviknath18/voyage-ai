import uuid

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.places.models import TripPlace
from app.modules.places.repository import (
  get_trip_places,
  get_trip_place,
)
from app.modules.trips.service import get_user_trip
from app.modules.places.repository import get_saved_places_for_user
from app.modules.places.schemas import (
  TripPlaceResponse,
  SavedTripPlaceResponse,
)


async def get_places_for_trip(
  db: AsyncSession,
  public_trip_id: str,
  user_id: uuid.UUID,
) -> list[TripPlace]:

  # Verify that the trip belongs to the current user.
  trip = await get_user_trip(
    db=db,
    trip_id=public_trip_id,
    user_id=user_id,
  )

  return await get_trip_places(
    db=db,
    trip_id=trip.id,
  )


async def set_place_saved_for_trip(
  db: AsyncSession,
  public_trip_id: str,
  user_id: uuid.UUID,
  place_id: uuid.UUID,
  is_saved: bool,
) -> TripPlace:

  trip = await get_user_trip(
    db=db,
    trip_id=public_trip_id,
    user_id=user_id,
  )

  place = await get_trip_place(
    db=db,
    trip_id=trip.id,
    place_id=place_id,
  )

  if place is None:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND,
      detail="Place not found",
    )

  place.is_saved = is_saved

  await db.commit()
  await db.refresh(place)

  return place


async def get_user_saved_places(
  db: AsyncSession,
  user_id: uuid.UUID,
) -> list[SavedTripPlaceResponse]:
  """
  Return saved places across all trips
  owned by the authenticated user.
  """

  records = await get_saved_places_for_user(
    db=db,
    user_id=user_id,
  )

  return [
    SavedTripPlaceResponse(
      **TripPlaceResponse.model_validate(
        place
      ).model_dump(),
      trip_id=trip.trip_id,
      destination=trip.destination,
      destination_name=trip.destination_name,
      destination_country=trip.destination_country,
    )
    for place, trip in records
  ]