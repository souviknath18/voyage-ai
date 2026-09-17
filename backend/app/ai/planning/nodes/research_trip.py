import uuid
from typing import Any

from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.planning.state import PlanningState
from app.ai.tools.executor import execute_tool
from app.ai.tools.weather import get_weather


async def research_trip(
  state: PlanningState,
  *,
  db: AsyncSession,
  agent_step_id: uuid.UUID,
) -> dict[str, Any]:
  trip = state["input_snapshot"].get(
    "trip",
    {},
  )

  destination = trip.get("destination")
  start_date = trip.get("start_date")
  end_date = trip.get("end_date")

  weather = await execute_tool(
    db=db,
    agent_step_id=agent_step_id,
    tool_name="get_weather",
    tool=get_weather,
    arguments={
      "destination": destination,
      "start_date": start_date,
      "end_date": end_date,
    },
  )

  research_results = {
    "destination": destination,
    "start_date": start_date,
    "end_date": end_date,
    "weather": weather,
    "places": [],
    "hotels": [],
    "flights": [],
  }

  return {
    "research_results": research_results,
  }