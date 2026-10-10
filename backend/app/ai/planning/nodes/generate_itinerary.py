from typing import Any

from app.ai.planning.itinerary_dates import (
  get_required_trip_dates,
  normalize_itinerary_dates,
)
from langchain_openai import ChatOpenAI

from app.ai.planning.schemas import (
  GeneratedItinerary,
  GeneratedItineraryDay,
)
from app.ai.planning.state import PlanningState
from app.core.config import settings


llm = ChatOpenAI(
  model=settings.openai_model,
  api_key=settings.openai_api_key,
  temperature=0.3,
)

structured_day_llm = llm.with_structured_output(
  GeneratedItineraryDay
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

  verified_place_ids = {
    place["provider_place_id"]
    for place in places
    if place.get("provider_place_id")
  }

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

ACTIVITY DURATION RULES
- Every itinerary activity should include duration_minutes.
- duration_minutes represents the estimated time spent
  completing the activity, in minutes.
- Use realistic estimates based on the activity type
  and the traveler's requested pace.
- Typical planning estimates:
  Breakfast: 30-60 minutes.
  Lunch: 45-90 minutes.
  Dinner: 60-120 minutes.
  Museum or attraction visit: 60-180 minutes.
  Park or landmark visit: 30-120 minutes.
  Walking or sightseeing: 60-180 minutes.
  Shopping: 45-120 minutes.
  Local transport: estimate based on available context.
- These are guidelines, not fixed durations.
- Do not claim estimated durations are verified.
- Use null when duration cannot reasonably be estimated.
- Keep durations between 1 and 1440 minutes.
- Schedule activities with enough time to complete
  each activity before the next one begins.
- Avoid overlapping activity time ranges.
- Allow reasonable gaps for travel, rest, and transitions.
- Do not invent verified travel times or distances.

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

  generated_days = []

  for index, required_date in enumerate(
    required_dates,
    start=1,
  ):
    day_prompt = (
      prompt
      + "\n\nSINGLE DAY GENERATION\n"
      + f"Generate ONLY Day {index} for {required_date}.\n"
      + "Return exactly one itinerary day in the "
      + "required structured output.\n"
      + f"day_number must be {index}.\n"
      + f"date must be {required_date}.\n"
      + "Include appropriate activities for this day.\n"
      + "Follow all verified-place, activity duration, "
      + "cost, weather, and travel preference rules.\n"
      + "Do not generate other days.\n"
    )

    result = await structured_day_llm.ainvoke(
      day_prompt
    )

    generated_day = result.day.model_dump()

    for activity in generated_day["activities"]:
      place_id = activity.get("place_id")
      activity_type = activity.get("activity_type")

      if activity_type == "verified_place":
        if place_id not in verified_place_ids:
          activity["activity_type"] = "generic"
          activity["place_id"] = None
          activity["title"] = "Explore the local area"
          activity["location"] = None
          activity["description"] = (
            "Spend time exploring the destination "
            "without a specific planned attraction."
          )

      elif activity_type == "generic":
        activity["place_id"] = None

    # The date and number are deterministic trip data.
    generated_day["day_number"] = index
    generated_day["date"] = required_date

    generated_days.append(generated_day)

    print(
      f"[ITINERARY] Generated Day {index}/"
      f"{len(required_dates)}: {required_date}, "
      f"activities={len(generated_day['activities'])}"
    )

  draft_itinerary = {
    "destination": trip["destination"],
    "summary": (
      f"{len(required_dates)}-day itinerary for "
      f"{trip['destination_name']}."
    ),
    "currency": trip["currency"],
    "days": generated_days,
    "estimated_total_cost": sum(
      activity["estimated_cost"]
      for day in generated_days
      for activity in day["activities"]
    ),
  }

  print(
    "[ITINERARY DEBUG] Required days:",
    len(required_dates),
  )

  print(
    "[ITINERARY DEBUG] Generated days:",
    len(draft_itinerary.get("days", [])),
  )

  print(
    "[ITINERARY DEBUG] Generated dates:",
    [
      {
        "day_number": day.get("day_number"),
        "date": day.get("date"),
      }
      for day in draft_itinerary.get("days", [])
    ],
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
  }