from decimal import Decimal

from pydantic import BaseModel


class BudgetCategoryResponse(BaseModel):
  category: str
  estimated_cost: Decimal
  percentage: float


class BudgetResponse(BaseModel):
  trip_id: str
  currency: str

  total_budget: Decimal | None
  estimated_cost: Decimal
  remaining_budget: Decimal | None
  utilization_percentage: float | None

  status: str

  categories: list[BudgetCategoryResponse]