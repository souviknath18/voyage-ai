from decimal import Decimal, ROUND_HALF_UP

from app.modules.budgets.constants import MONEY_QUANTIZER


ZERO_MONEY = Decimal("0.00")


def normalize_money(
  value: Decimal | None,
) -> Decimal:
  """
  Normalize a monetary value to two decimal places.

  Missing or negative values are treated as zero.
  """

  if value is None:
    return ZERO_MONEY

  if value < 0:
    return ZERO_MONEY

  return value.quantize(
    MONEY_QUANTIZER,
    rounding=ROUND_HALF_UP,
  )


def calculate_percentage(
  amount: Decimal,
  total: Decimal,
) -> float:
  """
  Calculate a percentage safely.

  Returns 0 when the denominator is zero or negative.
  """

  if total <= 0:
    return 0.0

  percentage = (
    amount
    / total
    * Decimal("100")
  )

  return round(
    float(percentage),
    2,
  )