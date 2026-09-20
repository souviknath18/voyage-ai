import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.places.models import (
  TripPlace,
)
from app.modules.places.repository import (
  get_trip_places,
)
from app.modules.trips.service import (
  get_user_trip,
)


async def get_places_for_trip(
  db: AsyncSession,
  public_trip_id: str,
  user_id: uuid.UUID,
) -> list[TripPlace]:
  trip = await get_user_trip(
    db=db,
    trip_id=public_trip_id,
    user_id=user_id,
  )

  return await get_trip_places(
    db=db,
    trip_id=trip.id,
  )