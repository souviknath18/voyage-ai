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

  # Research data collected before itinerary generation
  research_results = state.get(
    "research_results",
    {},
  )

  weather = research_results.get(
    "weather",
    {},
  )

  weather_forecast = weather.get(
    "forecast",
    [],
  )

  weather_context = (
    "No weather forecast is available "
    "for the trip dates."
  )

  if weather_forecast:
    weather_lines = []

    for day in weather_forecast:
      weather_lines.append(
        (
          f"{day['date']}: "
          f"{day['temperature_min']}°C to "
          f"{day['temperature_max']}°C, "
          f"precipitation probability "
          f"{day['precipitation_probability']}%, "
          f"conditions: "
          f"{day['weather_description']}"
        )
      )

    weather_context = "\n".join(
      weather_lines
    )

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

WEATHER FORECAST
{weather_context}

WEATHER RULES
- Use weather information only for dates where forecast
  data is provided.
- Prefer indoor or weather-resilient activities when
  precipitation probability is high.
- Do not invent weather information for dates without
  forecast data.
- Do not change the destination or trip dates because
  of weather.
- Treat weather forecasts as planning context, not as
  guaranteed future conditions.

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
  }