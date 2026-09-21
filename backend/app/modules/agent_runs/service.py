import uuid
from decimal import Decimal
from typing import Any
import asyncio

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.agent_runs.models import AgentRun
from app.db.session import AsyncSessionLocal
from app.modules.agent_runs.repository import (
  create_agent_run,
  get_agent_run,
  get_user_agent_run,
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
from app.modules.agent_steps.repository import (
  get_agent_steps,
)
from app.modules.tool_calls.repository import (
  get_tool_calls_for_steps,
)
from app.modules.agent_runs.activity_schemas import (
  AgentRunActivityResponse,
  AgentStepActivityResponse,
  ToolCallActivityResponse,
)


def serialize_value(value: Any) -> Any:
  if isinstance(value, Decimal):
    return float(value)

  return value


async def run_planning_in_background(
  agent_run_id: uuid.UUID,
) -> None:
  async with AsyncSessionLocal() as db:
    agent_run = await get_agent_run(
      db=db,
      agent_run_id=agent_run_id,
    )

    if agent_run is None:
      return

    try:
      await execute_planning_graph(
        db=db,
        agent_run=agent_run,
      )
    except Exception:
      # execute_planning_graph already records
      # the AgentRun failure.
      return


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

  asyncio.create_task(
    run_planning_in_background(
      agent_run_id=agent_run.id,
    )
  )

  return agent_run


async def get_user_agent_run_status(
  db: AsyncSession,
  agent_run_id: uuid.UUID,
  user_id: uuid.UUID,
) -> AgentRun:
  agent_run = await get_user_agent_run(
    db=db,
    agent_run_id=agent_run_id,
    user_id=user_id,
  )

  if agent_run is None:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND,
      detail="Agent run not found",
    )

  return agent_run


async def get_user_agent_run_activity(
  db: AsyncSession,
  agent_run_id: uuid.UUID,
  user_id: uuid.UUID,
) -> AgentRunActivityResponse:
  agent_run = await get_user_agent_run(
    db=db,
    agent_run_id=agent_run_id,
    user_id=user_id,
  )

  if agent_run is None:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND,
      detail="Agent run not found",
    )

  agent_steps = await get_agent_steps(
    db=db,
    agent_run_id=agent_run.id,
  )

  step_ids = [
    step.id
    for step in agent_steps
  ]

  tool_calls = await get_tool_calls_for_steps(
    db=db,
    agent_step_ids=step_ids,
  )

  tool_calls_by_step: dict[
    uuid.UUID,
    list[ToolCallActivityResponse],
  ] = {}

  for tool_call in tool_calls:
    tool_calls_by_step.setdefault(
      tool_call.agent_step_id,
      [],
    ).append(
      ToolCallActivityResponse.model_validate(
        tool_call
      )
    )

  steps = [
    AgentStepActivityResponse(
      id=step.id,
      step_name=step.step_name,
      status=step.status,
      attempt=step.attempt,
      error_message=step.error_message,
      started_at=step.started_at,
      completed_at=step.completed_at,
      tool_calls=tool_calls_by_step.get(
        step.id,
        [],
      ),
    )
    for step in agent_steps
  ]

  return AgentRunActivityResponse(
    id=agent_run.id,
    trip_id=agent_run.trip_id,
    status=agent_run.status,
    current_step=agent_run.current_step,
    attempt=agent_run.attempt,
    error_message=agent_run.error_message,
    started_at=agent_run.started_at,
    completed_at=agent_run.completed_at,
    steps=steps,
  )