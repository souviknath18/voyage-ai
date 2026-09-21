from fastapi import (
  APIRouter,
  Depends,
)
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.dependencies import get_db
from app.modules.auth.dependencies import (
  get_current_user,
)
from app.modules.budgets.schemas import (
  BudgetResponse,
)
from app.modules.budgets.service import (
  get_trip_budget,
)
from app.modules.users.models import User


router = APIRouter()


@router.get(
  "/{trip_id}/budget",
  response_model=BudgetResponse,
)
async def get_budget(
  trip_id: str,
  db: AsyncSession = Depends(get_db),
  current_user: User = Depends(
    get_current_user
  ),
):
  return await get_trip_budget(
    db=db,
    public_trip_id=trip_id,
    user_id=current_user.id,
  )