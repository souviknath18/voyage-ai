
from decimal import Decimal

from app.modules.hotels.schemas import (
  RankedHotelOffer,
  TripHotelsResponse,
)
from app.modules.hotels.refinement_schemas import (
  HotelRefinementPreferences,
)


def normalize_text(value: str) -> str:
  """Normalize text for case-insensitive matching."""
  return " ".join(value.casefold().split())


def has_breakfast_included(
  offer: RankedHotelOffer,
) -> bool:
  """
  Check whether breakfast is included
  in the offered room's board type.
  """
  board_type = normalize_text(
    offer.room.board_type or ""
  )

  return (
    "breakfast" in board_type
    and not any(
      excluded in board_type
      for excluded in (
        "no breakfast",
        "without breakfast",
        "breakfast excluded",
        "breakfast not included",
      )
    )
  )


def matches_amenities(
  offer: RankedHotelOffer,
  required_amenities: list[str],
) -> bool:
  """
  Require every requested amenity to
  appear in the hotel's available data.
  """
  available = [
    normalize_text(amenity)
    for amenity in offer.amenities
  ]

  aliases = {
    "wifi": ("wifi", "wi-fi", "wireless internet"),
    "wi-fi": ("wifi", "wi-fi", "wireless internet"),
    "gym": ("gym", "fitness center", "fitness centre"),
    "pool": ("pool", "swimming pool"),
    "parking": ("parking", "car park"),
    "ac": ("air conditioning", "air conditioner", "a/c"),
  }

  for requested in required_amenities:
    name = normalize_text(requested)

    if not name:
      continue

    accepted = aliases.get(name, (name,))

    if not any(
      accepted_name in amenity
      for accepted_name in accepted
      for amenity in available
    ):
      return False

  return True


def matches_hotel_preferences(
  offer: RankedHotelOffer,
  preferences: HotelRefinementPreferences,
) -> bool:
  """Apply all explicitly requested constraints."""

  if preferences.max_total_price is not None:
    maximum = Decimal(
      str(preferences.max_total_price)
    )

    if offer.converted_price > maximum:
      return False

  if preferences.max_price_per_night is not None:
    maximum_nightly = Decimal(
      str(preferences.max_price_per_night)
    )

    if (
      offer.converted_price_per_night
      > maximum_nightly
    ):
      return False

  if preferences.min_rating is not None:
    if (
      offer.rating is None
      or offer.rating < preferences.min_rating
    ):
      return False

  if preferences.min_star_rating is not None:
    if (
      offer.star_rating is None
      or offer.star_rating
      < preferences.min_star_rating
    ):
      return False

  if (
    preferences.refundable_only
    and offer.room.refundable is not True
  ):
    return False

  if (
    preferences.breakfast_included
    and not has_breakfast_included(offer)
  ):
    return False

  if not matches_amenities(
    offer,
    preferences.required_amenities,
  ):
    return False

  return True


def refine_hotels(
  offers: list[RankedHotelOffer],
  preferences: HotelRefinementPreferences,
) -> list[RankedHotelOffer]:
  """
  Filter and sort existing hotel offers.

  Preserve the original ranking for
  'best' sorting.
  """

  filtered = [
    offer
    for offer in offers
    if matches_hotel_preferences(
      offer,
      preferences,
    )
  ]

  if preferences.sort_by == "cheapest":
    return sorted(
      filtered,
      key=lambda offer: (
        offer.converted_price,
        -offer.ranking_score,
      ),
    )

  if preferences.sort_by == "highest_rated":
    return sorted(
      filtered,
      key=lambda offer: (
        offer.rating is None,
        -(offer.rating or 0),
        offer.converted_price,
      ),
    )

  return sorted(
    filtered,
    key=lambda offer: (
      -offer.ranking_score,
      offer.converted_price,
    ),
  )


def refine_trip_hotel_response(
  hotels: TripHotelsResponse,
  preferences: HotelRefinementPreferences,
) -> TripHotelsResponse:
  """
  Preserve existing trip metadata while
  replacing offers with filtered results.
  """

  refined_offers = refine_hotels(
    offers=hotels.offers,
    preferences=preferences,
  )

  available_ids = {
    offer.id for offer in refined_offers
  }

  recommended_id = (
    hotels.recommended_hotel_id
    if hotels.recommended_hotel_id in available_ids
    else (
      refined_offers[0].id
      if refined_offers
      else None
    )
  )

  return hotels.model_copy(
    update={
      "offers": refined_offers,
      "recommended_hotel_id": recommended_id,
    }
  )