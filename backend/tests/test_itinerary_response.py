from unittest.mock import MagicMock, patch

from app.modules.itineraries.router import (
  build_itinerary_response,
)


def test_itinerary_response_includes_overlap_warning():
  itinerary = MagicMock()

  itinerary_data = {
    "days": [
      {
        "day_number": 1,
        "activities": [
          {
            "time": "9:00 AM",
            "title": "Museum Visit",
            "duration_minutes": 180,
          },
          {
            "time": "11:00 AM",
            "title": "Lunch",
            "duration_minutes": 60,
          },
        ],
      }
    ]
  }

  with (
    patch(
      "app.modules.itineraries.router.serialize_itinerary",
      return_value=itinerary_data,
    ),
    patch(
      "app.modules.itineraries.router.ItineraryResponse.model_validate"
    ) as mock_validate,
  ):
    mock_validate.return_value = MagicMock()

    build_itinerary_response(itinerary)

    mock_validate.return_value.model_copy.assert_called_once_with(
      update={
        "validation_warnings": [
          "Day 1: 'Museum Visit' overlaps with "
          "'Lunch' by 60 minutes."
        ]
      }
    )