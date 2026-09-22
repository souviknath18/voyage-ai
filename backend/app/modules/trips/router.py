from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.dependencies import get_db
from app.modules.auth.dependencies import get_current_user
from app.modules.users.models import User
from app.modules.trips.schemas import (
  TripCreate,
  TripResponse,
  TripUpdate,
  TripDestinationRequest,
  TripOriginRequest,
)
from app.modules.trips.service import (
  create_user_trip,
  delete_user_trip,
  get_user_trip,
  list_user_trips,
  update_user_trip,
  set_trip_destination,
  set_trip_origin,
)


router = APIRouter()


@router.post(
  "",
  response_model=TripResponse,
  status_code=status.HTTP_201_CREATED,
)
async def create_trip(
  data: TripCreate,
  db: AsyncSession = Depends(get_db),
  current_user: User = Depends(get_current_user),
):
  return await create_user_trip(
    db=db,
    user_id=current_user.id,
    data=data,
  )


@router.get(
  "",
  response_model=list[TripResponse],
)
async def get_trips(
  db: AsyncSession = Depends(get_db),
  current_user: User = Depends(get_current_user),
):
  return await list_user_trips(
    db=db,
    user_id=current_user.id,
  )


@router.get(
  "/{trip_id}",
  response_model=TripResponse,
)
async def get_trip(
  trip_id: str,
  db: AsyncSession = Depends(get_db),
  current_user: User = Depends(
    get_current_user
  ),
):
  return await get_user_trip(
    db=db,
    trip_id=trip_id,
    user_id=current_user.id,
  )


@router.patch(
  "/{trip_id}",
  response_model=TripResponse,
)
async def update_trip(
  trip_id: str,
  data: TripUpdate,
  db: AsyncSession = Depends(get_db),
  current_user: User = Depends(
    get_current_user
  ),
):
  return await update_user_trip(
    db=db,
    trip_id=trip_id,
    user_id=current_user.id,
    data=data,
  )


@router.delete(
  "/{trip_id}",
  status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_trip(
  trip_id: str,
  db: AsyncSession = Depends(get_db),
  current_user: User = Depends(
    get_current_user
  ),
):
  await delete_user_trip(
    db=db,
    trip_id=trip_id,
    user_id=current_user.id,
  )

  return Response(
    status_code=status.HTTP_204_NO_CONTENT
  )


@router.put(
  "/{trip_id}/destination",
  response_model=TripResponse,
)
async def update_destination(
  trip_id: str,
  payload: TripDestinationRequest,
  db: AsyncSession = Depends(get_db),
  current_user: User = Depends(get_current_user),
):
  return await set_trip_destination(
    db=db,
    public_trip_id=trip_id,
    user_id=current_user.id,
    destination_data=payload,
  )


@router.put(
  "/{trip_id}/origin",
  response_model=TripResponse,
)
async def update_origin(
  trip_id: str,
  payload: TripOriginRequest,
  db: AsyncSession = Depends(get_db),
  current_user: User = Depends(get_current_user),
):
  return await set_trip_origin(
    db=db,
    public_trip_id=trip_id,
    user_id=current_user.id,
    origin_data=payload,
  )