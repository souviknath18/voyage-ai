from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.dependencies import get_db
from app.modules.auth.dependencies import get_current_user
from app.modules.users.models import User

from app.modules.places.schemas import (
  SavedTripPlaceResponse,
)
from app.modules.places.service import (
  get_user_saved_places,
)


router = APIRouter()


@router.get(
  "/saved",
  response_model=list[SavedTripPlaceResponse],
)
async def get_saved_places(
  db: AsyncSession = Depends(get_db),
  current_user: User = Depends(get_current_user),
):
  return await get_user_saved_places(
    db=db,
    user_id=current_user.id,
  )