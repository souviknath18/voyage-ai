import uuid
from collections.abc import Awaitable, Callable
from typing import Any

from sqlalchemy.ext.asyncio import AsyncSession

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
  tool_call = await create_tool_call(
    db=db,
    agent_step_id=agent_step_id,
    tool_name=tool_name,
    input_data=arguments,
  )

  try:
    result = await tool(**arguments)

    await mark_tool_call_completed(
      db=db,
      tool_call=tool_call,
      output_data=result,
    )

    return result

  except Exception as exc:
    await mark_tool_call_failed(
      db=db,
      tool_call=tool_call,
      error_message=str(exc),
    )

    raise