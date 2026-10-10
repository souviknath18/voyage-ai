
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.dependencies import get_db
from app.modules.auth.dependencies import (
  get_current_user,
)
from app.modules.hotels.schemas import (
  TripHotelsResponse,
  SelectHotelRequest,
  SelectedHotelResponse,
  RecommendedHotelResponse,
)
from app.modules.hotels.service import (
  get_trip_hotels,
)
from app.modules.users.models import User
from app.modules.hotels.selection_service import (
  select_trip_hotel,
  get_trip_selected_hotel,
  clear_trip_selected_hotel,
)
from app.modules.hotels.recommendation_service import (
  get_trip_recommended_hotel,
)


router = APIRouter()


@router.get(
  "/{trip_id}/hotels",
  response_model=TripHotelsResponse,
)
async def get_hotels(
  trip_id: str,
  db: AsyncSession = Depends(get_db),
  current_user: User = Depends(get_current_user),
):
  return await get_trip_hotels(
    db=db,
    public_trip_id=trip_id,
    user_id=current_user.id,
  )



@router.put(
  "/{trip_id}/hotels/selected",
  response_model=SelectedHotelResponse,
)
async def select_hotel_endpoint(
  trip_id: str,
  payload: SelectHotelRequest,
  db: AsyncSession = Depends(get_db),
  current_user: User = Depends(get_current_user),
):
  return await select_trip_hotel(
    db,
    trip_id=trip_id,
    user_id=current_user.id,
    offer_id=payload.offer_id,
  )


@router.get(
  "/{trip_id}/hotels/selected",
  response_model=SelectedHotelResponse | None,
)
async def get_selected_hotel_endpoint(
  trip_id: str,
  db: AsyncSession = Depends(get_db),
  current_user: User = Depends(get_current_user),
):
  return await get_trip_selected_hotel(
    db,
    trip_id=trip_id,
    user_id=current_user.id,
  )


@router.delete(
  "/{trip_id}/hotels/selected",
)
async def delete_selected_hotel_endpoint(
  trip_id: str,
  db: AsyncSession = Depends(get_db),
  current_user: User = Depends(get_current_user),
):
  deleted = await clear_trip_selected_hotel(
    db,
    trip_id=trip_id,
    user_id=current_user.id,
  )

  return {"deleted": deleted}


@router.get(
  "/{trip_id}/hotels/recommended",
  response_model=RecommendedHotelResponse | None,
)
async def get_recommended_hotel_endpoint(
  trip_id: str,
  db: AsyncSession = Depends(get_db),
  current_user: User = Depends(get_current_user),
):
  return await get_trip_recommended_hotel(
    db=db,
    trip_id=trip_id,
    user_id=current_user.id,
  )