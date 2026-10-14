
from datetime import datetime
from decimal import Decimal

from app.integrations.flights.schemas import FlightSlice
from app.modules.flights.ranking import (
  FlightCandidate,
  duration_to_minutes,
  rank_flights,
)
from app.modules.flights.refinement_schemas import (
  FlightRefinementPreferences,
)


def get_journeys(candidate: FlightCandidate) -> list[FlightSlice]:
  offer = candidate.offer
  journeys = [offer.outbound]

  if offer.return_flight is not None:
    journeys.append(offer.return_flight)

  return journeys


def get_total_stops(candidate: FlightCandidate) -> int:
  return sum(
    journey.stops
    for journey in get_journeys(candidate)
  )


def get_total_duration(candidate: FlightCandidate) -> int:
  return sum(
    duration_to_minutes(journey.duration)
    for journey in get_journeys(candidate)
  )


def matches_airlines(
  candidate: FlightCandidate,
  preferences: FlightRefinementPreferences,
) -> bool:
  airlines = {
    segment.airline.strip().casefold()
    for journey in get_journeys(candidate)
    for segment in journey.segments
  }

  preferred = {
    airline.strip().casefold()
    for airline in preferences.preferred_airlines
    if airline.strip()
  }

  excluded = {
    airline.strip().casefold()
    for airline in preferences.excluded_airlines
    if airline.strip()
  }

  if airlines & excluded:
    return False

  if preferred and not (airlines & preferred):
    return False

  return True


def matches_departure_period(
  candidate: FlightCandidate,
  period: str | None,
) -> bool:
  if period is None:
    return True

  try:
    departure = datetime.fromisoformat(
      candidate.offer.outbound.departure_at.replace(
        "Z", "+00:00"
      )
    )
  except (ValueError, AttributeError):
    return False

  hour = departure.hour

  periods = {
    "morning": (5, 12),
    "afternoon": (12, 17),
    "evening": (17, 21),
    "night": (21, 24),
  }

  start, end = periods[period]

  if period == "night":
    return hour >= start or hour < 5

  return start <= hour < end


def has_overnight_layover(
  journey: FlightSlice,
) -> bool | None:
  segments = journey.segments

  for current, following in zip(
    segments, segments[1:]
  ):
    try:
      arrival = datetime.fromisoformat(
        current.arrival_at.replace("Z", "+00:00")
      )
      departure = datetime.fromisoformat(
        following.departure_at.replace("Z", "+00:00")
      )
    except (ValueError, AttributeError):
      return None

    if (
      arrival.tzinfo is None
      or departure.tzinfo is None
    ):
      return None

    # Compare local calendar dates only when
    # the connection airport is the same.
    if current.destination != following.origin:
      return None

    # Offset-aware provider timestamps should
    # represent local times at each airport.
    if departure.date() > arrival.date():
      return True

  return False


def matches_overnight_preference(
  candidate: FlightCandidate,
  avoid_overnight: bool,
) -> bool:
  if not avoid_overnight:
    return True

  return all(
    has_overnight_layover(journey) is False
    for journey in get_journeys(candidate)
  )


def refine_flights(
  candidates: list[FlightCandidate],
  preferences: FlightRefinementPreferences,
) -> list[FlightCandidate]:
  filtered: list[FlightCandidate] = []

  max_price = (
    Decimal(str(preferences.max_price))
    if preferences.max_price is not None
    else None
  )

  for candidate in candidates:
    if (
      max_price is not None
      and candidate.converted_price > max_price
    ):
      continue

    if (
      preferences.max_stops is not None
      and any(
        journey.stops > preferences.max_stops
        for journey in get_journeys(candidate)
      )
    ):
      continue

    if not matches_airlines(candidate, preferences):
      continue

    if not matches_departure_period(
      candidate,
      preferences.departure_period,
    ):
      continue

    if not matches_overnight_preference(
      candidate,
      preferences.avoid_overnight_layovers,
    ):
      continue

    filtered.append(candidate)

  if preferences.sort_by == "cheapest":
    return sorted(
      filtered,
      key=lambda c: (
        c.converted_price,
        get_total_duration(c),
      ),
    )

  if preferences.sort_by == "fastest":
    return sorted(
      filtered,
      key=lambda c: (
        get_total_duration(c),
        c.converted_price,
      ),
    )

  if preferences.sort_by == "fewest_stops":
    return sorted(
      filtered,
      key=lambda c: (
        get_total_stops(c),
        c.converted_price,
      ),
    )

  return rank_flights(filtered)