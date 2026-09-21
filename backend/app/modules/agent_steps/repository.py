import uuid
from datetime import datetime, timezone
from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.agent_steps.models import AgentStep


async def create_agent_step(
  db: AsyncSession,
  agent_run_id: uuid.UUID,
  step_name: str,
  attempt: int = 1,
  input_data: dict[str, Any] | None = None,
) -> AgentStep:
  agent_step = AgentStep(
    agent_run_id=agent_run_id,
    step_name=step_name,
    status="running",
    attempt=attempt,
    input_data=input_data,
    started_at=datetime.now(timezone.utc),
  )

  db.add(agent_step)

  await db.flush()

  return agent_step


async def mark_agent_step_completed(
  db: AsyncSession,
  agent_step: AgentStep,
  output_data: dict[str, Any] | None = None,
) -> AgentStep:
  agent_step.status = "completed"
  agent_step.output_data = output_data
  agent_step.completed_at = datetime.now(timezone.utc)

  await db.flush()

  return agent_step


async def mark_agent_step_failed(
  db: AsyncSession,
  agent_step: AgentStep,
  error_message: str,
) -> AgentStep:
  agent_step.status = "failed"
  agent_step.error_message = error_message
  agent_step.completed_at = datetime.now(timezone.utc)

  await db.flush()

  return agent_step


async def get_agent_steps(
  db: AsyncSession,
  agent_run_id: uuid.UUID,
) -> list[AgentStep]:
  result = await db.execute(
    select(AgentStep)
    .where(
      AgentStep.agent_run_id == agent_run_id
    )
    .order_by(
      AgentStep.created_at.asc()
    )
  )

  return list(
    result.scalars().all()
  )