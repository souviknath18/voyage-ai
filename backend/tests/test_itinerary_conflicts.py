from app.ai.planning.itinerary_conflicts import (
  detect_itinerary_conflicts,
)


def test_duplicate_activity_times():
  days = [
    {
      "day_number": 1,
      "activities": [
        {"time": "10:00 AM", "title": "Visit Merlion Park"},
        {"time": "10:00 AM", "title": "Visit Esplanade Park"},
        {"time": "1:00 PM", "title": "Lunch"},
      ],
    }
  ]

  warnings = detect_itinerary_conflicts(days)

  assert len(warnings) == 1
  assert "Day 1" in warnings[0]
  assert "10:00 AM" in warnings[0]


def test_overlapping_activities():
  days = [
    {
      "day_number": 1,
      "activities": [
        {
          "time": "10:00 AM",
          "title": "Museum Visit",
          "duration_minutes": 120,
        },
        {
          "time": "11:30 AM",
          "title": "Lunch",
          "duration_minutes": 60,
        },
      ],
    }
  ]

  warnings = detect_itinerary_conflicts(days)

  assert len(warnings) == 1
  assert "Day 1" in warnings[0]
  assert "Museum Visit" in warnings[0]
  assert "Lunch" in warnings[0]
  assert "30 minutes" in warnings[0]


def test_non_overlapping_activities():
  days = [
    {
      "day_number": 1,
      "activities": [
        {
          "time": "10:00 AM",
          "title": "Museum Visit",
          "duration_minutes": 90,
        },
        {
          "time": "11:30 AM",
          "title": "Lunch",
          "duration_minutes": 60,
        },
      ],
    }
  ]

  assert detect_itinerary_conflicts(days) == []


def test_missing_duration_does_not_create_overlap():
  days = [
    {
      "day_number": 1,
      "activities": [
        {"time": "10:00 AM", "title": "Museum Visit"},
        {
          "time": "11:00 AM",
          "title": "Lunch",
          "duration_minutes": 60,
        },
      ],
    }
  ]

  assert detect_itinerary_conflicts(days) == []


def test_overlap_warning_message():
  days = [
    {
      "day_number": 2,
      "activities": [
        {
          "time": "9:00 AM",
          "title": "City Walking Tour",
          "duration_minutes": 180,
        },
        {
          "time": "11:00 AM",
          "title": "Museum Visit",
          "duration_minutes": 120,
        },
      ],
    }
  ]

  warnings = detect_itinerary_conflicts(days)

  assert len(warnings) == 1
  assert warnings[0] == (
    "Day 2: 'City Walking Tour' overlaps with "
    "'Museum Visit' by 60 minutes."
  )