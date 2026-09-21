from datetime import datetime
from typing import Any

from app.ai.planning.state import PlanningState
from app.ai.planning.itinerary_dates import (
  get_required_trip_dates,
)


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

def _parse_activity_time(
  value: str,
) -> datetime:
  """
  Parse itinerary activity time.

  Expected examples:

  8:00 AM
  10:30 AM
  1:00 PM
  12:15 PM
  """

  cleaned_value = (
    value
    .strip()
    .upper()
  )

  return datetime.strptime(
    cleaned_value,
    "%I:%M %p",
  )

def _activity_sort_key(
  activity: dict[str, Any],
) -> tuple[int, int]:
  time_value = activity.get(
    "time",
    "",
  )

  try:
    parsed_time = (
      _parse_activity_time(
        time_value
      )
    )

    return (
      parsed_time.hour,
      parsed_time.minute,
    )

  except ValueError:
    return (
      99,
      99,
    )

ALLOWED_COST_CATEGORIES = {
  "food",
  "transport",
  "activity",
  "shopping",
  "other",
}

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

  expected_dates = get_required_trip_dates(
    start_date=trip["start_date"],
    end_date=trip["end_date"],
  )

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
      time_value = activity.get(
        "time",
        "",
      )


      try:
        _parse_activity_time(
          time_value
        )

      except ValueError:
        errors.append(
          (
            f"Activity "
            f"'{activity.get('title', 'Unknown activity')}' "
            f"has invalid time "
            f"'{time_value}'. "
            "Expected format like "
            "'9:30 AM' or '2:00 PM'."
          )
        )


    activities.sort(
      key=_activity_sort_key
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

      cost_category = activity.get(
        "cost_category"
      )

      if (
        cost_category
        not in ALLOWED_COST_CATEGORIES
      ):
        errors.append(
          (
            f"Activity '{title}' "
            "has an invalid "
            f"cost_category "
            f"'{cost_category}'."
          )
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

  if len(itinerary_days) != len(expected_dates):
    errors.append(
      (
        "Itinerary must contain exactly "
        f"{len(expected_dates)} days, "
        f"but contains "
        f"{len(itinerary_days)}."
      )
    )


  actual_day_numbers = [
    day.get("day_number")
    for day in itinerary_days
  ]

  expected_day_numbers = list(
    range(
      1,
      len(expected_dates) + 1,
    )
  )

  if (
    actual_day_numbers
    != expected_day_numbers
  ):
    errors.append(
      (
        "Itinerary day numbers must "
        "start at 1 and increase "
        "sequentially."
      )
    )


  if actual_dates != expected_dates:
    errors.append(
      "Itinerary dates do not exactly "
      "match the trip dates."
    )

  if itinerary.get("destination") != (
    trip["destination"]
  ):
    errors.append(
      "Itinerary destination does not "
      "match the trip destination."
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