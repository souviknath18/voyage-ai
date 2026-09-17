import uuid

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.itineraries.models import Itinerary
from app.modules.itineraries.repository import (
  get_itinerary_by_trip_id,
)
from app.modules.trips.service import get_user_trip


async def get_trip_itinerary(
  db: AsyncSession,
  public_trip_id: str,
  user_id: uuid.UUID,
) -> Itinerary:
  # This also verifies that the trip belongs
  # to the authenticated user.
  trip = await get_user_trip(
    db=db,
    trip_id=public_trip_id,
    user_id=user_id,
  )

  itinerary = await get_itinerary_by_trip_id(
    db=db,
    trip_id=trip.id,
  )

  if itinerary is None:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND,
      detail="Itinerary not found",
    )

  return itinerary