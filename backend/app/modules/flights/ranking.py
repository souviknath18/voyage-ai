from dataclasses import dataclass
from decimal import Decimal
import re

from app.integrations.flights.schemas import (
  FlightOffer,
)


@dataclass
class FlightCandidate:
  offer: FlightOffer

  converted_price: Decimal
  converted_currency: str
  exchange_rate: Decimal

  score: float = 0.0


def duration_to_minutes(
  duration: str,
) -> int:
  if not duration:
    return 0

  match = re.fullmatch(
    r"PT(?:(\d+)H)?(?:(\d+)M)?",
    duration,
  )

  if not match:
    return 0

  hours = int(
    match.group(1) or 0
  )

  minutes = int(
    match.group(2) or 0
  )

  return (
    hours * 60
    + minutes
  )


def rank_flights(
  candidates: list[FlightCandidate],
) -> list[FlightCandidate]:
  if not candidates:
    return []

  prices = [
    float(
      candidate.converted_price
    )
    for candidate in candidates
  ]

  durations = [
    duration_to_minutes(
      candidate.offer.outbound.duration
    )
    for candidate in candidates
  ]

  stops = [
    candidate.offer.outbound.stops
    for candidate in candidates
  ]

  min_price = min(prices)
  max_price = max(prices)

  min_duration = min(durations)
  max_duration = max(durations)

  min_stops = min(stops)
  max_stops = max(stops)


  def score_lower_is_better(
    value: float,
    minimum: float,
    maximum: float,
  ) -> float:
    if minimum == maximum:
      return 1.0

    return 1.0 - (
      (value - minimum)
      / (maximum - minimum)
    )


  for candidate in candidates:
    price_score = (
      score_lower_is_better(
        float(
          candidate.converted_price
        ),
        min_price,
        max_price,
      )
    )

    duration_score = (
      score_lower_is_better(
        duration_to_minutes(
          candidate.offer.outbound.duration
        ),
        min_duration,
        max_duration,
      )
    )

    stops_score = (
      score_lower_is_better(
        candidate.offer.outbound.stops,
        min_stops,
        max_stops,
      )
    )

    candidate.score = (
      price_score * 0.50
      + duration_score * 0.35
      + stops_score * 0.15
    )


  return sorted(
    candidates,
    key=lambda candidate:
      candidate.score,
    reverse=True,
  )