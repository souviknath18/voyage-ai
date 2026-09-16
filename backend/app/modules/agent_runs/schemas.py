import uuid
from datetime import datetime
from typing import Any

from pydantic import BaseModel


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