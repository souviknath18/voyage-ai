import uuid
from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.trip_preferences.models import (
  TripPreference,
)


async def get_trip_preference(
  db: AsyncSession,
  trip_id: uuid.UUID,
) -> TripPreference | None:
  result = await db.execute(
    select(TripPreference).where(
      TripPreference.trip_id
      == trip_id
    )
  )

  return result.scalar_one_or_none()


async def create_trip_preference(
  db: AsyncSession,
  trip_id: uuid.UUID,
  preference_data: dict[str, Any],
) -> TripPreference:
  preference = TripPreference(
    trip_id=trip_id,
    **preference_data,
  )

  db.add(preference)

  await db.commit()
  await db.refresh(preference)

  return preference


async def update_trip_preference(
  db: AsyncSession,
  preference: TripPreference,
  preference_data: dict[str, Any],
) -> TripPreference:
  for field, value in (
    preference_data.items()
  ):
    setattr(
      preference,
      field,
      value,
    )

  await db.commit()
  await db.refresh(preference)

  return preference