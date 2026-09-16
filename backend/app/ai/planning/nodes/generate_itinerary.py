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
  temperature=0.3,
)

structured_llm = llm.with_structured_output(
  GeneratedItinerary
)


async def generate_itinerary(
  state: PlanningState,
) -> dict[str, Any]:
  snapshot = state["input_snapshot"]

  trip = snapshot["trip"]
  preferences = snapshot["preferences"]

  prompt = f"""
You are the itinerary planning component of VoyageAI.

Create a travel itinerary using the supplied trip
information.

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

RULES
- Do not change the origin or destination.
- Do not change the trip dates.
- Create itinerary days only within the trip dates.
- Respect the requested travel pace.
- Prioritize the traveler's interests.
- Keep estimated costs reasonably within the budget.
- Treat costs as estimates, not verified live prices.
- Do not claim that hotels, flights, restaurants,
  tickets, or activities have been booked.
"""

  itinerary = await structured_llm.ainvoke(
    prompt
  )

  return {
    "draft_itinerary":
      itinerary.model_dump(),
  }