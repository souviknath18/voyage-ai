from fastapi import (
  APIRouter,
  Depends,
)
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.dependencies import get_db
from app.modules.auth.dependencies import get_current_user
from app.modules.users.models import User
from app.modules.weather.schemas import (
  TripWeatherResponse,
)
from app.modules.weather.service import (
  get_trip_weather,
)


router = APIRouter()


@router.get(
  "/trips/{trip_id}/weather",
  response_model=TripWeatherResponse,
)
async def get_weather_for_trip(
  trip_id: str,
  db: AsyncSession = Depends(get_db),
  current_user: User = Depends(
    get_current_user
  ),
):
  return await get_trip_weather(
    db=db,
    trip_id=trip_id,
    user_id=current_user.id,
  )