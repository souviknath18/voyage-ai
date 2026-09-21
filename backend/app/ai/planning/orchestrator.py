from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.modules.trips.models import Trip
from app.ai.planning.graph import (
  build_planning_graph,
  load_context,
  planning_failed,
)
from app.ai.planning.nodes.generate_itinerary import (
  generate_itinerary,
)
from app.ai.planning.nodes.validate_itinerary import (
  validate_itinerary,
)
from app.ai.planning.nodes.replan_itinerary import (
  replan_itinerary,
)
from app.ai.planning.nodes.research_trip import (
  research_trip,
)
from app.ai.planning.tracking import (
  tracked_step,
)
from app.ai.planning.state import PlanningState
from app.modules.agent_runs.models import AgentRun
from app.modules.agent_runs.repository import (
  mark_agent_run_completed,
  mark_agent_run_failed,
  mark_agent_run_running,
)
from app.modules.itineraries.repository import (
  save_itinerary,
)
from app.modules.trips.repository import (
  update_trip_status,
)
from app.modules.places.repository import (
  replace_trip_places,
)


async def execute_planning_graph(
  db: AsyncSession,
  agent_run: AgentRun,
) -> AgentRun:
  try:
    await mark_agent_run_running(
      db=db,
      agent_run=agent_run,
      current_step="load_context",
    )

    initial_state: PlanningState = {
      "agent_run_id": agent_run.id,
      "input_snapshot": agent_run.input_snapshot or {},
      "research_results": {},
      "draft_itinerary": None,
      "validation_errors": [],
      "replan_count": 0,
      "final_itinerary": None,
      "error": None,
    }

    planning_graph = build_planning_graph(
      load_context_node=tracked_step(
        db=db,
        agent_run=agent_run,
        step_name="load_context",
        node=load_context,
      ),

      generate_itinerary_node=tracked_step(
        db=db,
        agent_run=agent_run,
        step_name="generate_itinerary",
        node=generate_itinerary,
      ),

      validate_itinerary_node=tracked_step(
        db=db,
        agent_run=agent_run,
        step_name="validate_itinerary",
        node=validate_itinerary,
      ),

      replan_itinerary_node=tracked_step(
        db=db,
        agent_run=agent_run,
        step_name="replan_itinerary",
        node=replan_itinerary,
      ),

      planning_failed_node=tracked_step(
        db=db,
        agent_run=agent_run,
        step_name="planning_failed",
        node=planning_failed,
      ),

      research_trip_node=tracked_step(
        db=db,
        agent_run=agent_run,
        step_name="research_trip",
        node=research_trip,
        inject_context=True,
      ),
    )

    result = await planning_graph.ainvoke(
      initial_state
    )

    if result.get("error"):
      return await mark_agent_run_failed(
        db=db,
        agent_run=agent_run,
        error_message=result["error"],
      )

    final_itinerary = result.get(
      "final_itinerary"
    )

    if not final_itinerary:
      return await mark_agent_run_failed(
        db=db,
        agent_run=agent_run,
        error_message=(
          "Planning completed without "
          "a valid itinerary."
        ),
      )

    await save_itinerary(
      db=db,
      trip_id=agent_run.trip_id,
      agent_run_id=agent_run.id,
      itinerary_data=final_itinerary,
    )

    research_results = result.get(
      "research_results",
      {},
    )

    places = research_results.get(
      "places",
      [],
    )

    await replace_trip_places(
      db=db,
      trip_id=agent_run.trip_id,
      places=places,
    )

    result = await db.execute(
      select(Trip).where(
        Trip.id == agent_run.trip_id
      )
    )

    trip = result.scalar_one()

    await update_trip_status(
      db=db,
      trip=trip,
      status="upcoming",
      commit=False,
    )

    await mark_agent_run_completed(
      db=db,
      agent_run=agent_run,
      commit=False,
    )

    await db.commit()
    await db.refresh(agent_run)

    return agent_run

  except Exception as exc:
    await db.rollback()

    await mark_agent_run_failed(
      db=db,
      agent_run=agent_run,
      error_message=str(exc),
    )

    raise