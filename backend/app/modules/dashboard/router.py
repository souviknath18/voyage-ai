
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.dependencies import get_db
from app.modules.auth.dependencies import get_current_user
from app.modules.users.models import User

from app.modules.dashboard.schemas import (
  DashboardSummaryResponse,
)
from app.modules.dashboard.service import (
  get_dashboard_summary,
)


router = APIRouter(
  prefix="/dashboard",
  tags=["Dashboard"],
)


@router.get(
  "/summary",
  response_model=DashboardSummaryResponse,
  summary="Get dashboard summary",
  description=(
    "Retrieve dashboard statistics, upcoming trip, "
    "and recent AI activity for the authenticated user."
  ),
)
async def dashboard_summary(
  db: AsyncSession = Depends(get_db),
  current_user: User = Depends(get_current_user),
) -> DashboardSummaryResponse:

  return await get_dashboard_summary(
    db=db,
    user_id=current_user.id,
  )