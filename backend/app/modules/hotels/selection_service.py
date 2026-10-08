
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.encoders import jsonable_encoder

from app.modules.hotels.repository import (
  get_selected_hotel,
  save_selected_hotel,
  delete_selected_hotel,
)
from app.modules.hotels.service import get_trip_hotels
from app.modules.trips.service import get_user_trip


async def select_trip_hotel(
  db: AsyncSession,
  *,
  trip_id: str,
  user_id,
  offer_id: str,
):
  trip = await get_user_trip(
    db,
    trip_id=trip_id,
    user_id=user_id,
  )

  if trip is None:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND,
      detail="Trip not found",
    )

  # Search current offers using existing LiteAPI integration.
  hotel_results = await get_trip_hotels(
    db,
    public_trip_id=trip_id,
    user_id=user_id,
  )

  offer = next(
    (
      item
      for item in hotel_results["offers"]
      if item["id"] == offer_id
    ),
    None,
  )

  if offer is None:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND,
      detail="Hotel offer is no longer available",
    )

  selected = await save_selected_hotel(
    db,
    trip_id=trip.id,
    provider_offer_id=offer["id"],
    hotel_id=offer["hotel_id"],
    hotel_name=offer["name"],
    original_price=offer["total_price"],
    original_currency=offer["currency"],
    converted_price=offer["converted_price"],
    converted_currency=offer["converted_currency"],
    exchange_rate=offer["exchange_rate"],
    hotel_snapshot=jsonable_encoder(offer),
  )

  return selected


async def get_trip_selected_hotel(
  db: AsyncSession,
  *,
  trip_id: str,
  user_id,
):
  trip = await get_user_trip(
    db,
    trip_id=trip_id,
    user_id=user_id,
  )

  if trip is None:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND,
      detail="Trip not found",
    )

  return await get_selected_hotel(db, trip.id)


async def clear_trip_selected_hotel(
  db: AsyncSession,
  *,
  trip_id: str,
  user_id,
):
  trip = await get_user_trip(
    db,
    trip_id=trip_id,
    user_id=user_id,
  )

  if trip is None:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND,
      detail="Trip not found",
    )

  return await delete_selected_hotel(db, trip.id)