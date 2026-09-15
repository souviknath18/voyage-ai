import uuid
from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.trips.models import Trip


async def create_trip(
  db: AsyncSession,
  user_id: uuid.UUID,
  trip_data: dict[str, Any],
) -> Trip:
  trip = Trip(
    user_id=user_id,
    **trip_data,
  )

  db.add(trip)
  await db.commit()
  await db.refresh(trip)

  return trip


async def get_trip_by_id(
  db: AsyncSession,
  trip_id: uuid.UUID,
  user_id: uuid.UUID,
) -> Trip | None:
  result = await db.execute(
    select(Trip).where(
      Trip.id == trip_id,
      Trip.user_id == user_id,
    )
  )

  return result.scalar_one_or_none()


async def get_user_trips(
  db: AsyncSession,
  user_id: uuid.UUID,
) -> list[Trip]:
  result = await db.execute(
    select(Trip)
    .where(Trip.user_id == user_id)
    .order_by(Trip.created_at.desc())
  )

  return list(result.scalars().all())


async def update_trip(
  db: AsyncSession,
  trip: Trip,
  update_data: dict[str, Any],
) -> Trip:
  for field, value in update_data.items():
    setattr(trip, field, value)

  await db.commit()
  await db.refresh(trip)

  return trip


async def delete_trip(
  db: AsyncSession,
  trip: Trip,
) -> None:
  await db.delete(trip)
  await db.commit()