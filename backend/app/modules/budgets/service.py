import logging
from time import perf_counter
from decimal import Decimal

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.itineraries.repository import (
  get_itinerary_budget_items,
)
from app.modules.trips.repository import get_trip_by_id
from app.modules.flights.repository import get_selected_flight
from app.modules.hotels.repository import get_selected_hotel

logger = logging.getLogger(__name__)

def log_query_time(label: str, started: float) -> None:
  logger.warning(
    "[Budget] %s: %.0fms",
    label,
    (perf_counter() - started) * 1000,
  )

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

  total_started = perf_counter()

  # 1. Trip lookup
  started = perf_counter()

  trip = await get_trip_by_id(
    db=db,
    trip_id=public_trip_id,
    user_id=user_id,
  )

  log_query_time("Trip lookup", started)

  if trip is None:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND,
      detail="Trip not found",
    )

  # 2. Itinerary lookup
  started = perf_counter()

  budget_items = await get_itinerary_budget_items(
    db=db,
    trip_id=trip.id,
  )

  log_query_time("Itinerary budget lookup", started)

  if budget_items is None:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND,
      detail="Itinerary not found",
    )

  category_totals = {
    category: Decimal("0.00")
    for category in BUDGET_CATEGORIES
  }

  estimated_cost = Decimal("0.00")

  # 3. Selected flight lookup
  started = perf_counter()

  selected_flight = await get_selected_flight(
    db=db,
    trip_id=trip.id,
  )

  log_query_time("Selected flight lookup", started)

  # 4. Selected hotel lookup
  started = perf_counter()

  selected_hotel = await get_selected_hotel(
    db=db,
    trip_id=trip.id,
  )

  log_query_time("Selected hotel lookup", started)

  for cost_category, estimated_activity_cost in budget_items:
    if estimated_activity_cost is None:
      continue

    cost = normalize_money(estimated_activity_cost)

    category = (
      cost_category
      or DEFAULT_BUDGET_CATEGORY
    )

    if category not in BUDGET_CATEGORIES:
      category = DEFAULT_BUDGET_CATEGORY

    category_totals[category] += cost
    estimated_cost += cost

    # Add saved flight expenses.
  if selected_flight is not None:
    if selected_flight.converted_currency != trip.currency:
      raise HTTPException(
        status_code=status.HTTP_409_CONFLICT,
        detail="Selected flight currency does not match trip currency",
      )

    flight_cost = normalize_money(
      selected_flight.converted_price
    )

    category_totals["flight"] += flight_cost
    estimated_cost += flight_cost

  # Add saved hotel expenses.
  if selected_hotel is not None:
    if selected_hotel.converted_currency != trip.currency:
      raise HTTPException(
        status_code=status.HTTP_409_CONFLICT,
        detail="Selected hotel currency does not match trip currency",
      )

    hotel_cost = normalize_money(
      selected_hotel.converted_price
    )

    category_totals["accommodation"] += hotel_cost
    estimated_cost += hotel_cost

  # Normalize the complete trip estimate.
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

  log_query_time("TOTAL budget calculation", total_started)

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