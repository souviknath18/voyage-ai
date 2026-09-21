import logging
import uuid

import httpx

from fastapi import (
  HTTPException,
  status,
)

from sqlalchemy.ext.asyncio import (
  AsyncSession,
)

from app.core.config import settings

from app.modules.itineraries.repository import (
  get_itinerary_by_trip_id,
)

from app.modules.places.repository import (
  get_trip_places,
)

from app.modules.trips.service import (
  get_user_trip,
)


logger = logging.getLogger(__name__)


GEOAPIFY_STATIC_MAP_URL = (
  "https://maps.geoapify.com/v1/staticmap"
)


async def get_trip_map_preview(
  db: AsyncSession,
  public_trip_id: str,
  user_id: uuid.UUID,
  day_number: int,
) -> tuple[bytes, str]:
    """
    Generate a static map preview for
    one itinerary day.

    The Geoapify API key stays entirely
    on the backend.
    """

    # ---------------------------------
    # Verify trip ownership
    # ---------------------------------

    trip = await get_user_trip(
      db=db,
      trip_id=public_trip_id,
      user_id=user_id,
    )


    # ---------------------------------
    # Load itinerary
    # ---------------------------------

    itinerary = (
      await get_itinerary_by_trip_id(
        db=db,
        trip_id=trip.id,
      )
    )


    if itinerary is None:
      raise HTTPException(
        status_code=(
          status.HTTP_404_NOT_FOUND
        ),
        detail="Itinerary not found",
      )


    # ---------------------------------
    # Find requested day
    # ---------------------------------

    itinerary_day = next(
      (
        day
        for day in itinerary.days
        if (
          day.day_number
          == day_number
        )
      ),
      None,
    )


    if itinerary_day is None:
      raise HTTPException(
        status_code=(
          status.HTTP_404_NOT_FOUND
        ),
        detail=(
          "Itinerary day not found"
        ),
      )


    # ---------------------------------
    # Get verified itinerary place IDs
    #
    # Preserve activity order.
    # ---------------------------------

    itinerary_place_ids = [
      activity.place_id
      for activity
      in itinerary_day.activities
      if (
        activity.activity_type
        == "verified_place"
        and activity.place_id
      )
    ]


    if not itinerary_place_ids:
      raise HTTPException(
        status_code=(
          status.HTTP_404_NOT_FOUND
        ),
        detail=(
          "No mapped places "
          "for this day"
        ),
      )


    # ---------------------------------
    # Load persisted provider places
    # ---------------------------------

    stored_places = (
      await get_trip_places(
        db=db,
        trip_id=trip.id,
      )
    )


    places_by_provider_id = {
      place.provider_place_id:
        place
      for place in stored_places
    }


    # ---------------------------------
    # Keep only itinerary-used places
    # and retain itinerary ordering.
    # ---------------------------------

    ordered_places = [
      places_by_provider_id[
        provider_place_id
      ]
      for provider_place_id
      in itinerary_place_ids
      if (
        provider_place_id
        in places_by_provider_id
      )
    ]


    if not ordered_places:
      raise HTTPException(
        status_code=(
          status.HTTP_404_NOT_FOUND
        ),
        detail=(
          "No mapped places "
          "for this day"
        ),
      )


    # ---------------------------------
    # Geoapify markers
    #
    # Keep this deliberately minimal
    # until the provider request is
    # confirmed working.
    # ---------------------------------

    markers = [
      {
        "lat": float(
          place.latitude
        ),
        "lon": float(
          place.longitude
        ),
        "color": "#fb7185",
        "size": 44,
        "text": str(index),
      }
      for index, place
      in enumerate(
        ordered_places,
        start=1,
      )
    ]


    # ---------------------------------
    # Static Map request
    #
    # Geoapify automatically fits the
    # map around markers when center /
    # area are not supplied.
    # ---------------------------------

    request_body = {
      "style": "osm-bright-grey",

      "width": 800,
      "height": 800,

      "scaleFactor": 1,

      "markers": markers,
    }


    # ---------------------------------
    # Call Geoapify
    # ---------------------------------

    try:
      async with httpx.AsyncClient(
        timeout=30.0,
      ) as client:
        response = await client.post(
          GEOAPIFY_STATIC_MAP_URL,
          params={
            "apiKey": (
              settings
              .geoapify_api_key
            ),
          },
          json=request_body,
        )


        response.raise_for_status()


    except httpx.HTTPStatusError as exc:
        provider_status = (
          exc.response.status_code
        )

        provider_body = (
          exc.response.text
        )


        logger.error(
          (
            "Geoapify static map "
            "returned HTTP %s: %s"
          ),
          provider_status,
          provider_body,
        )


        raise HTTPException(
          status_code=(
            status.HTTP_502_BAD_GATEWAY
          ),
          detail=(
            "Geoapify static map "
            f"failed with HTTP "
            f"{provider_status}: "
            f"{provider_body[:300]}"
          ),
        ) from exc


    except httpx.RequestError as exc:
      logger.exception(
        (
          "Could not connect to "
          "Geoapify Static Maps"
        )
      )


      raise HTTPException(
        status_code=(
          status.HTTP_502_BAD_GATEWAY
        ),
        detail=(
          "Could not connect to "
          "Geoapify Static Maps"
        ),
      ) from exc


    # ---------------------------------
    # Validate response
    # ---------------------------------

    content_type = (
      response.headers.get(
        "content-type",
        "",
      )
    )


    if not content_type.startswith(
      "image/"
    ):
      logger.error(
        (
          "Geoapify returned "
          "unexpected content "
          "type %s: %s"
        ),
        content_type,
        response.text[:300],
      )


      raise HTTPException(
        status_code=(
          status.HTTP_502_BAD_GATEWAY
        ),
        detail=(
          "Map provider returned "
          "an invalid image response"
        ),
      )


    return (
      response.content,
      content_type,
    )