from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.tools.weather import get_weather
from app.modules.trips.service import get_user_trip


async def get_trip_weather(
  db: AsyncSession,
  trip_id: str,
  user_id,
) -> dict:
  trip = await get_user_trip(
    db=db,
    trip_id=trip_id,
    user_id=user_id,
  )

  if (
    trip.destination_latitude is None
    or trip.destination_longitude is None
  ):
    raise HTTPException(
      status_code=status.HTTP_400_BAD_REQUEST,
      detail=(
        "Trip destination has not been resolved."
      ),
    )

  weather = await get_weather(
    destination=(
      trip.destination_name
      or trip.destination
    ),
    latitude=float(
      trip.destination_latitude
    ),
    longitude=float(
      trip.destination_longitude
    ),
    timezone=trip.destination_timezone,
    start_date=trip.start_date.isoformat(),
    end_date=trip.end_date.isoformat(),
  )

  return {
    "destination": (
      trip.destination_name
      or trip.destination
    ),
    "country": trip.destination_country,
    "timezone": trip.destination_timezone,
    "source": weather["source"],
    "forecast_available_until": (
      weather.get(
        "forecast_available_until"
      )
    ),
    "forecast": weather.get(
      "forecast",
      [],
    ),
  }