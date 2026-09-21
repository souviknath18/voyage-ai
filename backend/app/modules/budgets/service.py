from collections import defaultdict
from decimal import Decimal

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.itineraries.repository import get_itinerary_by_trip_id
from app.modules.trips.repository import get_trip_by_id


CATEGORIES = [
  "food",
  "transport",
  "activity",
  "shopping",
  "other",
]


async def get_trip_budget(
  db: AsyncSession,
  public_trip_id: str,
  user_id,
) -> dict:

  # Make sure the trip exists and belongs to this user
  trip = await get_trip_by_id(
    db=db,
    trip_id=public_trip_id,
    user_id=user_id,
  )

  if trip is None:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND,
      detail="Trip not found",
    )

  # Get the generated itinerary
  itinerary = await get_itinerary_by_trip_id(
    db=db,
    trip_id=trip.id,
  )

  if itinerary is None:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND,
      detail="Itinerary not found",
    )

  category_totals = defaultdict(
    lambda: Decimal("0.00")
  )

  estimated_cost = Decimal("0.00")

  for day in itinerary.days:
    for activity in day.activities:

      cost = activity.estimated_cost or Decimal("0.00")

      category = activity.cost_category

      if category not in CATEGORIES:
        category = "other"

      category_totals[category] += cost
      estimated_cost += cost

  # Keep the calculated value authoritative instead of trusting
  # a separately stored total.
  estimated_cost = estimated_cost.quantize(
    Decimal("0.01")
  )

  total_budget = trip.budget

  remaining_budget = None
  utilization_percentage = None

  if total_budget is None:
    budget_status = "no_budget"

  else:
    remaining_budget = (
      total_budget - estimated_cost
    ).quantize(
      Decimal("0.01")
    )

    if total_budget > 0:
      utilization_percentage = round(
        float(
          estimated_cost
          / total_budget
          * Decimal("100")
        ),
        2,
      )

    if estimated_cost > total_budget:
      budget_status = "over_budget"
    else:
      budget_status = "within_budget"

  categories = []

  for category in CATEGORIES:

    category_cost = category_totals[category].quantize(
      Decimal("0.01")
    )

    if estimated_cost > 0:
      percentage = round(
        float(
          category_cost
          / estimated_cost
          * Decimal("100")
        ),
        2,
      )
    else:
      percentage = 0.0

    categories.append(
      {
        "category": category,
        "estimated_cost": category_cost,
        "percentage": percentage,
      }
    )

  return {
    "trip_id": trip.trip_id,
    "currency": trip.currency,
    "total_budget": total_budget,
    "estimated_cost": estimated_cost,
    "remaining_budget": remaining_budget,
    "utilization_percentage": utilization_percentage,
    "status": budget_status,
    "categories": categories,
  }