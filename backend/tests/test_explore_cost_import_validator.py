
from decimal import Decimal

import pytest

from app.modules.explore.services.cost_import_validator import (
    validate_cost_import_batch,
)


def make_record(**overrides):
    record = {
        "wikidata_id": "Q90",
        "budget_style": "balanced",
        "daily_cost": "100.50",
        "currency": "EUR",
        "source": "test_source",
    }
    record.update(overrides)
    return record


def test_valid_cost_record():
    result = validate_cost_import_batch([make_record()])

    assert len(result) == 1
    assert result[0]["wikidata_id"] == "Q90"
    assert result[0]["daily_cost"] == Decimal("100.50")


def test_normalizes_values():
    result = validate_cost_import_batch([
        make_record(
            wikidata_id=" Q90 ",
            budget_style=" VALUE ",
            daily_cost="99.995",
            currency=" eur ",
            source=" test_source ",
        )
    ])

    assert result[0] == {
        "wikidata_id": "Q90",
        "budget_style": "value",
        "daily_cost": Decimal("100.00"),
        "currency": "EUR",
        "source": "test_source",
    }


@pytest.mark.parametrize(
    "invalid_id",
    ["", "90", "Q0", "q90", "QABC", "Q-1", None],
)
def test_rejects_invalid_wikidata_id(invalid_id):
    with pytest.raises(ValueError, match="invalid Wikidata ID"):
        validate_cost_import_batch([
            make_record(wikidata_id=invalid_id)
        ])


@pytest.mark.parametrize(
    "invalid_cost",
    ["-1", "NaN", "Infinity", "invalid", True, 100],
)
def test_rejects_invalid_daily_cost(invalid_cost):
    with pytest.raises(ValueError):
        validate_cost_import_batch([
            make_record(daily_cost=invalid_cost)
        ])


def test_rejects_invalid_budget_style():
    with pytest.raises(ValueError, match="Budget style"):
        validate_cost_import_batch([
            make_record(budget_style="premium")
        ])


def test_rejects_invalid_currency():
    with pytest.raises(ValueError, match="Currency"):
        validate_cost_import_batch([
            make_record(currency="EURO")
        ])


def test_rejects_missing_field():
    record = make_record()
    del record["source"]

    with pytest.raises(ValueError, match="missing or unexpected fields"):
        validate_cost_import_batch([record])


def test_rejects_extra_field():
    with pytest.raises(ValueError, match="missing or unexpected fields"):
        validate_cost_import_batch([
            make_record(unknown="extra")
        ])


def test_rejects_duplicate_cost_key():
    with pytest.raises(ValueError, match="duplicate destination-cost key"):
        validate_cost_import_batch([
            make_record(),
            make_record(daily_cost="200.00"),
        ])


def test_allows_different_budget_styles():
    result = validate_cost_import_batch([
        make_record(budget_style="value"),
        make_record(budget_style="balanced"),
        make_record(budget_style="luxury"),
    ])

    assert len(result) == 3


def test_rejects_invalid_batch_type():
    with pytest.raises(ValueError, match="list or tuple"):
        validate_cost_import_batch("invalid")


def test_rejects_non_object_record():
    with pytest.raises(ValueError, match="expected an object"):
        validate_cost_import_batch(["invalid"])


def test_empty_batch():
    assert validate_cost_import_batch([]) == []



from datetime import date, timedelta


def test_accepts_all_cost_metadata():
    record = {
        "wikidata_id": "Q90",
        "budget_style": "balanced",
        "daily_cost": "125.50",
        "currency": "EUR",
        "source": "test_source",
        "source_url": "https://example.org/prices",
        "methodology": "Per-person daily estimate",
        "license_type": "CC BY 4.0",
        "reference_date": "2026-01-01",
        "includes_accommodation": True,
        "includes_food": True,
        "includes_local_transport": False,
    }

    result = validate_cost_import_batch([record])[0]

    assert result["source_url"] == "https://example.org/prices"
    assert result["methodology"] == "Per-person daily estimate"
    assert result["license_type"] == "CC BY 4.0"
    assert result["reference_date"] == date(2026, 1, 1)
    assert result["includes_accommodation"] is True
    assert result["includes_food"] is True
    assert result["includes_local_transport"] is False


def test_omitted_metadata_stays_omitted():
    record = {
        "wikidata_id": "Q90",
        "budget_style": "balanced",
        "daily_cost": "100.00",
        "currency": "EUR",
        "source": "test_source",
    }

    result = validate_cost_import_batch([record])[0]

    assert "source_url" not in result
    assert "methodology" not in result
    assert "reference_date" not in result
    assert "includes_food" not in result


@pytest.mark.parametrize(
    "invalid_url",
    [
        "not-a-url",
        "ftp://example.org/data",
        "https://",
        "https://user:password@example.org",
        "https://example.org:8080/data",
        123,
        "",
    ],
)
def test_rejects_invalid_source_url(invalid_url):
    record = {
        "wikidata_id": "Q90",
        "budget_style": "balanced",
        "daily_cost": "100.00",
        "currency": "EUR",
        "source": "test_source",
        "source_url": invalid_url,
    }

    with pytest.raises(ValueError):
        validate_cost_import_batch([record])


def test_rejects_future_reference_date():
    future_date = (
        date.today() + timedelta(days=1)
    ).isoformat()

    record = {
        "wikidata_id": "Q90",
        "budget_style": "balanced",
        "daily_cost": "100.00",
        "currency": "EUR",
        "source": "test_source",
        "reference_date": future_date,
    }

    with pytest.raises(ValueError):
        validate_cost_import_batch([record])


@pytest.mark.parametrize(
    "invalid_value",
    ["true", "false", 1, 0, [], {}],
)
def test_rejects_invalid_coverage_flag(invalid_value):
    record = {
        "wikidata_id": "Q90",
        "budget_style": "balanced",
        "daily_cost": "100.00",
        "currency": "EUR",
        "source": "test_source",
        "includes_food": invalid_value,
    }

    with pytest.raises(ValueError):
        validate_cost_import_batch([record])


def test_accepts_explicit_null_metadata():
    record = {
        "wikidata_id": "Q90",
        "budget_style": "balanced",
        "daily_cost": "100.00",
        "currency": "EUR",
        "source": "test_source",
        "source_url": None,
        "reference_date": None,
        "includes_food": None,
    }

    result = validate_cost_import_batch([record])[0]

    assert "source_url" in result
    assert result["source_url"] is None
    assert result["reference_date"] is None
    assert result["includes_food"] is None