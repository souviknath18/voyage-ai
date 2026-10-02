import uuid
from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel


class TripOptimizationRequest(BaseModel):
  optimization_type: Literal[
    "cheaper",
    "less_busy",
    "more_activities",
    "more_comfortable",
    "custom",
  ]

  instructions: str | None = None

class AgentRunResponse(BaseModel):
  id: uuid.UUID
  trip_id: uuid.UUID

  status: str
  current_step: str | None
  attempt: int

  input_snapshot: dict[str, Any] | None
  error_message: str | None

  started_at: datetime | None
  completed_at: datetime | None
  created_at: datetime
  updated_at: datetime

  model_config = {
    "from_attributes": True,
  }