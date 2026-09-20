from datetime import date, timedelta
from typing import Any

from app.ai.planning.state import PlanningState


def _build_verified_place_description(
  title: str,
  place_name: str,
) -> str:
  title_lower = title.lower()

  if (
    "breakfast" in title_lower
  ):
    return (
      f"Have breakfast at "
      f"{place_name}."
    )

  if "lunch" in title_lower:
    return (
      f"Have lunch at "
      f"{place_name}."
    )

  if "dinner" in title_lower:
    return (
      f"Have dinner at "
      f"{place_name}."
    )

  if (
    "coffee" in title_lower
    or "cafe" in title_lower
  ):
    return (
      f"Spend some time at "
      f"{place_name}."
    )

  if (
    "relax" in title_lower
  ):
    return (
      f"Spend some time relaxing at "
      f"{place_name}."
    )

  return (
    f"Visit {place_name}."
  )

def _build_verified_place_title(
  title: str,
  place_name: str,
) -> str:
  title_lower = title.lower()

  if "breakfast" in title_lower:
    return (
      f"Breakfast at {place_name}"
    )

  if "lunch" in title_lower:
    return (
      f"Lunch at {place_name}"
    )

  if "dinner" in title_lower:
    return (
      f"Dinner at {place_name}"
    )

  if (
    "coffee" in title_lower
    or "cafe" in title_lower
  ):
    return (
      f"Coffee at {place_name}"
    )

  if "relax" in title_lower:
    return (
      f"Relax at {place_name}"
    )

  return (
    f"Visit {place_name}"
  )

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

  research_results = state.get(
    "research_results",
    {},
  )

  verified_places = (
    research_results.get(
      "places",
      [],
    )
  )

  verified_places_by_id = {
    place["provider_place_id"]: place
    for place in verified_places
    if place.get(
      "provider_place_id"
    )
  }

  verified_place_ids = set(
    verified_places_by_id
  )

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

  for day in itinerary_days:
    activities = day.get(
      "activities",
      [],
    )

    for activity in activities:
      title = activity.get(
        "title",
        "Unknown activity",
      )

      activity_type = activity.get(
        "activity_type"
      )

      place_id = activity.get(
        "place_id"
      )

      if (
        activity_type
        == "verified_place"
      ):
        if not place_id:
          errors.append(
            (
              f"Activity '{title}' "
              "is a verified_place "
              "but has no place_id."
            )
          )

        elif (
          place_id
          not in verified_place_ids
        ):
          errors.append(
            (
              f"Activity '{title}' "
              "uses an unverified "
              "place_id."
            )
          )

        else:
          verified_place = (
            verified_places_by_id[
              place_id
            ]
          )

          place_name = (
            verified_place["name"]
          )

          place_address = (
            verified_place.get(
              "address"
            )
          )

          safe_title = (
            _build_verified_place_title(
              title=title,
              place_name=place_name,
            )
          )

          activity["title"] = (
            safe_title
          )

          activity["location"] = (
            place_address
          )

          activity[
            "description"
          ] = (
            _build_verified_place_description(
              title=safe_title,
              place_name=place_name,
            )
          )

      elif activity_type == "generic":
        if place_id is not None:
          errors.append(
            (
              f"Generic activity "
              f"'{title}' must not "
              "have a place_id."
            )
          )

      else:
        errors.append(
          (
            f"Activity '{title}' "
            "has an invalid "
            "activity_type."
          )
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

  estimated_total_cost = sum(
    activity.get(
      "estimated_cost",
      0,
    )
    for day in itinerary_days
    for activity in day.get(
      "activities",
      [],
    )
  )

  itinerary[
    "estimated_total_cost"
  ] = estimated_total_cost

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