from decimal import Decimal
from typing import Final


BUDGET_CATEGORIES: Final[tuple[str, ...]] = (
  "food",
  "transport",
  "activity",
  "shopping",
  "other",
)

DEFAULT_BUDGET_CATEGORY: Final[str] = "other"

MONEY_QUANTIZER: Final[Decimal] = Decimal("0.01")


# These are estimation heuristics, not guaranteed savings.
ESTIMATED_SAVINGS_RATES: Final[dict[str, Decimal]] = {
  "food": Decimal("0.15"),
  "transport": Decimal("0.10"),
  "activity": Decimal("0.10"),
  "shopping": Decimal("0.10"),
  "other": Decimal("0.05"),
}