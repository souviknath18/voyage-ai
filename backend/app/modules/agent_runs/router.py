import uuid
from fastapi import (
  APIRouter,
  Depends,
  status,
)
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.dependencies import get_db
from app.modules.auth.dependencies import (
  get_current_user,
)
from app.modules.users.models import User

from app.modules.agent_runs.schemas import (
  AgentRunResponse,
)
from app.modules.agent_runs.service import (
  start_agent_run,
  get_user_agent_run_status,
  get_user_agent_run_activity,
)
from app.modules.agent_runs.activity_schemas import (
  AgentRunActivityResponse,
)

router = APIRouter()


@router.post(
  "/{trip_id}/plan",
  response_model=AgentRunResponse,
  status_code=status.HTTP_202_ACCEPTED,
)
async def plan_trip(
  trip_id: str,
  db: AsyncSession = Depends(get_db),
  current_user: User = Depends(
    get_current_user
  ),
):
  return await start_agent_run(
    db=db,
    public_trip_id=trip_id,
    user_id=current_user.id,
  )


@router.get(
  "/agent-runs/{agent_run_id}",
  response_model=AgentRunResponse,
)
async def get_agent_run_status(
  agent_run_id: uuid.UUID,
  db: AsyncSession = Depends(get_db),
  current_user: User = Depends(
    get_current_user
  ),
):
  return await get_user_agent_run_status(
    db=db,
    agent_run_id=agent_run_id,
    user_id=current_user.id,
  )


@router.get(
  "/agent-runs/{agent_run_id}/activity",
  response_model=AgentRunActivityResponse,
)
async def get_agent_run_activity(
  agent_run_id: uuid.UUID,
  db: AsyncSession = Depends(get_db),
  current_user: User = Depends(
    get_current_user
  ),
):
  return await get_user_agent_run_activity(
    db=db,
    agent_run_id=agent_run_id,
    user_id=current_user.id,
  )