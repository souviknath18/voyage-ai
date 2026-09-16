from typing import Any

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

  previous_itinerary = state[
    "draft_itinerary"
  ]

  validation_errors = state[
    "validation_errors"
  ]

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