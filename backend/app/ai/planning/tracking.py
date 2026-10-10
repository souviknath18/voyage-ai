import inspect
from typing import Callable
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import AsyncSessionLocal
from app.modules.agent_runs.models import AgentRun
from app.modules.agent_runs.repository import (
    update_agent_run_step,
)
from app.modules.agent_steps.repository import (
    create_agent_step,
    mark_agent_step_completed,
    mark_agent_step_failed,
)


def tracked_step(
    *,
    db: AsyncSession,
    agent_run: AgentRun,
    step_name: str,
    node: Callable,
    inject_context: bool = False,
):
    agent_run_id: UUID = agent_run.id

    async def wrapper(state):
        # Short transaction: mark step as running.
        async with AsyncSessionLocal() as tracking_db:
            async with tracking_db.begin():
                tracking_run = await tracking_db.get(
                    AgentRun,
                    agent_run_id,
                )

                if tracking_run is None:
                    raise ValueError(
                        f"Agent run {agent_run_id} not found."
                    )

                await update_agent_run_step(
                    db=tracking_db,
                    agent_run=tracking_run,
                    current_step=step_name,
                    commit=False,
                )

                agent_step = await create_agent_step(
                    db=tracking_db,
                    agent_run_id=agent_run_id,
                    step_name=step_name,
                    attempt=1,
                )

                agent_step_id = agent_step.id

        try:
            if inject_context:
                result = node(
                    state,
                    db=db,
                    agent_step_id=agent_step_id,
                )
            else:
                result = node(state)

            if inspect.isawaitable(result):
                result = await result

        except Exception as exc:
            async with AsyncSessionLocal() as tracking_db:
                async with tracking_db.begin():
                    failed_step = await tracking_db.get(
                        type(agent_step),
                        agent_step_id,
                    )

                    if failed_step is not None:
                        await mark_agent_step_failed(
                            db=tracking_db,
                            agent_step=failed_step,
                            error_message=str(exc),
                        )

            raise

        # Short transaction: mark step as completed.
        async with AsyncSessionLocal() as tracking_db:
            async with tracking_db.begin():
                completed_step = await tracking_db.get(
                    type(agent_step),
                    agent_step_id,
                )

                if completed_step is not None:
                    await mark_agent_step_completed(
                        db=tracking_db,
                        agent_step=completed_step,
                        output_data=None,
                    )

        return result

    return wrapper