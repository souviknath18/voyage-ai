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
from app.modules.trip_assistant.schemas import (
  TripAssistantApplyRequest,
  TripAssistantRequest,
  TripAssistantResponse,
)
from app.modules.agent_runs.schemas import (
  AgentRunResponse,
)
from app.modules.trip_assistant.service import (
  apply_trip_assistant_proposal,
  ask_trip_assistant,
)
from app.modules.users.models import User


router = APIRouter()


@router.post(
  "/{trip_id}/assistant/messages",
  response_model=TripAssistantResponse,
)
async def send_trip_assistant_message(
  trip_id: str,
  data: TripAssistantRequest,
  db: AsyncSession = Depends(get_db),
  current_user: User = Depends(
    get_current_user
  ),
):
  return await ask_trip_assistant(
    db=db,
    public_trip_id=trip_id,
    user_id=current_user.id,
    message=data.message,
  )


@router.post(
  "/{trip_id}/assistant/apply",
  response_model=AgentRunResponse,
  status_code=status.HTTP_202_ACCEPTED,
)
async def apply_trip_assistant_change(
  trip_id: str,
  data: TripAssistantApplyRequest,
  db: AsyncSession = Depends(get_db),
  current_user: User = Depends(
    get_current_user
  ),
):
  return await apply_trip_assistant_proposal(
    db=db,
    public_trip_id=trip_id,
    user_id=current_user.id,
    proposal=data.proposal,
  )