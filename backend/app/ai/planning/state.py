import uuid
from typing import Any, TypedDict


class PlanningState(TypedDict):
  # Database AgentRun that owns this execution
  agent_run_id: uuid.UUID

  # Immutable Trip + TripPreference snapshot
  input_snapshot: dict[str, Any]

  # Data collected by research/tool nodes
  research_results: dict[str, Any]

  # Initial itinerary produced by the LLM
  draft_itinerary: dict[str, Any] | None

  # Problems found during validation
  validation_errors: list[str]

  # Number of replanning attempts
  replan_count: int

  # Valid itinerary ready for persistence
  final_itinerary: dict[str, Any] | None

  # Fatal graph-level error
  error: str | None