from fastapi import (
  APIRouter,
  Depends,
)
from sqlalchemy.ext.asyncio import (
  AsyncSession,
)

from app.db.dependencies import get_db
from app.modules.auth.dependencies import (
  get_current_user,
)
from app.modules.flights.schemas import (
  SelectFlightRequest,
  SelectedFlightResponse,
  TripFlightsResponse,
)
from app.modules.flights.service import (
  get_trip_flights,
  get_trip_selected_flight,
  select_trip_flight,
  clear_trip_selected_flight,
)
from app.modules.users.models import User


router = APIRouter()


@router.get(
  "/{trip_id}/flights",
  response_model=TripFlightsResponse,
)
async def get_flights(
  trip_id: str,
  db: AsyncSession = Depends(
    get_db
  ),
  current_user: User = Depends(
    get_current_user
  ),
):
  return await get_trip_flights(
    db=db,
    public_trip_id=trip_id,
    user_id=current_user.id,
  )


@router.put(
  "/{trip_id}/flights/selected",
  response_model=SelectedFlightResponse,
)
async def select_flight(
  trip_id: str,
  payload: SelectFlightRequest,
  db: AsyncSession = Depends(
    get_db
  ),
  current_user: User = Depends(
    get_current_user
  ),
):
  return await select_trip_flight(
    db=db,
    public_trip_id=trip_id,
    user_id=current_user.id,
    offer_id=payload.offer_id,
  )


@router.get(
  "/{trip_id}/flights/selected",
  response_model=SelectedFlightResponse | None,
)
async def get_selected_flight(
  trip_id: str,
  db: AsyncSession = Depends(
    get_db
  ),
  current_user: User = Depends(
    get_current_user
  ),
):
  return await get_trip_selected_flight(
    db=db,
    public_trip_id=trip_id,
    user_id=current_user.id,
  )


@router.delete(
  "/{trip_id}/flights/selected",
)
async def delete_selected_flight_endpoint(
  trip_id: str,
  db: AsyncSession = Depends(get_db),
  current_user: User = Depends(get_current_user),
):
  deleted = await clear_trip_selected_flight(
    db=db,
    public_trip_id=trip_id,
    user_id=current_user.id,
  )

  return {"deleted": deleted}