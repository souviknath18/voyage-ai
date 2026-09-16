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
)


router = APIRouter()


@router.post(
  "/{trip_id}/plan",
  response_model=AgentRunResponse,
  status_code=status.HTTP_201_CREATED,
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