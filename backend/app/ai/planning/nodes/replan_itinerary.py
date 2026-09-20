from typing import Any

from datetime import date, timedelta
from langchain_openai import ChatOpenAI

from app.ai.planning.schemas import (
  GeneratedItinerary,
)
from app.ai.planning.state import PlanningState
from app.core.config import settings


llm = ChatOpenAI(
  model=settings.openai_model,
  api_key=settings.openai_api_key,
  temperature=0.2,
)

structured_llm = llm.with_structured_output(
  GeneratedItinerary
)


async def replan_itinerary(
  state: PlanningState,
) -> dict[str, Any]:
  snapshot = state["input_snapshot"]

  trip = snapshot["trip"]
  preferences = snapshot["preferences"]

  start_date = date.fromisoformat(
    trip["start_date"]
  )

  end_date = date.fromisoformat(
    trip["end_date"]
  )

  required_dates = []

  current_date = start_date

  while current_date <= end_date:
    required_dates.append(
      current_date.isoformat()
    )
    current_date += timedelta(days=1)

  required_dates_text = "\n".join(
    f"Day {index}: {trip_date}"
    for index, trip_date in enumerate(
      required_dates,
      start=1,
    )
  )

  previous_itinerary = state[
    "draft_itinerary"
  ]

  validation_errors = state[
    "validation_errors"
  ]

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

  place_lines = []

  for place in verified_places:
    categories = ", ".join(
      place.get(
        "categories",
        [],
      )
    )

    distance = place.get(
      "distance"
    )

    distance_text = (
      f"{distance} meters"
      if distance is not None
      else "Unknown"
    )

    place_lines.append(
      (
        f"- {place['name']}\n"
        f"  Place ID: "
        f"{place.get('provider_place_id')}\n"
        f"  Address: "
        f"{place.get('address') or 'Unknown'}\n"
        f"  Categories: "
        f"{categories or 'Unknown'}\n"
        f"  Distance from destination center: "
        f"{distance_text}"
      )
    )

  verified_places_text = (
    "\n".join(place_lines)
    if place_lines
    else "No verified places available."
  )

  replan_count = state["replan_count"] + 1

  prompt = f"""
You are the itinerary replanning component of VoyageAI.

The previous itinerary failed validation.
Correct the itinerary while preserving all fixed
trip constraints.

TRIP
Origin: {trip["origin"]}
Destination: {trip["destination"]}
Start date: {trip["start_date"]}
End date: {trip["end_date"]}
Travelers: {trip["travelers"]}
Budget: {trip["budget"]} {trip["currency"]}

PREFERENCES
Travel pace: {preferences["pace"]}
Interests: {", ".join(preferences["interests"])}
Additional instructions:
{preferences["ai_brief"] or "None"}

Budget preference level:
{preferences["budget_level"]}/100

VALIDATION ERRORS
{validation_errors}

VERIFIED PLACES
{verified_places_text}

PLACE GROUNDING RULES
- Fix every place-related validation error using VERIFIED
  PLACES above.
- For any specifically named restaurant, cafe, attraction,
  park, landmark, temple, viewpoint, beach, or other POI,
  use only a place from VERIFIED PLACES.
- When using a verified place, set activity_type to
  "verified_place".
- Copy its Place ID exactly into place_id.
- Never invent, modify, shorten, or guess a Place ID.
- Never introduce a specifically named POI that is not
  listed in VERIFIED PLACES.
- If there is no suitable verified place, replace the
  activity with a generic activity.
- Generic activities must use activity_type "generic".
- Generic activities must set place_id to null.
- Generic activities must not contain the name of a
  specific restaurant, cafe, attraction, landmark,
  temple, park, viewpoint, beach, or other POI.
- Do not replace one unverified POI with another
  unverified POI.
- Treat VERIFIED PLACES as the only source of factual
  information about a specific place.
- Do not infer additional facts from a place's name,
  category, or your own knowledge.
- Do not claim that a place is famous, popular, highly
  recommended, a local favorite, authentic, peaceful,
  scenic, renowned, or known for something unless that
  information is explicitly provided in VERIFIED PLACES.
- Do not invent cuisine specialties, signature dishes,
  atmosphere, service quality, historical significance,
  amenities, views, experiences, opening hours, ratings,
  ticket prices, availability, or other unsupported
  characteristics of a verified place.
- For a verified place, write the description as a neutral
  description of what the traveler will do there.
- Keep verified-place descriptions factual and concise.
- Prefer descriptions such as "Have dinner at Dodik Pizza"
  or "Visit Rice terrace and spend time exploring the area"
  instead of making claims about reputation, quality,
  popularity, or characteristics.

PREVIOUS ITINERARY
{previous_itinerary}

RULES
- Fix every validation error.
- Do not change the origin.
- Do not change the destination.
- Do not change the start or end date.
- Include every trip date exactly once.
- Keep the itinerary within the user's budget.
- Respect the requested travel pace.
- Prioritize the traveler's interests.
- Costs are estimates only.
- Never claim a booking or reservation was made.
- Treat VALIDATION ERRORS as mandatory corrections, not
  suggestions.

REQUIRED ITINERARY DAYS
{required_dates_text}

IMPORTANT DATE RULES
- Generate exactly {len(required_dates)} itinerary days.
- Day 1 must use {required_dates[0]}.
- Day {len(required_dates)} must use {required_dates[-1]}.
- Use every date listed above exactly once.
- Keep the dates in exactly the listed order.
- day_number must start at 1 and increase by 1.
- Do not add dates before or after this list.
- Do not skip any date.
"""

  itinerary = await structured_llm.ainvoke(
    prompt
  )

  return {
    "draft_itinerary":
        itinerary.model_dump(),
    "validation_errors": [],
    "replan_count": replan_count,
    "final_itinerary": None,
  }