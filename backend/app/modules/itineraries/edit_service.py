import uuid
from datetime import datetime, timezone
from decimal import Decimal

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.agent_runs.models import AgentRun
from app.modules.itineraries.models import Itinerary
from app.modules.itineraries.repository import (
  get_itinerary_by_trip_id,
  get_itinerary_by_version,
  save_itinerary,
  serialize_itinerary,
)
from app.modules.itineraries.schemas import (
  AddPlaceToItineraryRequest,
)
from app.modules.places.repository import get_trip_place
from app.modules.trips.models import Trip
from app.modules.trips.service import get_user_trip


def itinerary_time_sort_key(activity: dict) -> int:
  value = str(activity.get("time") or "").strip()

  for fmt in ("%H:%M", "%I:%M %p", "%H:%M:%S"):
    try:
      parsed = datetime.strptime(value, fmt)
      return parsed.hour * 60 + parsed.minute
    except ValueError:
      continue

  return 1440


async def _get_locked_trip(
  db: AsyncSession,
  public_trip_id: str,
  user_id: uuid.UUID,
) -> Trip:
  # Verify ownership before locking.
  trip = await get_user_trip(
    db=db,
    trip_id=public_trip_id,
    user_id=user_id,
  )

  # Serialize itinerary edits for this trip to
  # prevent concurrent version-number collisions.
  result = await db.execute(
    select(Trip)
    .where(
      Trip.id == trip.id,
      Trip.user_id == user_id,
    )
    .with_for_update()
  )

  return result.scalar_one()


async def _get_current_itinerary(
  db: AsyncSession,
  trip: Trip,
) -> Itinerary:
  itinerary = await get_itinerary_by_trip_id(
    db=db,
    trip_id=trip.id,
  )

  if itinerary is None:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND,
      detail="Generate an itinerary before editing it.",
    )

  return itinerary


async def _save_edited_itinerary(
  db: AsyncSession,
  trip: Trip,
  itinerary_data: dict,
  action: str,
  source_version: int,
  details: dict,
) -> Itinerary:
  # Create a manual-edit agent run without using
  # create_agent_run(), which commits immediately.
  agent_run = AgentRun(
    trip_id=trip.id,
    status="completed",
    current_step="completed",
    attempt=1,
    input_snapshot={
      "mode": "manual_edit",
      "action": action,
      "source_version": source_version,
      **details,
    },
    completed_at=datetime.now(timezone.utc),
  )

  db.add(agent_run)
  await db.flush()

  for day in itinerary_data["days"]:
    day["activities"].sort(
      key=itinerary_time_sort_key
    )

  new_itinerary = await save_itinerary(
    db=db,
    trip_id=trip.id,
    agent_run_id=agent_run.id,
    itinerary_data=itinerary_data,
  )

  await db.commit()

  return await get_itinerary_by_version(
    db=db,
    trip_id=trip.id,
    version=new_itinerary.version,
  )


async def add_place_to_trip_itinerary(
  db: AsyncSession,
  public_trip_id: str,
  user_id: uuid.UUID,
  payload: AddPlaceToItineraryRequest,
) -> Itinerary:
  try:
    trip = await _get_locked_trip(
      db=db,
      public_trip_id=public_trip_id,
      user_id=user_id,
    )

    current = await _get_current_itinerary(
      db=db,
      trip=trip,
    )

    place = await get_trip_place(
      db=db,
      trip_id=trip.id,
      place_id=payload.place_id,
    )

    if place is None:
      raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Place not found in this trip.",
      )

    data = serialize_itinerary(current)

    target_day = next(
      (
        day
        for day in data["days"]
        if day["day_number"] == payload.day_number
      ),
      None,
    )

    if target_day is None:
      raise HTTPException(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        detail="Invalid itinerary day.",
      )

    place_id = str(place.id)

    place_identifiers = {
      str(identifier)
      for identifier in (
        place.id,
        place.provider_place_id,
      )
      if identifier
    }

    # Prevent adding the same place twice
    # anywhere in the current itinerary.
    for day in data["days"]:
      for activity in day["activities"]:
        existing_place_id = activity.get("place_id")

        if (
          existing_place_id is not None
          and str(existing_place_id) in place_identifiers
        ):
          raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Place is already in the itinerary.",
          )

    categories = " ".join(
      [
        place.search_group or "",
        *(place.categories or []),
      ]
    ).lower()

    if any(
      term in categories
      for term in (
        "catering",
        "restaurant",
        "cafe",
        "food",
      )
    ):
      activity_type = "food"
      cost_category = "food"
    else:
      activity_type = "sightseeing"
      cost_category = "activities"

    target_day["activities"].append(
      {
        "time": payload.time,
        "duration_minutes": payload.duration_minutes,
        "title": place.name,
        "description": (
            place.address
            or f"Visit {place.name}."
        ),
        "location": place.address,
        "activity_type": activity_type,
        "cost_category": cost_category,
        "place_id": place_id,
        "estimated_cost": 0.0,
      }
    )

    return await _save_edited_itinerary(
      db=db,
      trip=trip,
      itinerary_data=data,
      action="add_place",
      source_version=current.version,
      details={
        "place_id": place_id,
        "day_number": payload.day_number,
      },
    )

  except Exception:
    await db.rollback()
    raise


async def remove_activity_from_trip_itinerary(
  db: AsyncSession,
  public_trip_id: str,
  user_id: uuid.UUID,
  activity_id: uuid.UUID,
) -> Itinerary:
  try:
    trip = await _get_locked_trip(
      db=db,
      public_trip_id=public_trip_id,
      user_id=user_id,
    )

    current = await _get_current_itinerary(
      db=db,
      trip=trip,
    )

    data = serialize_itinerary(current)

    found = False
    removed_cost = Decimal("0.00")

    for day in data["days"]:
      activities = day["activities"]

      for index, activity in enumerate(activities):
        if activity.get("id") == str(activity_id):
          removed_cost = Decimal(
            str(activity.get("estimated_cost", 0))
          )

          activities.pop(index)
          found = True
          break

      if found:
        break

    if not found:
      raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Activity not found in current itinerary.",
      )

    total = Decimal(
      str(data["estimated_total_cost"])
    )

    data["estimated_total_cost"] = float(
      max(
        Decimal("0.00"),
        total - removed_cost,
      )
    )

    return await _save_edited_itinerary(
      db=db,
      trip=trip,
      itinerary_data=data,
      action="remove_activity",
      source_version=current.version,
      details={
        "activity_id": str(activity_id),
      },
    )

  except Exception:
    await db.rollback()
    raise