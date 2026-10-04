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
  ItineraryVersionResponse,
)
from app.modules.itineraries.service import (
  get_trip_itinerary,
  get_trip_itinerary_version,
  list_trip_itinerary_versions,
  restore_trip_itinerary_version,
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


@router.get(
  "/{trip_id}/itineraries",
  response_model=list[
    ItineraryVersionResponse
  ],
)
async def get_itinerary_versions(
  trip_id: str,
  db: AsyncSession = Depends(get_db),
  current_user: User = Depends(
    get_current_user
  ),
):
  return await list_trip_itinerary_versions(
    db=db,
    public_trip_id=trip_id,
    user_id=current_user.id,
  )


@router.get(
  "/{trip_id}/itineraries/{version}",
  response_model=ItineraryResponse,
)
async def get_itinerary_version(
  trip_id: str,
  version: int,
  db: AsyncSession = Depends(get_db),
  current_user: User = Depends(
    get_current_user
  ),
):
  return await get_trip_itinerary_version(
    db=db,
    public_trip_id=trip_id,
    user_id=current_user.id,
    version=version,
  )


@router.post(
  "/{trip_id}/itineraries/{version}/restore",
  response_model=ItineraryResponse,
)
async def restore_itinerary_version(
  trip_id: str,
  version: int,
  db: AsyncSession = Depends(get_db),
  current_user: User = Depends(
    get_current_user
  ),
):
  return await restore_trip_itinerary_version(
    db=db,
    public_trip_id=trip_id,
    user_id=current_user.id,
    version=version,
  )