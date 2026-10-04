from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, Field


BudgetCategory = Literal[
  "food",
  "transport",
  "activity",
  "shopping",
  "other",
]

BudgetStatus = Literal[
  "within_budget",
  "over_budget",
  "no_budget",
]


class BudgetPotentialSavings(BaseModel):
  amount: Decimal = Field(
    ge=Decimal("0"),
  )
  percentage: float = Field(
    ge=0,
    le=100,
  )


class BudgetInsight(BaseModel):
  title: str = Field(
    min_length=1,
    max_length=120,
  )
  description: str = Field(
    min_length=1,
    max_length=500,
  )


class BudgetRecommendation(BaseModel):
  title: str = Field(
    min_length=1,
    max_length=120,
  )
  description: str = Field(
    min_length=1,
    max_length=500,
  )
  category: BudgetCategory
  estimated_savings: Decimal = Field(
    ge=Decimal("0"),
  )


class BudgetCategoryResponse(BaseModel):
  category: BudgetCategory
  estimated_cost: Decimal = Field(
    ge=Decimal("0"),
  )
  percentage: float = Field(
    ge=0,
    le=100,
  )


class BudgetResponse(BaseModel):
  trip_id: str
  currency: str = Field(
    min_length=3,
    max_length=3,
  )

  total_budget: Decimal | None
  estimated_cost: Decimal = Field(
    ge=Decimal("0"),
  )
  remaining_budget: Decimal | None
  utilization_percentage: float | None

  status: BudgetStatus

  categories: list[
    BudgetCategoryResponse
  ]

  potential_savings: BudgetPotentialSavings

  insight: BudgetInsight

  recommendations: list[
    BudgetRecommendation
  ]