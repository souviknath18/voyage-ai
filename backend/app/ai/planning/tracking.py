import inspect
from typing import Callable

from sqlalchemy.ext.asyncio import AsyncSession

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
    async def wrapper(state):
        await update_agent_run_step(
            db=db,
            agent_run=agent_run,
            current_step=step_name,
        )

        agent_step = await create_agent_step(
            db=db,
            agent_run_id=agent_run.id,
            step_name=step_name,
            attempt=1,
        )

        try:
            if inject_context:
                result = node(
                    state,
                    db=db,
                    agent_step_id=agent_step.id,
                )
            else:
                result = node(state)

            if inspect.isawaitable(result):
                result = await result

            await mark_agent_step_completed(
                db=db,
                agent_step=agent_step,
                output_data=None,
            )

            return result

        except Exception as exc:
            await mark_agent_step_failed(
                db=db,
                agent_step=agent_step,
                error_message=str(exc),
            )

            raise

    return wrapper