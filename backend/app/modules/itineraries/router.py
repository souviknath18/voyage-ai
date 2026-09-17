from fastapi import (
  APIRouter,
  Depends,
)
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.dependencies import get_db
from app.modules.auth.dependencies import (
  get_current_user,
)
from app.modules.itineraries.schemas import (
  ItineraryResponse,
)
from app.modules.itineraries.service import (
  get_trip_itinerary,
)
from app.modules.users.models import User


router = APIRouter()


@router.get(
  "/{trip_id}/itinerary",
  response_model=ItineraryResponse,
)
async def get_itinerary(
  trip_id: str,
  db: AsyncSession = Depends(get_db),
  current_user: User = Depends(
    get_current_user
  ),
):
  return await get_trip_itinerary(
    db=db,
    public_trip_id=trip_id,
    user_id=current_user.id,
  )