from datetime import date
from decimal import Decimal

from app.ai.planning.state import (
  PlanningState,
)
from app.modules.flights.ranking import (
  rank_flights,
)
from app.modules.flights.service import (
  FlightTripContext,
  search_trip_flight_candidates,
)


def _to_decimal(
  value,
) -> Decimal | None:
  if value is None:
    return None

  return Decimal(str(value))


async def recommend_flight(
  state: PlanningState,
) -> dict:
  snapshot = state[
    "input_snapshot"
  ]

  trip_snapshot = snapshot[
    "trip"
  ]

  try:
    trip = FlightTripContext(
      origin=trip_snapshot[
        "origin"
      ],

      origin_name=(
        trip_snapshot.get(
          "origin_name"
        )
      ),

      origin_country_code=(
        trip_snapshot.get(
          "origin_country_code"
        )
      ),

      origin_latitude=_to_decimal(
        trip_snapshot.get(
          "origin_latitude"
        )
      ),

      origin_longitude=_to_decimal(
        trip_snapshot.get(
          "origin_longitude"
        )
      ),

      destination=trip_snapshot[
        "destination"
      ],

      destination_name=(
        trip_snapshot.get(
          "destination_name"
        )
      ),

      destination_country_code=(
        trip_snapshot.get(
          "destination_country_code"
        )
      ),

      destination_latitude=_to_decimal(
        trip_snapshot.get(
          "destination_latitude"
        )
      ),

      destination_longitude=_to_decimal(
        trip_snapshot.get(
          "destination_longitude"
        )
      ),

      start_date=date.fromisoformat(
        str(
          trip_snapshot[
            "start_date"
          ]
        )
      ),

      end_date=date.fromisoformat(
        str(
          trip_snapshot[
            "end_date"
          ]
        )
      ),

      travelers=int(
        trip_snapshot[
          "travelers"
        ]
      ),

      currency=str(
        trip_snapshot[
          "currency"
        ]
      ),
    )

    result = (
      await search_trip_flight_candidates(
        trip
      )
    )

    candidates = result[
      "candidates"
    ]

    if not candidates:
      print(
        "Automatic flight recommendation: "
        "no flight candidates found."
      )

      return {
        "recommended_flight": None,
      }

    ranked = rank_flights(
      candidates
    )

    best = ranked[0]
    offer = best.offer

    recommended_flight = {
      "provider": "duffel",

      "provider_offer_id":
        offer.id,

      "airline":
        offer.airline,

      "airline_code":
        offer.airline_code,

      "original_price": str(
        offer.price
      ),

      "original_currency": (
        offer.currency.upper()
      ),

      "converted_price": str(
        best.converted_price
      ),

      "converted_currency": (
        best.converted_currency
      ),

      "exchange_rate": str(
        best.exchange_rate
      ),

      "outbound": (
        offer.outbound.model_dump(
          mode="json"
        )
      ),

      "return_flight": (
        offer.return_flight.model_dump(
          mode="json"
        )
        if offer.return_flight
        else None
      ),

      "baggage":
        offer.baggage,

      "expires_at":
        offer.expires_at,

      "score": round(
        best.score,
        4,
      ),
    }

    print(
      "Automatic flight recommended:",
      offer.id,
      offer.airline,
      best.converted_price,
      best.converted_currency,
    )

    return {
      "recommended_flight":
        recommended_flight,
    }

  except Exception as exc:
    print(
      "Automatic flight recommendation "
      f"failed: {type(exc).__name__}: {exc}"
    )

    return {
      "recommended_flight": None,
    }