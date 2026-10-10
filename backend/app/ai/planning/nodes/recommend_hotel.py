from datetime import date
from decimal import Decimal

from app.ai.planning.state import PlanningState
from app.modules.hotels.service import search_and_rank_hotels


async def recommend_hotel(
  state: PlanningState,
) -> dict:
  try:
    snapshot = state["input_snapshot"]
    trip = snapshot["trip"]

    latitude = trip.get("destination_latitude")
    longitude = trip.get("destination_longitude")

    if latitude is None or longitude is None:
      print(
        "Automatic hotel recommendation: "
        "destination coordinates missing."
      )
      return {"recommended_hotel": None}

    result = await search_and_rank_hotels(
      latitude=float(latitude),
      longitude=float(longitude),
      check_in=date.fromisoformat(
        str(trip["start_date"])
      ),
      check_out=date.fromisoformat(
        str(trip["end_date"])
      ),
      travelers=int(trip["travelers"]),
      currency=str(trip["currency"]),
      budget=(
        Decimal(str(trip["budget"]))
        if trip.get("budget") is not None
        else None
      ),
    )

    recommended_id = result.get(
      "recommended_hotel_id"
    )

    best_hotel = next(
      (
        offer
        for offer in result["offers"]
        if offer["id"] == recommended_id
      ),
      None,
    )

    if best_hotel is None:
      print(
        "Automatic hotel recommendation: "
        "no suitable hotel found."
      )
      return {"recommended_hotel": None}

    recommended_hotel = {
      **best_hotel,
      "provider": "liteapi",
      "recommended_at": (
        __import__("datetime")
        .datetime.now(
          __import__("datetime").timezone.utc
        )
        .isoformat()
      ),
    }

    print(
      "Automatic hotel recommended:",
      recommended_id,
    )

    return {
      "recommended_hotel": recommended_hotel,
    }

  except Exception as exc:
    print(
      "Automatic hotel recommendation "
      f"failed: {type(exc).__name__}: {exc}"
    )

    return {
      "recommended_hotel": None,
    }