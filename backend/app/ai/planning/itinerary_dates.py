from datetime import date, timedelta
from typing import Any


def get_required_trip_dates(
  start_date: str,
  end_date: str,
) -> list[str]:
  start = date.fromisoformat(
    start_date
  )

  end = date.fromisoformat(
    end_date
  )

  required_dates: list[str] = []

  current = start

  while current <= end:
    required_dates.append(
      current.isoformat()
    )

    current += timedelta(days=1)

  return required_dates


def normalize_itinerary_dates(
  itinerary: dict[str, Any],
  *,
  start_date: str,
  end_date: str,
) -> dict[str, Any]:
  required_dates = get_required_trip_dates(
    start_date=start_date,
    end_date=end_date,
  )

  days = itinerary.get(
    "days",
    [],
  )

  if len(days) != len(required_dates):
    return itinerary

  for index, (
    day,
    required_date,
  ) in enumerate(
    zip(
      days,
      required_dates,
    ),
    start=1,
  ):
    day["day_number"] = index
    day["date"] = required_date

  return itinerary