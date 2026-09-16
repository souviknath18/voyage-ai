import uuid

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.trips.models import Trip
from app.modules.trips.repository import (
  create_trip,
  delete_trip,
  get_trip_by_id,
  get_user_trips,
  update_trip,
)
from app.modules.trips.schemas import (
  TripCreate,
  TripUpdate,
)


async def create_user_trip(
  db: AsyncSession,
  user_id: uuid.UUID,
  data: TripCreate,
) -> Trip:
  trip_data = data.model_dump()

  return await create_trip(
    db=db,
    user_id=user_id,
    trip_data=trip_data,
  )


async def get_user_trip(
  db: AsyncSession,
  trip_id: str,
  user_id: uuid.UUID,
) -> Trip:
  trip = await get_trip_by_id(
    db=db,
    trip_id=trip_id,
    user_id=user_id,
  )

  if trip is None:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND,
      detail="Trip not found",
    )

  return trip


async def list_user_trips(
  db: AsyncSession,
  user_id: uuid.UUID,
) -> list[Trip]:
  return await get_user_trips(
    db=db,
    user_id=user_id,
  )


async def update_user_trip(
  db: AsyncSession,
  trip_id: str,
  user_id: uuid.UUID,
  data: TripUpdate,
) -> Trip:
  trip = await get_user_trip(
    db=db,
    trip_id=trip_id,
    user_id=user_id,
  )

  update_data = data.model_dump(
    exclude_unset=True
  )

  new_start_date = update_data.get(
    "start_date",
    trip.start_date,
  )

  new_end_date = update_data.get(
    "end_date",
    trip.end_date,
  )

  if new_end_date <= new_start_date:
    raise HTTPException(
      status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
      detail="end_date must be after start_date",
    )

  return await update_trip(
    db=db,
    trip=trip,
    update_data=update_data,
  )


async def delete_user_trip(
  db: AsyncSession,
  trip_id: str,
  user_id: uuid.UUID,
) -> None:
  trip = await get_user_trip(
    db=db,
    trip_id=trip_id,
    user_id=user_id,
  )

  await delete_trip(
    db=db,
    trip=trip,
  )