import uuid

from datetime import date
from decimal import Decimal
from typing import Any

from sqlalchemy import delete, select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.itineraries.models import (
  Itinerary,
  ItineraryDay,
  ItineraryItem,
)


async def save_itinerary(
  db: AsyncSession,
  trip_id,
  agent_run_id,
  itinerary_data: dict[str, Any],
) -> Itinerary:
  # MVP: one current itinerary per trip.
  # Deleting the old itinerary also deletes its
  # days/items because of ON DELETE CASCADE.
  await db.execute(
    delete(Itinerary).where(
      Itinerary.trip_id == trip_id
    )
  )

  itinerary = Itinerary(
    trip_id=trip_id,
    agent_run_id=agent_run_id,
    destination=itinerary_data["destination"],
    summary=itinerary_data["summary"],
    currency=itinerary_data["currency"],
    estimated_total_cost=Decimal(
      str(
        itinerary_data[
          "estimated_total_cost"
        ]
      )
    ),
  )

  db.add(itinerary)

  # We need the itinerary UUID before creating
  # its child rows.
  await db.flush()

  for day_data in itinerary_data["days"]:
    itinerary_day = ItineraryDay(
      itinerary_id=itinerary.id,
      day_number=day_data["day_number"],
      date=date.fromisoformat(
        day_data["date"]
      ),
      title=day_data["title"],
    )

    db.add(itinerary_day)

    # Generate the day UUID before creating
    # itinerary items.
    await db.flush()

    for activity in day_data["activities"]:
      itinerary_item = ItineraryItem(
        itinerary_day_id=itinerary_day.id,
        time=activity["time"],
        title=activity["title"],
        description=activity["description"],
        location=activity.get("location"),
        activity_type=activity["activity_type"],
        place_id=activity.get("place_id"),
        estimated_cost=Decimal(
          str(
            activity.get(
              "estimated_cost",
              0,
            )
          )
        ),
      )

      db.add(itinerary_item)

  # Flush everything, but do not commit here.
  await db.flush()

  return itinerary


async def get_itinerary_by_trip_id(
  db: AsyncSession,
  trip_id: uuid.UUID,
) -> Itinerary | None:
  result = await db.execute(
    select(Itinerary)
    .where(
      Itinerary.trip_id == trip_id
    )
    .options(
      selectinload(
        Itinerary.days
      ).selectinload(
        ItineraryDay.activities
      )
    )
  )

  return result.scalar_one_or_none()