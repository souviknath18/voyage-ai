import uuid
from datetime import datetime, timezone
from typing import Any

from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.tool_calls.models import ToolCall


async def create_tool_call(
  db: AsyncSession,
  agent_step_id: uuid.UUID,
  tool_name: str,
  input_data: dict[str, Any] | None = None,
  attempt: int = 1,
) -> ToolCall:
  tool_call = ToolCall(
    agent_step_id=agent_step_id,
    tool_name=tool_name,
    status="running",
    attempt=attempt,
    input_data=input_data,
    started_at=datetime.now(timezone.utc),
  )

  db.add(tool_call)

  await db.flush()

  return tool_call


async def mark_tool_call_completed(
  db: AsyncSession,
  tool_call: ToolCall,
  output_data: dict[str, Any] | None = None,
) -> ToolCall:
  tool_call.status = "completed"
  tool_call.output_data = output_data
  tool_call.completed_at = datetime.now(
    timezone.utc
  )

  await db.flush()

  return tool_call


async def mark_tool_call_failed(
  db: AsyncSession,
  tool_call: ToolCall,
  error_message: str,
) -> ToolCall:
  tool_call.status = "failed"
  tool_call.error_message = error_message
  tool_call.completed_at = datetime.now(
    timezone.utc
  )

  await db.flush()

  return tool_call