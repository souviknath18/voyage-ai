
from decimal import Decimal

import pytest

from app.modules.explore.services.cost_normalizer import (
    normalize_budget_style,
    normalize_currency,
    normalize_daily_cost,
    normalize_source,
)


def test_normalize_valid_daily_cost():
    assert normalize_daily_cost("125.456") == Decimal("125.46")
    assert normalize_daily_cost(Decimal("99.99")) == Decimal("99.99")


@pytest.mark.parametrize(
    "value",
    ["-10", "invalid", "NaN", "Infinity", "-Infinity", None, True, 10.5],
)
def test_reject_invalid_daily_cost(value):
    with pytest.raises(ValueError):
        normalize_daily_cost(value)


@pytest.mark.parametrize(
    ("value", "expected"),
    [
        ("VALUE", "value"),
        (" Balanced ", "balanced"),
        ("luxury", "luxury"),
    ],
)
def test_normalize_valid_budget_style(value, expected):
    assert normalize_budget_style(value) == expected


@pytest.mark.parametrize("value", ["premium", "", "economy", None])
def test_reject_invalid_budget_style(value):
    with pytest.raises(ValueError):
        normalize_budget_style(value)


def test_normalize_valid_currency():
    assert normalize_currency("usd") == "USD"
    assert normalize_currency(" inr ") == "INR"


@pytest.mark.parametrize("value", ["US", "USDD", "12A", "", None])
def test_reject_invalid_currency(value):
    with pytest.raises(ValueError):
        normalize_currency(value)


def test_normalize_valid_source():
    assert normalize_source(" TravelData ") == "TravelData"


@pytest.mark.parametrize("value", ["", "   ", None, "x" * 101])
def test_reject_invalid_source(value):
    with pytest.raises(ValueError):
        normalize_source(value)


def test_accept_maximum_daily_cost():
    assert normalize_daily_cost(
        "9999999999.99"
    ) == Decimal("9999999999.99")


@pytest.mark.parametrize(
    "value",
    [
        "10000000000.00",
        "9999999999.995",
        "999999999999999999.99",
    ],
)
def test_reject_daily_cost_exceeding_database_limit(value):
    with pytest.raises(
        ValueError,
        match="Daily cost exceeds the database limit",
    ):
        normalize_daily_cost(value)
