import uuid
from datetime import datetime, timezone
from typing import Any

from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.trips.models import Trip
from app.modules.itineraries.models import Itinerary


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
) -> list[dict[str, Any]]:

  latest_version_subquery = (
    select(
      Itinerary.trip_id,
      Itinerary.version,
    )
    .distinct(
      Itinerary.trip_id
    )
    .order_by(
      Itinerary.trip_id,
      Itinerary.version.desc(),
    )
    .subquery()
  )

  result = await db.execute(
    select(
      Trip,
      Itinerary.id.label(
        "itinerary_id"
      ),
      Itinerary.version.label(
        "itinerary_version"
      ),
      Itinerary.estimated_total_cost.label(
        "estimated_total_cost"
      ),
    )
    .outerjoin(
      latest_version_subquery,
      latest_version_subquery.c.trip_id
      == Trip.id,
    )
    .outerjoin(
      Itinerary,
      and_(
        Itinerary.trip_id
        == latest_version_subquery.c.trip_id,

        Itinerary.version
        == latest_version_subquery.c.version,
      ),
    )
    .where(
      Trip.user_id == user_id
    )
    .order_by(
      Trip.created_at.desc()
    )
  )

  rows = result.all()

  return [
    {
      **row.Trip.__dict__,

      "itinerary_id":
        row.itinerary_id,

      "itinerary_version":
        row.itinerary_version,

      "estimated_total_cost":
        row.estimated_total_cost,
    }
    for row in rows
  ]


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


async def update_trip_destination(
  db: AsyncSession,
  trip: Trip,
  *,
  name: str,
  country: str,
  country_code: str,
  latitude: float,
  longitude: float,
  timezone: str | None,
) -> Trip:
  trip.destination_name = name
  trip.destination_country = country
  trip.destination_country_code = country_code
  trip.destination_latitude = latitude
  trip.destination_longitude = longitude
  trip.destination_timezone = timezone

  await db.commit()
  await db.refresh(trip)

  return trip


async def update_trip_origin(
  db: AsyncSession,
  trip: Trip,
  *,
  name: str,
  country: str,
  country_code: str,
  latitude: float,
  longitude: float,
  timezone: str | None,
) -> Trip:
  trip.origin_name = name
  trip.origin_country = country
  trip.origin_country_code = country_code
  trip.origin_latitude = latitude
  trip.origin_longitude = longitude
  trip.origin_timezone = timezone

  await db.commit()
  await db.refresh(trip)

  return trip


async def update_trip_saved_status(
  db: AsyncSession,
  trip: Trip,
  is_saved: bool,
) -> Trip:
  trip.is_saved = is_saved

  await db.commit()
  await db.refresh(trip)

  return trip