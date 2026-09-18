import uuid
from decimal import Decimal
from typing import Any

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.agent_runs.models import AgentRun
from app.modules.agent_runs.repository import (
  create_agent_run,
)
from app.modules.trip_preferences.repository import (
  get_trip_preference,
)
from app.modules.trips.service import (
  get_user_trip,
)
from app.ai.planning.orchestrator import (
  execute_planning_graph,
)


def serialize_value(value: Any) -> Any:
  if isinstance(value, Decimal):
    return float(value)

  return value


async def start_agent_run(
  db: AsyncSession,
  public_trip_id: str,
  user_id: uuid.UUID,
) -> AgentRun:
  # Also verifies that this trip belongs
  # to the authenticated user.
  trip = await get_user_trip(
    db=db,
    trip_id=public_trip_id,
    user_id=user_id,
  )

  preferences = await get_trip_preference(
    db=db,
    trip_id=trip.id,
  )

  if preferences is None:
    raise HTTPException(
      status_code=status.HTTP_400_BAD_REQUEST,
      detail=(
        "Trip preferences must be saved "
        "before planning"
      ),
    )

  input_snapshot = {
    "trip": {
      "trip_id": trip.trip_id,
      "origin": trip.origin,
      "destination": trip.destination,

      "destination_name": trip.destination_name,
      "destination_country": trip.destination_country,
      "destination_country_code": trip.destination_country_code,

      "destination_latitude": (
        float(trip.destination_latitude)
        if trip.destination_latitude is not None
        else None
      ),

      "destination_longitude": (
        float(trip.destination_longitude)
        if trip.destination_longitude is not None
        else None
      ),

      "destination_timezone": trip.destination_timezone,

      "start_date": trip.start_date.isoformat(),
      "end_date": trip.end_date.isoformat(),
      "travelers": trip.travelers,

      "budget": (
        float(trip.budget)
        if trip.budget is not None
        else None
      ),

      "currency": trip.currency,
    },
    "preferences": {
      "pace": preferences.pace,
      "interests": preferences.interests,
      "ai_brief": preferences.ai_brief,
      "budget_level":
        preferences.budget_level,
    },
  }

  agent_run = await create_agent_run(
    db=db,
    trip_id=trip.id,
    input_snapshot=input_snapshot,
  )

  return await execute_planning_graph(
    db=db,
    agent_run=agent_run,
  )