from typing import Any

from app.ai.planning.itinerary_dates import (
  get_required_trip_dates,
  normalize_itinerary_dates,
)
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

  required_dates = get_required_trip_dates(
    start_date=trip["start_date"],
    end_date=trip["end_date"],
  )

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
Origin: {trip["origin_name"]}, {trip["origin_country"]}
Destination: {trip["destination_name"]}, {trip["destination_country"]}
Trip scope: {trip["trip_scope"]}
Start date: {trip["start_date"]}
End date: {trip["end_date"]}
Travelers: {trip["travelers"]}
Budget: {trip["budget"]} {trip["currency"]}

TRIP SCOPE RULES
- "domestic" means the origin and destination are in the
  same country.
- "international" means the origin and destination are in
  different countries.
- Treat Trip scope as deterministic trip context.
- Do not change or reinterpret the trip scope.
- Do not infer visa, immigration, passport, customs,
  vaccination, entry, or other regulatory requirements.
- Do not claim that any transport, accommodation, ticket,
  or transfer has been booked.

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

COST CATEGORY RULES
- Every activity must have exactly one cost_category.
- cost_category must be one of:
  "food", "transport", "activity", "shopping", "other".
- Use "food" for breakfast, lunch, dinner, cafes,
  restaurants, snacks, and other food or drink activities.
- Use "transport" for taxis, transfers, local rides,
  public transport, and other local transportation.
- Use "activity" for attractions, sightseeing, tours,
  museums, temples, parks, entertainment, and other
  planned experiences.
- Use "shopping" for shopping activities, markets when
  shopping is the purpose, and planned purchases.
- Use "other" only when none of the above categories
  reasonably applies.
- Do not use "flight" or "hotel" as a cost_category.
- Preserve a correct existing cost_category when possible.
- If an activity is changed during replanning, make sure
  its cost_category still matches the resulting activity.
- estimated_cost must represent only the estimated cost
  associated with that activity.
- Use 0 when an activity does not reasonably require
  spending.
- Treat estimated_cost as an estimate, not a verified
  or live price.

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

  draft_itinerary = (
    itinerary.model_dump()
  )

  draft_itinerary["destination"] = (
    trip["destination"]
  )

  draft_itinerary = (
    normalize_itinerary_dates(
      draft_itinerary,
      start_date=trip["start_date"],
      end_date=trip["end_date"],
    )
  )

  return {
    "draft_itinerary":
      draft_itinerary,
    "validation_errors": [],
    "replan_count": replan_count,
    "final_itinerary": None,
  }