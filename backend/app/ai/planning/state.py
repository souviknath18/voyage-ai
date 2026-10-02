import uuid
from typing import Any, TypedDict


class PlanningState(TypedDict):
  # Database AgentRun that owns this execution
  agent_run_id: uuid.UUID

  # Immutable Trip + TripPreference snapshot
  input_snapshot: dict[str, Any]

  # Planning or optimization
  mode: str

  # Existing itinerary when optimizing
  base_itinerary: dict[str, Any] | None

  # Requested optimization
  optimization_request: dict[str, Any] | None

  # Data collected by research/tool nodes
  research_results: dict[str, Any]

  # Initial itinerary produced by the LLM
  draft_itinerary: dict[str, Any] | None

  validation_errors: list[str]

  replan_count: int

  final_itinerary: dict[str, Any] | None

  error: str | None