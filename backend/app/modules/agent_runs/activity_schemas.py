import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ToolCallActivityResponse(BaseModel):
  id: uuid.UUID
  tool_name: str
  status: str
  attempt: int
  error_message: str | None
  started_at: datetime | None
  completed_at: datetime | None

  model_config = ConfigDict(
    from_attributes=True,
  )


class AgentStepActivityResponse(BaseModel):
  id: uuid.UUID
  step_name: str
  status: str
  attempt: int
  error_message: str | None
  started_at: datetime | None
  completed_at: datetime | None
  tool_calls: list[ToolCallActivityResponse]


class AgentRunActivityResponse(BaseModel):
  id: uuid.UUID
  trip_id: uuid.UUID
  status: str
  current_step: str | None
  attempt: int
  error_message: str | None
  started_at: datetime | None
  completed_at: datetime | None
  steps: list[AgentStepActivityResponse]