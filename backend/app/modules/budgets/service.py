from decimal import Decimal

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.itineraries.repository import get_itinerary_by_trip_id
from app.modules.trips.repository import get_trip_by_id

from app.modules.budgets.analyzer import (
  build_budget_insight,
  build_budget_recommendations,
  calculate_potential_savings,
)
from app.modules.budgets.constants import (
  BUDGET_CATEGORIES,
  DEFAULT_BUDGET_CATEGORY,
)
from app.modules.budgets.utils import (
  calculate_percentage,
  normalize_money,
)


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

  category_totals = {
    category: Decimal("0.00")
    for category in BUDGET_CATEGORIES
  }

  estimated_cost = Decimal("0.00")

  for day in itinerary.days:
    for activity in day.activities:

      cost = normalize_money(
        activity.estimated_cost
      )

      category = (
        activity.cost_category
        or DEFAULT_BUDGET_CATEGORY
      )

      if category not in BUDGET_CATEGORIES:
        category = DEFAULT_BUDGET_CATEGORY

      category_totals[category] += cost
      estimated_cost += cost

  # Keep the calculated value authoritative instead of trusting
  # a separately stored total.
  estimated_cost = normalize_money(
    estimated_cost
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
      Decimal("0.01"),
    )

    if total_budget > 0:
      utilization_percentage = (
        calculate_percentage(
          estimated_cost,
          total_budget,
        )
      )

    if estimated_cost > total_budget:
      budget_status = "over_budget"
    else:
      budget_status = "within_budget"

  categories = []

  for category in BUDGET_CATEGORIES:

    category_cost = normalize_money(
      category_totals[category]
    )

    percentage = calculate_percentage(
      category_cost,
      estimated_cost,
    )

    categories.append(
      {
        "category": category,
        "estimated_cost": category_cost,
        "percentage": percentage,
      }
    )

  recommendations = (
    build_budget_recommendations(
      dict(category_totals)
    )
  )

  potential_savings = (
    calculate_potential_savings(
      estimated_cost=estimated_cost,
      recommendations=recommendations,
    )
  )

  insight = build_budget_insight(
    total_budget=total_budget,
    estimated_cost=estimated_cost,
    remaining_budget=remaining_budget,
    utilization_percentage=utilization_percentage,
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

    "potential_savings":
      potential_savings,

    "insight":
      insight,

    "recommendations":
      recommendations,
  }