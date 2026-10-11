import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.dependencies import get_db

from app.modules.auth.dependencies import (
  get_current_user,
)

from app.modules.places.schemas import (
  TripPlaceResponse,
  SetPlaceSavedRequest,
)

from app.modules.places.service import (
  get_places_for_trip,
  set_place_saved_for_trip,
)

from app.modules.users.models import User


router = APIRouter()


@router.get(
  "/{trip_id}/places",
  response_model=list[TripPlaceResponse],
)
async def get_places(
  trip_id: str,
  db: AsyncSession = Depends(get_db),
  current_user: User = Depends(get_current_user),
):
  return await get_places_for_trip(
    db=db,
    public_trip_id=trip_id,
    user_id=current_user.id,
  )


@router.put(
  "/{trip_id}/places/{place_id}/saved",
  response_model=TripPlaceResponse,
)
async def set_place_saved(
  trip_id: str,
  place_id: uuid.UUID,
  payload: SetPlaceSavedRequest,
  db: AsyncSession = Depends(get_db),
  current_user: User = Depends(get_current_user),
):
  return await set_place_saved_for_trip(
    db=db,
    public_trip_id=trip_id,
    user_id=current_user.id,
    place_id=place_id,
    is_saved=payload.is_saved,
  )