
"""
Validation and normalization of sourced Explore travel costs.
"""

from decimal import Decimal, InvalidOperation, ROUND_HALF_UP


VALID_BUDGET_STYLES = frozenset({
    "value",
    "balanced",
    "luxury",
})

MONEY_QUANTIZER = Decimal("0.01")
MAX_DAILY_COST = Decimal("9999999999.99")


def normalize_daily_cost(
    value: Decimal | str,
) -> Decimal:
    """
    Validate and normalize an estimated daily cost.

    Reject invalid, negative, and non-finite values.
    """

    if isinstance(value, bool):
        raise ValueError("Daily cost must be a valid decimal amount")

    if not isinstance(value, (Decimal, str)):
        raise ValueError("Daily cost must be a Decimal or string")

    try:
        amount = Decimal(value)
    except InvalidOperation as exc:
        raise ValueError("Invalid daily cost") from exc

    if not amount.is_finite():
        raise ValueError("Daily cost must be finite")

    if amount < 0:
        raise ValueError("Daily cost cannot be negative")

    try:
        normalized_amount = amount.quantize(
            MONEY_QUANTIZER,
            rounding=ROUND_HALF_UP,
        )
    except InvalidOperation as exc:
        raise ValueError(
            "Daily cost is outside the supported range"
        ) from exc

    if normalized_amount > MAX_DAILY_COST:
        raise ValueError(
            "Daily cost exceeds the database limit"
        )

    return normalized_amount


def normalize_budget_style(value: str) -> str:
    """Validate an Explore budget style."""

    if not isinstance(value, str):
        raise ValueError("Budget style must be a string")

    style = value.strip().lower()

    if style not in VALID_BUDGET_STYLES:
        raise ValueError(
            "Budget style must be value, balanced, or luxury"
        )

    return style


def normalize_currency(value: str) -> str:
    """Normalize a three-letter currency code."""

    if not isinstance(value, str):
        raise ValueError("Currency must be a string")

    currency = value.strip().upper()

    if len(currency) != 3 or not currency.isascii() or not currency.isalpha():
        raise ValueError("Currency must be a three-letter code")

    return currency


def normalize_source(value: str) -> str:
    """Require a nonempty source identifier."""

    if not isinstance(value, str):
        raise ValueError("Source must be a string")

    source = value.strip()

    if not source or len(source) > 100:
        raise ValueError("Source must contain 1 to 100 characters")

    return source
