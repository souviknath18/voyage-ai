from decimal import Decimal, ROUND_HALF_UP

from app.modules.budgets.schemas import (
  BudgetInsight,
  BudgetPotentialSavings,
  BudgetRecommendation,
)

from app.modules.budgets.constants import (
  ESTIMATED_SAVINGS_RATES,
  MONEY_QUANTIZER,
)


def _money(value: Decimal) -> Decimal:
  return value.quantize(
    MONEY_QUANTIZER,
    rounding=ROUND_HALF_UP,
  )


def build_budget_recommendations(
  category_totals: dict[str, Decimal],
) -> list[BudgetRecommendation]:

  recommendations: list[
    BudgetRecommendation
  ] = []

  for category, amount in category_totals.items():
    normalized_category = (
      category
      .strip()
      .lower()
    )

    rate = ESTIMATED_SAVINGS_RATES.get(
      normalized_category,
      Decimal("0"),
    )

    estimated_savings = _money(
      amount * rate
    )

    if estimated_savings <= 0:
      continue

    if normalized_category == "food":
      title = "Reduce dining costs"
      description = (
        "Choose lower-cost restaurants, "
        "local eateries, or more affordable "
        "meal options for selected meals."
      )

    elif normalized_category == "transport":
      title = "Optimize local transport"
      description = (
        "Use public transport or lower-cost "
        "local travel options where practical."
      )

    elif normalized_category == "activity":
      title = "Optimize activity spending"
      description = (
        "Prioritize high-value experiences "
        "and consider lower-cost alternatives "
        "for selected paid activities."
      )

    elif normalized_category == "shopping":
      title = "Review shopping expenses"
      description = (
        "Reduce discretionary shopping or "
        "prioritize purchases that matter most "
        "to your trip."
      )

    elif normalized_category == "accommodation":
      title = "Review accommodation costs"
      description = (
        "Consider more cost-efficient stays "
        "that still match your trip preferences."
      )

    else:
      title = (
        f"Reduce {normalized_category} costs"
      )
      description = (
        "Review this spending category for "
        "lower-cost alternatives."
      )

    recommendations.append(
      BudgetRecommendation(
        title=title,
        description=description,
        category=normalized_category,
        estimated_savings=estimated_savings,
      )
    )

  recommendations.sort(
    key=lambda item:
      item.estimated_savings,
    reverse=True,
  )

  return recommendations


def calculate_potential_savings(
  estimated_cost: Decimal,
  recommendations: list[
    BudgetRecommendation
  ],
) -> BudgetPotentialSavings:

  amount = _money(
    sum(
      (
        recommendation.estimated_savings
        for recommendation
        in recommendations
      ),
      Decimal("0"),
    )
  )

  if estimated_cost > 0:
    percentage = round(
      float(
        (
          amount /
          estimated_cost
        ) * Decimal("100")
      ),
      2,
    )
  else:
    percentage = 0.0

  return BudgetPotentialSavings(
    amount=amount,
    percentage=percentage,
  )


def build_budget_insight(
  total_budget: Decimal | None,
  estimated_cost: Decimal,
  remaining_budget: Decimal | None,
  utilization_percentage: float | None,
) -> BudgetInsight:

  if total_budget is None:
    return BudgetInsight(
      title="No trip budget set",
      description=(
        "Add a trip budget to compare your "
        "estimated itinerary cost against "
        "your spending target."
      ),
    )

  utilization = (
    utilization_percentage or 0
  )

  if estimated_cost > total_budget:
    over_budget = _money(
      estimated_cost -
      total_budget
    )

    return BudgetInsight(
      title="Your trip is over budget",
      description=(
        f"Your current itinerary exceeds "
        f"the assigned budget by "
        f"{over_budget}."
      ),
    )

  if utilization >= 90:
    return BudgetInsight(
      title="Your trip is close to budget",
      description=(
        f"Your itinerary currently uses "
        f"{utilization:.1f}% of the "
        f"assigned budget."
      ),
    )

  if utilization >= 70:
    return BudgetInsight(
      title="Your budget is on track",
      description=(
        f"Your itinerary uses "
        f"{utilization:.1f}% of the "
        f"assigned budget, leaving "
        f"{remaining_budget} available."
      ),
    )

  return BudgetInsight(
    title="Your trip is comfortably within budget",
    description=(
      f"Your itinerary currently uses "
      f"{utilization:.1f}% of the assigned "
      f"budget, leaving {remaining_budget} "
      f"available."
    ),
  )