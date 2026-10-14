
import logging
import uuid

from fastapi import HTTPException, status
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.hotels.refinement import (
  refine_trip_hotel_response,
)
from app.modules.hotels.refinement_schemas import (
  HotelRefinementPreferences,
  TripHotelsRefinementResponse,
)
from app.modules.hotels.refinement_service import (
  extract_hotel_preferences,
)
from app.modules.hotels.schemas import (
  TripHotelsResponse,
)
from app.modules.hotels.service import (
  get_trip_hotels,
)


logger = logging.getLogger(__name__)


async def refine_trip_hotels(
  *,
  db: AsyncSession,
  public_trip_id: str,
  user_id: uuid.UUID,
  message: str,
) -> dict:
  """
  Refine existing hotel offers using
  AI-extracted preferences.

  Reuses the existing hotel search service
  and provider-independent filtering.
  """

  # 1. Retrieve hotel offers.
  # Existing trip ownership checks apply.
  hotel_data = await get_trip_hotels(
    db=db,
    public_trip_id=public_trip_id,
    user_id=user_id,
  )

  try:
    hotels = TripHotelsResponse.model_validate(
      hotel_data
    )
  except ValidationError as exc:
    logger.exception(
      "Invalid hotel response for trip %s",
      public_trip_id,
    )
    raise HTTPException(
      status_code=status.HTTP_502_BAD_GATEWAY,
      detail="Hotel data is temporarily unavailable.",
    ) from exc

  # 2. Extract AI preferences.
  try:
    preferences: HotelRefinementPreferences = (
      await extract_hotel_preferences(
        message=message,
        currency=hotels.currency,
      )
    )
  except Exception as exc:
    logger.exception(
      "AI hotel preference extraction failed"
    )
    raise HTTPException(
      status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
      detail=(
        "AI hotel refinement is temporarily "
        "unavailable. Please try again."
      ),
    ) from exc

  # 3. Apply filtering and sorting.
  try:
    refined = refine_trip_hotel_response(
      hotels=hotels,
      preferences=preferences,
    )
  except Exception as exc:
    logger.exception(
      "Hotel filtering failed for trip %s",
      public_trip_id,
    )
    raise HTTPException(
      status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
      detail="Unable to refine hotel offers.",
    ) from exc

  # 4. Build explanation.
  original_count = len(hotels.offers)
  matching_count = len(refined.offers)

  if matching_count == 0:
    explanation = (
      "No available hotels match all your "
      "preferences. Try relaxing your price, "
      "rating, refundability, breakfast, "
      "or amenity requirements."
    )
  else:
    explanation = (
      f"Found {matching_count} matching hotel"
      f"{'s' if matching_count != 1 else ''} "
      f"from {original_count} available offers."
    )

  # 5. Validate complete response.
  response = TripHotelsRefinementResponse(
    **refined.model_dump(),
    preferences=preferences,
    explanation=explanation,
    total_offers=original_count,
    matching_offers=matching_count,
  )

  return response.model_dump(mode="json")