from fastapi import (
  APIRouter,
  Depends,
)
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.dependencies import get_db
from app.modules.auth.dependencies import (
  get_current_user,
)
from app.modules.users.models import User

from app.modules.trip_preferences.schemas import (
  TripPreferenceCreate,
  TripPreferenceResponse,
)
from app.modules.trip_preferences.service import (
  get_user_trip_preference,
  save_user_trip_preference,
)


router = APIRouter()


@router.get(
  "/{trip_id}/preferences",
  response_model=TripPreferenceResponse,
)
async def get_trip_preferences(
  trip_id: str,
  db: AsyncSession = Depends(get_db),
  current_user: User = Depends(
    get_current_user
  ),
):
  return await get_user_trip_preference(
    db=db,
    public_trip_id=trip_id,
    user_id=current_user.id,
  )


@router.put(
  "/{trip_id}/preferences",
  response_model=TripPreferenceResponse,
)
async def save_trip_preferences(
  trip_id: str,
  data: TripPreferenceCreate,
  db: AsyncSession = Depends(get_db),
  current_user: User = Depends(
    get_current_user
  ),
):
  return await save_user_trip_preference(
    db=db,
    public_trip_id=trip_id,
    user_id=current_user.id,
    preference_data=data.model_dump(),
  )