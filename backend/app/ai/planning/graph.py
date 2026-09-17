from typing import Any, Literal

from langgraph.graph import (
  END,
  START,
  StateGraph,
)

from app.ai.planning.nodes.generate_itinerary import (
  generate_itinerary,
)
from app.ai.planning.nodes.replan_itinerary import (
  replan_itinerary,
)
from app.ai.planning.nodes.validate_itinerary import (
  validate_itinerary,
)
from app.ai.planning.state import PlanningState

from app.ai.planning.nodes.research_trip import (
    research_trip,
)


MAX_REPLANS = 2


async def load_context(
  state: PlanningState,
) -> dict[str, Any]:
  return {
    "research_results": {},
    "draft_itinerary": None,
    "validation_errors": [],
    "replan_count": 0,
    "final_itinerary": None,
    "error": None,
  }


def route_after_validation(
  state: PlanningState,
) -> Literal[
  "completed",
  "replan",
  "failed",
]:
  if not state["validation_errors"]:
    return "completed"

  if state["replan_count"] >= MAX_REPLANS:
    return "failed"

  return "replan"


async def planning_failed(
  state: PlanningState,
) -> dict[str, Any]:
  errors = state["validation_errors"]

  message = (
    "Itinerary validation failed after "
    f"{state['replan_count']} replans: "
    + "; ".join(errors)
  )

  return {
    "error": message,
    "final_itinerary": None,
  }


def build_planning_graph(
  *,
  load_context_node=load_context,
  research_trip_node=research_trip,
  generate_itinerary_node=generate_itinerary,
  validate_itinerary_node=validate_itinerary,
  replan_itinerary_node=replan_itinerary,
  planning_failed_node=planning_failed,
):
  builder = StateGraph(PlanningState)

  builder.add_node(
    "load_context",
    load_context_node,
  )

  builder.add_node(
    "generate_itinerary",
    generate_itinerary_node,
  )

  builder.add_node(
    "validate_itinerary",
    validate_itinerary_node,
  )

  builder.add_node(
    "replan_itinerary",
    replan_itinerary_node,
  )

  builder.add_node(
    "planning_failed",
    planning_failed_node,
  )

  builder.add_node(
    "research_trip",
    research_trip_node,
  )

  builder.add_edge(
    START,
    "load_context",
  )

  builder.add_edge(
    "load_context",
    "research_trip",
  )

  builder.add_edge(
    "research_trip",
    "generate_itinerary",
  )

  builder.add_edge(
    "generate_itinerary",
    "validate_itinerary",
  )

  builder.add_conditional_edges(
    "validate_itinerary",
    route_after_validation,
    {
      "completed": END,
      "replan": "replan_itinerary",
      "failed": "planning_failed",
    },
  )

  builder.add_edge(
    "replan_itinerary",
    "validate_itinerary",
  )

  builder.add_edge(
    "planning_failed",
    END,
  )

  return builder.compile()