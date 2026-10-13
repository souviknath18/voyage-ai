
import uuid
from datetime import date

from sqlalchemy import case, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.agent_runs.models import AgentRun
from app.modules.places.models import TripPlace
from app.modules.trips.models import Trip

from app.modules.trips.lifecycle import get_lifecycle_today

from app.modules.flights.models import SelectedFlight
from app.modules.hotels.models import SelectedHotel


async def get_dashboard_stats(
  db: AsyncSession,
  user_id: uuid.UUID,
) -> dict:
  """
  Calculate dashboard statistics directly in PostgreSQL.
  No need to load all trips or places into Python.
  """

  # 1. Total trips
  total_trips = await db.scalar(
    select(func.count(Trip.id)).where(
      Trip.user_id == user_id
    )
  )

  # 2. Unique destination countries
  countries_planned = await db.scalar(
    select(
      func.count(
        func.distinct(Trip.destination_country)
      )
    ).where(
      Trip.user_id == user_id,
      Trip.destination_country.is_not(None),
      Trip.destination_country != "",
    )
  )

  # 3. Saved places belonging to this user
  saved_places = await db.scalar(
    select(func.count(TripPlace.id))
    .join(
      Trip,
      TripPlace.trip_id == Trip.id,
    )
    .where(
      Trip.user_id == user_id,
      TripPlace.is_saved.is_(True),
    )
  )

  return {
    "total_trips": total_trips or 0,
    "countries_planned": countries_planned or 0,
    "saved_places": saved_places or 0,
  }



async def get_dashboard_upcoming_trip(
  db: AsyncSession,
  user_id: uuid.UUID,
) -> Trip | None:
  """
  Return the most relevant active or upcoming trip
  belonging to the authenticated user.

  Priority:
  1. Ongoing trips (nearest ending first)
  2. Future trips (nearest starting first)

  Excludes:
  - Expired trips
  - Cancelled trips
  - Completed trips
  """

  today = get_lifecycle_today()

  is_ongoing = (
    (Trip.start_date <= today)
    & (Trip.end_date >= today)
  )

  result = await db.execute(
    select(Trip)
    .where(
      Trip.user_id == user_id,
      Trip.end_date >= today,
      Trip.status.notin_(["draft", "cancelled", "completed"]),
    )
    .order_by(
      # Ongoing trips first
      is_ongoing.desc(),

      # Among ongoing trips, nearest end date first;
      # among future trips, nearest start date first
      case(
        (is_ongoing, Trip.end_date),
        else_=Trip.start_date,
      ).asc(),

      # Deterministic tie-breaking
      Trip.start_date.asc(),
      Trip.id.asc(),
    )
    .limit(1)
  )

  return result.scalar_one_or_none()


async def get_dashboard_recent_activity(
  db: AsyncSession,
  user_id: uuid.UUID,
  limit: int = 5,
) -> list[dict]:
  """
  Fetch recent AI agent runs belonging to the user.
  """

  result = await db.execute(
    select(
      AgentRun.id.label("agent_run_id"),
      Trip.trip_id,
      Trip.destination,
      AgentRun.status,
      AgentRun.current_step,
      AgentRun.created_at,
    )
    .join(
      Trip,
      AgentRun.trip_id == Trip.id,
    )
    .where(
      Trip.user_id == user_id,
    )
    .order_by(
      AgentRun.created_at.desc(),
      AgentRun.id.desc(),
    )
    .limit(max(1, min(limit, 20)))
  )

  return [
    {
      "agent_run_id": str(row.agent_run_id),
      "trip_id": row.trip_id,
      "destination": row.destination,
      "status": row.status,
      "current_step": row.current_step,
      "created_at": row.created_at,
    }
    for row in result.all()
  ]



async def get_dashboard_selected_flight(
    db: AsyncSession,
    trip_id: uuid.UUID,
    user_id: uuid.UUID,
) -> dict | None:
    """
    Retrieve the selected flight for a trip
    belonging to the authenticated user.

    A selected flight is not necessarily booked.
    """

    result = await db.execute(
        select(SelectedFlight)
        .join(
            Trip,
            SelectedFlight.trip_id == Trip.id,
        )
        .where(
            Trip.id == trip_id,
            Trip.user_id == user_id,
        )
        .limit(1)
    )

    flight = result.scalar_one_or_none()

    if flight is None:
        return None

    return {
        "airline": flight.airline,
        "airline_code": flight.airline_code,
        "price": flight.converted_price,
        "currency": flight.converted_currency,
        "selected_at": flight.selected_at,
    }


async def get_dashboard_selected_hotel(
  db: AsyncSession,
  trip_id: uuid.UUID,
  user_id: uuid.UUID,
) -> dict | None:
  """
  Retrieve the selected hotel for a trip
  belonging to the authenticated user.

  A selected hotel is not necessarily booked.
  """

  result = await db.execute(
    select(SelectedHotel)
    .join(
      Trip,
      SelectedHotel.trip_id == Trip.id,
    )
    .where(
      Trip.id == trip_id,
      Trip.user_id == user_id,
    )
    .limit(1)
  )

  hotel = result.scalar_one_or_none()

  if hotel is None:
    return None

  return {
    "hotel_name": hotel.hotel_name,
    "price": hotel.converted_price,
    "currency": hotel.converted_currency,
    "selected_at": hotel.selected_at,
  }