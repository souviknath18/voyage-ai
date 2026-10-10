import uuid
from collections.abc import Awaitable, Callable
from typing import Any

from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import AsyncSessionLocal
from app.modules.tool_calls.models import ToolCall
from app.modules.tool_calls.repository import (
  create_tool_call,
  mark_tool_call_completed,
  mark_tool_call_failed,
)


async def execute_tool(
  *,
  db: AsyncSession,
  agent_step_id: uuid.UUID,
  tool_name: str,
  tool: Callable[..., Awaitable[dict[str, Any]]],
  arguments: dict[str, Any],
) -> dict[str, Any]:

  # Transaction 1: Create tool-call record.
  async with AsyncSessionLocal() as tracking_db:
    async with tracking_db.begin():
      tool_call = await create_tool_call(
        db=tracking_db,
        agent_step_id=agent_step_id,
        tool_name=tool_name,
        input_data=arguments,
      )

      tool_call_id = tool_call.id

  # External API call runs outside the tracking transaction.
  try:
    result = await tool(**arguments)

  except Exception as exc:
    # Transaction 2A: Record failure.
    async with AsyncSessionLocal() as tracking_db:
      async with tracking_db.begin():
        failed_call = await tracking_db.get(
          ToolCall,
          tool_call_id,
        )

        if failed_call is not None:
          await mark_tool_call_failed(
            db=tracking_db,
            tool_call=failed_call,
            error_message=str(exc),
          )

    raise

  # Transaction 2B: Record success.
  async with AsyncSessionLocal() as tracking_db:
    async with tracking_db.begin():
      completed_call = await tracking_db.get(
        ToolCall,
        tool_call_id,
      )

      if completed_call is None:
        raise ValueError(
          f"Tool call {tool_call_id} not found."
        )

      await mark_tool_call_completed(
        db=tracking_db,
        tool_call=completed_call,
        output_data=result,
      )

  return result