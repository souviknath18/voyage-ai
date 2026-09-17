import uuid
from datetime import datetime, timezone
from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.trips.models import Trip


async def create_trip(
  db: AsyncSession,
  user_id: uuid.UUID,
  trip_data: dict[str, Any],
) -> Trip:
  today = datetime.now(
    timezone.utc
  ).strftime("%Y%m%d")

  prefix = f"TRIP-{today}-"

  result = await db.execute(
    select(Trip.trip_id)
    .where(
      Trip.trip_id.like(
        f"{prefix}%"
      )
    )
    .order_by(
      Trip.trip_id.desc()
    )
    .limit(1)
  )

  last_trip_id = (
    result.scalar_one_or_none()
  )

  if last_trip_id:
    try:
      last_number = int(
        last_trip_id.split("-")[-1]
      )
    except (
      ValueError,
      IndexError,
    ):
      last_number = 0
  else:
    last_number = 0

  trip_id = (
    f"{prefix}"
    f"{last_number + 1:04d}"
  )

  trip = Trip(
    trip_id=trip_id,
    user_id=user_id,
    **trip_data,
  )

  db.add(trip)

  await db.commit()
  await db.refresh(trip)

  return trip


async def get_trip_by_id(
  db: AsyncSession,
  trip_id: str,
  user_id: uuid.UUID,
) -> Trip | None:
  result = await db.execute(
    select(Trip).where(
      Trip.trip_id == trip_id,
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


async def update_trip_status(
  db: AsyncSession,
  trip: Trip,
  status: str,
  commit: bool = True,
) -> Trip:
  trip.status = status

  if commit:
    await db.commit()
    await db.refresh(trip)
  else:
    await db.flush()

  return trip