from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.planning.graph import planning_graph
from app.ai.planning.state import PlanningState
from app.modules.agent_runs.models import AgentRun
from app.modules.agent_runs.repository import (
  mark_agent_run_completed,
  mark_agent_run_failed,
  mark_agent_run_running,
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
      "input_snapshot": (
          agent_run.input_snapshot or {}
      ),
      "research_results": {},
      "draft_itinerary": None,
      "validation_errors": [],
      "replan_count": 0,
      "final_itinerary": None,
      "error": None,
    }

    result = await planning_graph.ainvoke(
      initial_state
    )

    if result.get("error"):
      return await mark_agent_run_failed(
        db=db,
        agent_run=agent_run,
        error_message=result["error"],
      )

    return await mark_agent_run_completed(
      db=db,
      agent_run=agent_run,
    )

  except Exception as exc:
    await mark_agent_run_failed(
      db=db,
      agent_run=agent_run,
      error_message=str(exc),
    )

    raise