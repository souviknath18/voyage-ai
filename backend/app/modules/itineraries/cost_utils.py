from decimal import Decimal, ROUND_HALF_UP
from typing import Any


MONEY = Decimal("0.01")


def normalize_activity_cost(value: Any) -> Decimal:
  amount = Decimal(str(value if value is not None else 0))

  if not amount.is_finite() or amount < 0:
      raise ValueError("Activity cost must be a non-negative number.")

  return amount.quantize(MONEY, rounding=ROUND_HALF_UP)


def calculate_itinerary_activity_total(
  itinerary_data: dict,
) -> Decimal:
  total = Decimal("0.00")

  for day in itinerary_data.get("days", []):
    for activity in day.get("activities", []):
      total += normalize_activity_cost(
        activity.get("estimated_cost")
      )

  return total.quantize(MONEY, rounding=ROUND_HALF_UP)