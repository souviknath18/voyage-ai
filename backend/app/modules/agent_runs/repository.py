import uuid
from datetime import datetime, timezone
from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.agent_runs.models import AgentRun


async def create_agent_run(
  db: AsyncSession,
  trip_id: uuid.UUID,
  input_snapshot: dict[str, Any],
) -> AgentRun:
  agent_run = AgentRun(
    trip_id=trip_id,
    status="pending",
    attempt=1,
    input_snapshot=input_snapshot,
  )

  db.add(agent_run)

  await db.commit()
  await db.refresh(agent_run)

  return agent_run


async def get_agent_run(
  db: AsyncSession,
  agent_run_id: uuid.UUID,
) -> AgentRun | None:
  result = await db.execute(
    select(AgentRun).where(
      AgentRun.id == agent_run_id
    )
  )

  return result.scalar_one_or_none()


async def mark_agent_run_running(
  db: AsyncSession,
  agent_run: AgentRun,
  current_step: str,
) -> AgentRun:
  agent_run.status = "running"
  agent_run.current_step = current_step
  agent_run.started_at = datetime.now(
    timezone.utc
  )
  agent_run.error_message = None

  await db.commit()
  await db.refresh(agent_run)

  return agent_run


async def update_agent_run_step(
  db: AsyncSession,
  agent_run: AgentRun,
  current_step: str,
) -> AgentRun:
  agent_run.current_step = current_step

  await db.commit()
  await db.refresh(agent_run)

  return agent_run


async def mark_agent_run_completed(
  db,
  agent_run,
  commit: bool = True,
):
  agent_run.status = "completed"
  agent_run.current_step = "completed"
  agent_run.completed_at = datetime.now(
    timezone.utc
  )

  if commit:
    await db.commit()
    await db.refresh(agent_run)
  else:
    await db.flush()

  return agent_run


async def mark_agent_run_failed(
  db: AsyncSession,
  agent_run: AgentRun,
  error_message: str,
) -> AgentRun:
  agent_run.status = "failed"
  agent_run.current_step = "failed"
  agent_run.error_message = error_message
  agent_run.completed_at = datetime.now(
    timezone.utc
  )

  await db.commit()
  await db.refresh(agent_run)

  return agent_run