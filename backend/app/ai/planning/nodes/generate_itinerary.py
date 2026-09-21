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

  places = research_results.get(
    "places",
    [],
  )

  places_context = (
    "No verified places are available."
  )

  if places:
    place_lines = []

    for place in places:
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

    places_context = "\n".join(
      place_lines
    )

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

VERIFIED PLACES
The following places were returned by the external
places provider for this destination:

{places_context}

PLACES RULES
- For any specifically named restaurant, cafe, attraction,
  park, landmark, temple, viewpoint, or other POI, use only
  a place listed in VERIFIED PLACES above.
- Never introduce a specifically named POI that is not in
  VERIFIED PLACES.
- If no suitable verified place exists, use a generic
  activity instead, such as "Visit a local temple",
  "Lunch at a local restaurant", "Explore the local area",
  or "Relax at a nearby beach".
- Do not substitute a famous place from your own knowledge
  for a missing verified place.
- You may create generic activities such as breakfast,
  lunch, dinner, rest, walking, or free time even when
  they are not listed as verified places.
- Do not claim that a verified place is open, available,
  highly rated, ticketed, or bookable unless that
  information is explicitly provided.
- Do not invent ratings, opening hours, ticket prices,
  reservation status, or other live place information.
- Treat the provided address and category information as
  reference data from the places provider.
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
  amenities, views, experiences, or other characteristics
  of a verified place.
- For a verified place, write the description as a neutral
  description of what the traveler will do there.
- Keep verified-place descriptions factual and concise.
- Prefer descriptions such as "Have dinner at Dodik Pizza"
  or "Visit Rice terrace and spend time exploring the area"
  instead of making claims about the place's reputation,
  quality, popularity, or characteristics.
- When you use a specific place from VERIFIED PLACES,
  copy its Place ID exactly into the activity's place_id.
- Never invent or modify a Place ID.
- For generic activities that do not use a specific
  verified place, set place_id to null.
- A specific named POI must never have place_id null.
- Set activity_type to "verified_place" when an activity
  uses a specific place from VERIFIED PLACES.
- A "verified_place" activity must copy the exact Place ID
  from VERIFIED PLACES into place_id.
- Set activity_type to "generic" only for activities that
  do not identify a specific POI.
- A "generic" activity must have place_id set to null.
- Generic activities must not introduce a specific named
  restaurant, cafe, attraction, landmark, temple, park,
  viewpoint, beach, or other POI.

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
- estimated_cost must represent only the estimated cost
  associated with that activity.
- Use 0 when an activity does not reasonably require
  spending.
- Treat every estimated_cost as an estimate, not a
  verified or live price.

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

  draft_itinerary = (
    itinerary.model_dump()
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
  }