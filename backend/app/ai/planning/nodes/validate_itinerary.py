from datetime import date, timedelta
from typing import Any

from app.ai.planning.state import PlanningState


def validate_itinerary(
    state: PlanningState,
) -> dict[str, Any]:
  itinerary = state.get(
    "draft_itinerary"
  )

  if not itinerary:
    return {
      "validation_errors": [
        "No itinerary was generated."
      ],
      "final_itinerary": None,
    }

  trip = state["input_snapshot"]["trip"]

  errors: list[str] = []

  start_date = date.fromisoformat(
    trip["start_date"]
  )
  end_date = date.fromisoformat(
    trip["end_date"]
  )

  expected_dates = []

  current_date = start_date

  while current_date <= end_date:
    expected_dates.append(
      current_date.isoformat()
    )
    current_date += timedelta(days=1)

  itinerary_days = itinerary.get(
    "days",
    [],
  )

  actual_dates = [
    day.get("date")
    for day in itinerary_days
  ]

  if itinerary.get("destination") != (
    trip["destination"]
  ):
    errors.append(
      "Itinerary destination does not "
      "match the trip destination."
    )

  if actual_dates != expected_dates:
    errors.append(
      "Itinerary dates do not exactly "
      "match the trip dates."
    )

  estimated_total_cost = itinerary.get(
    "estimated_total_cost",
    0,
  )

  budget = trip.get("budget")

  if (
    budget is not None
    and estimated_total_cost > budget
  ):
    errors.append(
      "Estimated itinerary cost exceeds "
      "the trip budget."
    )

  if errors:
    return {
      "validation_errors": errors,
      "final_itinerary": None,
    }

  return {
    "validation_errors": [],
    "final_itinerary": itinerary,
  }