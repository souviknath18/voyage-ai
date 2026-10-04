import uuid

from datetime import date
from decimal import Decimal
from typing import Any

from sqlalchemy import func, select
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

  result = await db.execute(
    select(
      func.coalesce(
        func.max(Itinerary.version),
        0,
      )
    ).where(
      Itinerary.trip_id == trip_id
    )
  )

  current_version = result.scalar_one()

  next_version = current_version + 1

  itinerary = Itinerary(
    trip_id=trip_id,
    agent_run_id=agent_run_id,
    version=next_version,
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

    for sort_order, activity in enumerate(
      day_data["activities"],
      start=1,
    ):
      itinerary_item = ItineraryItem(
        itinerary_day_id=itinerary_day.id,

        sort_order=sort_order,

        time=activity["time"],
        title=activity["title"],
        description=activity["description"],
        location=activity.get("location"),
        activity_type=activity["activity_type"],
        cost_category=activity["cost_category"],
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
    .order_by(
      Itinerary.version.desc()
    )
    .limit(1)
  )

  return result.scalar_one_or_none()


async def get_itinerary_versions(
  db: AsyncSession,
  trip_id: uuid.UUID,
) -> list[Itinerary]:
  result = await db.execute(
    select(Itinerary)
    .where(
      Itinerary.trip_id == trip_id
    )
    .order_by(
      Itinerary.version.desc()
    )
  )

  return list(
    result.scalars().all()
  )


async def get_itinerary_by_version(
  db: AsyncSession,
  trip_id: uuid.UUID,
  version: int,
) -> Itinerary | None:
  result = await db.execute(
    select(Itinerary)
    .where(
      Itinerary.trip_id == trip_id,
      Itinerary.version == version,
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


def serialize_itinerary(
  itinerary: Itinerary,
) -> dict[str, Any]:
  return {
    "id": str(itinerary.id),
    "version": itinerary.version,
    "destination": itinerary.destination,
    "summary": itinerary.summary,
    "currency": itinerary.currency,
    "estimated_total_cost": float(
      itinerary.estimated_total_cost
    ),
    "days": [
      {
        "day_number": day.day_number,
        "date": day.date.isoformat(),
        "title": day.title,
        "activities": [
          {
            "time": activity.time,
            "title": activity.title,
            "description": activity.description,
            "location": activity.location,
            "activity_type": activity.activity_type,
            "cost_category": activity.cost_category,
            "place_id": activity.place_id,
            "estimated_cost": float(
              activity.estimated_cost
            ),
          }
          for activity in day.activities
        ],
      }
      for day in itinerary.days
    ],
  }