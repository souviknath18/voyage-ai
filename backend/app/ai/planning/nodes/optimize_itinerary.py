import json
from typing import Any

from langchain_openai import ChatOpenAI

from app.ai.planning.itinerary_dates import (
  normalize_itinerary_dates,
)
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


OPTIMIZATION_INSTRUCTIONS = {
  "cheaper": """
Reduce the estimated total cost of the existing itinerary
while preserving the itinerary structure as much as
possible.

Apply changes in this order:

1. Keep the same days, day titles, activity titles,
   activity times, locations, place_ids and descriptions
   whenever possible.

2. First reduce estimated costs for flexible categories
   such as food and local transport when a lower-cost
   estimate is reasonable.

3. Preserve free activities.

4. Only replace or remove a paid activity when reducing
   its estimated cost is not sufficient to meaningfully
   optimize the trip.

5. Do not add new activities merely because the trip is
   being optimized for cost.

6. Do not add breakfast, meals, attractions, or other
   activities that were not already present unless they
   are necessary to replace an activity being changed.

7. Preserve essential arrival, departure, check-in and
   check-out activities.

The optimized itinerary should clearly remain recognizable
as the original itinerary, but with a lower estimated
total cost.
""",

  "less_busy": """
Make the itinerary more relaxed and less crowded.

Prefer:
- fewer activities per day
- more free time
- reasonable gaps between activities
- avoiding overly packed schedules
""",

  "more_activities": """
Add more useful activities where the schedule reasonably
allows it.

Do not make the itinerary unrealistic or excessively busy.
""",

  "more_comfortable": """
Make the itinerary more comfortable.

Prefer:
- fewer rushed transitions
- reasonable activity spacing
- more rest or free time
- a relaxed daily structure
""",

  "custom": """
Follow the user's custom optimization instructions.
""",
}


async def optimize_itinerary(
  state: PlanningState,
) -> dict[str, Any]:

  snapshot = state["input_snapshot"]
  trip = snapshot["trip"]
  preferences = snapshot["preferences"]

  base_itinerary = state.get(
    "base_itinerary"
  )

  optimization_request = state.get(
    "optimization_request"
  )

  if not base_itinerary:
    raise ValueError(
      "Optimization requires an existing itinerary."
    )

  if not optimization_request:
    raise ValueError(
      "Optimization request is missing."
    )

  optimization_type = (
    optimization_request.get(
      "optimization_type",
      "custom",
    )
  )

  custom_instructions = (
    optimization_request.get(
      "instructions"
    )
    or "None"
  )

  optimization_goal = (
    OPTIMIZATION_INSTRUCTIONS.get(
      optimization_type,
      OPTIMIZATION_INSTRUCTIONS["custom"],
    )
  )

  research_results = state.get(
    "research_results",
    {},
  )

  verified_places = research_results.get(
    "places",
    [],
  )

  verified_places_text = json.dumps(
    verified_places,
    indent=2,
    ensure_ascii=False,
  )

  base_itinerary_text = json.dumps(
    base_itinerary,
    indent=2,
    ensure_ascii=False,
  )

  prompt = f"""
You are the itinerary optimization component of VoyageAI.

You are NOT creating a completely new trip.

Modify the existing itinerary only as much as necessary
to satisfy the requested optimization.

TRIP
Origin: {trip["origin_name"]}, {trip["origin_country"]}
Destination: {trip["destination_name"]}, {trip["destination_country"]}
Start date: {trip["start_date"]}
End date: {trip["end_date"]}
Travelers: {trip["travelers"]}
Budget: {trip["budget"]} {trip["currency"]}

PREFERENCES
Travel pace: {preferences["pace"]}
Interests: {", ".join(preferences["interests"])}
Additional instructions:
{preferences["ai_brief"] or "None"}

OPTIMIZATION TYPE
{optimization_type}

OPTIMIZATION GOAL
{optimization_goal}

CUSTOM OPTIMIZATION INSTRUCTIONS
{custom_instructions}

EXISTING ITINERARY
{base_itinerary_text}

VERIFIED PLACES
{verified_places_text}

CORE OPTIMIZATION RULES
- Preserve the origin.
- Preserve the destination.
- Preserve the start date.
- Preserve the end date.
- Preserve the number and order of itinerary days.
- Preserve unchanged parts of the itinerary whenever
  possible.
- Change only what is useful for the requested
  optimization.
- Do not rewrite activities unnecessarily.
- Respect the traveler's existing preferences.
- Keep estimated costs within the trip budget.
- Costs are estimates only.
- Never claim that anything has been booked.
- Treat the existing itinerary as the source plan to edit,
  not merely as inspiration for a new itinerary.
- If an activity does not need to change for the requested
  optimization, copy it unchanged.
- Do not rename a day unless its activities materially
  change.
- Do not reorder activities unless the optimization
  specifically requires it.
- Do not introduce additional meals or activities unless
  required by the optimization.

PLACE GROUNDING RULES
- A specifically named POI may only use a place from
  VERIFIED PLACES.
- When using a verified place, use activity_type
  "verified_place".
- Copy its provider_place_id exactly into place_id.
- Never invent or modify a place_id.
- If no suitable verified place exists, use a generic
  activity.
- Generic activities must use activity_type "generic".
- Generic activities must have place_id null.
- Do not invent ratings, opening hours, ticket prices,
  availability, popularity, reputation, or other live
  facts.

COST RULES
- cost_category must be one of:
  "food", "transport", "activity", "shopping", "other".
- estimated_cost must be zero or greater.
- estimated_cost represents only that activity.
- Do not use "flight" or "hotel" as cost_category.

IMPORTANT
Return the complete optimized itinerary, including
unchanged days and activities.

The result must still cover every date from
{trip["start_date"]} through {trip["end_date"]}.
"""

  itinerary = await structured_llm.ainvoke(
    prompt
  )

  draft_itinerary = itinerary.model_dump()

  # These are deterministic constraints, so do not
  # allow the model to change them.
  draft_itinerary["destination"] = (
    trip["destination"]
  )

  draft_itinerary["currency"] = (
    trip["currency"]
  )

  draft_itinerary = normalize_itinerary_dates(
    draft_itinerary,
    start_date=trip["start_date"],
    end_date=trip["end_date"],
  )

  return {
    "draft_itinerary": draft_itinerary,
    "validation_errors": [],
    "final_itinerary": None,
  }