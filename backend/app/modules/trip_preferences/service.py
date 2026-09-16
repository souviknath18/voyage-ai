import uuid
from typing import Any

from fastapi import (
  HTTPException,
  status,
)
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.trips.service import (
  get_user_trip,
)
from app.modules.trip_preferences.models import (
  TripPreference,
)
from app.modules.trip_preferences.repository import (
  create_trip_preference,
  get_trip_preference,
  update_trip_preference,
)


async def get_user_trip_preference(
    db: AsyncSession,
    public_trip_id: str,
    user_id: uuid.UUID,
) -> TripPreference:
  trip = await get_user_trip(
    db=db,
    trip_id=public_trip_id,
    user_id=user_id,
  )

  preference = await get_trip_preference(
    db=db,
    trip_id=trip.id,
  )

  if preference is None:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND,
      detail="Trip preferences not found",
    )

  return preference


async def save_user_trip_preference(
  db: AsyncSession,
  public_trip_id: str,
  user_id: uuid.UUID,
  preference_data: dict[str, Any],
) -> TripPreference:
  trip = await get_user_trip(
    db=db,
    trip_id=public_trip_id,
    user_id=user_id,
  )

  preference = await get_trip_preference(
    db=db,
    trip_id=trip.id,
  )

  if preference is None:
    return await create_trip_preference(
      db=db,
      trip_id=trip.id,
      preference_data=preference_data,
    )

  return await update_trip_preference(
    db=db,
    preference=preference,
    preference_data=preference_data,
  )