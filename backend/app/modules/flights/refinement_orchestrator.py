
import logging
import uuid

from fastapi import HTTPException, status
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.flights.refinement_adapter import (
  refine_trip_flight_response,
)
from app.modules.flights.refinement_schemas import (
  FlightRefinementPreferences,
)
from app.modules.flights.refinement_service import (
  extract_flight_preferences,
)
from app.modules.flights.schemas import (
  TripFlightsResponse,
)
from app.modules.flights.service import (
  get_trip_flights,
)


logger = logging.getLogger(__name__)


async def refine_trip_flights(
  *,
  db: AsyncSession,
  public_trip_id: str,
  user_id: uuid.UUID,
  message: str,
) -> dict:
  """
  Refine available trip flight offers using
  AI-extracted preferences.

  This service is independent of the
  underlying flight provider.
  """

  # 1. Retrieve existing trip flight offers.
  # This preserves the current trip ownership
  # checks and flight-search behavior.
  flight_data = await get_trip_flights(
    db=db,
    public_trip_id=public_trip_id,
    user_id=user_id,
  )

  try:
    flights = TripFlightsResponse.model_validate(
      flight_data
    )
  except ValidationError:
    logger.exception(
      "Invalid flight response for trip %s",
      public_trip_id,
    )
    raise HTTPException(
      status_code=status.HTTP_502_BAD_GATEWAY,
      detail="Flight data is temporarily unavailable.",
    )

  # 2. Extract structured preferences.
  try:
    preferences: FlightRefinementPreferences = (
      await extract_flight_preferences(
        message=message,
        currency=flights.currency,
      )
    )
  except Exception:
    logger.exception(
      "AI flight preference extraction failed"
    )
    raise HTTPException(
      status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
      detail=(
        "AI flight refinement is temporarily "
        "unavailable. Please try again."
      ),
    )

  # 3. Apply provider-independent filtering.
  try:
    refined = refine_trip_flight_response(
      flights=flights,
      preferences=preferences,
    )
  except Exception:
    logger.exception(
      "Flight filtering failed for trip %s",
      public_trip_id,
    )
    raise HTTPException(
      status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
      detail="Unable to refine flight offers.",
    )

  # 4. Build a user-friendly explanation.
  original_count = len(flights.offers)
  matching_count = len(refined.offers)

  if matching_count == 0:
    explanation = (
      "No available flights match all your "
      "preferences. Try relaxing your price, "
      "stop, airline, or departure-time limits."
    )
  else:
    explanation = (
      f"Found {matching_count} matching flight"
      f"{'s' if matching_count != 1 else ''} "
      f"from {original_count} available offers."
    )

  return {
    **refined.model_dump(mode="json"),
    "preferences": preferences.model_dump(
      mode="json"
    ),
    "explanation": explanation,
    "total_offers": original_count,
    "matching_offers": matching_count,
  }