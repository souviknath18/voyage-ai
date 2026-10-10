from app.ai.planning.itinerary_dates import (
  normalize_itinerary_dates,
)


def test_normalization_preserves_activity_duration():
  itinerary = {
    "days": [
      {
        "day_number": 5,
        "date": "2026-10-20",
        "activities": [
          {
            "title": "Museum Visit",
            "time": "9:00 AM",
            "duration_minutes": 120,
          }
        ],
      }
    ]
  }

  result = normalize_itinerary_dates(
    itinerary,
    start_date="2026-10-15",
    end_date="2026-10-15",
  )

  assert result["days"][0]["day_number"] == 1
  assert result["days"][0]["date"] == "2026-10-15"
  assert (
    result["days"][0]["activities"][0]["duration_minutes"]
    == 120
  )