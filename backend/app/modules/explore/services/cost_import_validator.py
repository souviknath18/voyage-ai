
"""
Validate destination-cost import records.

Input records use Wikidata IDs, not internal database UUIDs.
"""

import re
from collections.abc import Sequence
from datetime import date
from decimal import Decimal
from typing import Any
from urllib.parse import urlsplit

from app.modules.explore.services.cost_normalizer import (
    normalize_budget_style,
    normalize_currency,
    normalize_daily_cost,
    normalize_source,
)


WIKIDATA_ID_PATTERN = re.compile(r"Q[1-9][0-9]*\Z")

REQUIRED_FIELDS = {
    "wikidata_id",
    "budget_style",
    "daily_cost",
    "currency",
    "source",
}

OPTIONAL_FIELDS = {
    "source_url",
    "methodology",
    "license_type",
    "reference_date",
    "includes_accommodation",
    "includes_food",
    "includes_local_transport",
}

COVERAGE_FIELDS = {
    "includes_accommodation",
    "includes_food",
    "includes_local_transport",
}


def normalize_optional_text(
    value: Any,
    field: str,
    max_length: int,
) -> str | None:
    if value is None:
        return None

    if not isinstance(value, str):
        raise ValueError(f"{field} must be a string or null")

    value = value.strip()

    if not value:
        raise ValueError(f"{field} cannot be empty")

    if len(value) > max_length:
        raise ValueError(
            f"{field} exceeds {max_length} characters"
        )

    return value


def normalize_source_url(value: Any) -> str | None:
    url = normalize_optional_text(
        value,
        "source_url",
        2048,
    )

    if url is None:
        return None

    try:
        parsed = urlsplit(url)
        hostname = parsed.hostname
        port = parsed.port
    except ValueError as exc:
        raise ValueError("Invalid source_url") from exc

    if (
        parsed.scheme not in {"http", "https"}
        or not hostname
        or parsed.username is not None
        or parsed.password is not None
        or port is not None
        or any(char.isspace() for char in url)
    ):
        raise ValueError(
            "source_url must be a valid HTTP(S) URL"
        )

    return url


def normalize_reference_date(value: Any) -> date | None:
    if value is None:
        return None

    if not isinstance(value, str):
        raise ValueError(
            "reference_date must be an ISO date or null"
        )

    try:
        parsed = date.fromisoformat(value)
    except ValueError as exc:
        raise ValueError(
            "reference_date must use YYYY-MM-DD"
        ) from exc

    if parsed.isoformat() != value:
        raise ValueError(
            "reference_date must use YYYY-MM-DD"
        )

    if parsed > date.today():
        raise ValueError(
            "reference_date cannot be in the future"
        )

    return parsed


def normalize_coverage_flag(
    value: Any,
    field: str,
) -> bool | None:
    if value is None:
        return None

    if type(value) is not bool:
        raise ValueError(
            f"{field} must be true, false, or null"
        )

    return value


def validate_cost_import_batch(
    records: Sequence[dict[str, Any]],
) -> list[dict[str, Any]]:
    """
    Validate and normalize destination-cost records.

    The original five fields remain required.

    Optional metadata is validated when supplied.
    Omitted metadata remains omitted.

    Does not access or modify the database.
    """

    if isinstance(records, (str, bytes)) or not isinstance(
        records, (list, tuple)
    ):
        raise ValueError(
            "Cost records must be a list or tuple"
        )

    validated: list[dict[str, Any]] = []
    seen_keys: set[tuple[str, str, str]] = set()

    for index, record in enumerate(records, start=1):
        if not isinstance(record, dict):
            raise ValueError(
                f"Record {index}: expected an object"
            )

        fields = set(record)

        if (
            not REQUIRED_FIELDS.issubset(fields)
            or fields - REQUIRED_FIELDS - OPTIONAL_FIELDS
        ):
            raise ValueError(
                f"Record {index}: missing or unexpected fields"
            )

        wikidata_id = record["wikidata_id"]

        if not isinstance(wikidata_id, str):
            raise ValueError(
                f"Record {index}: invalid Wikidata ID"
            )

        wikidata_id = wikidata_id.strip()

        if not WIKIDATA_ID_PATTERN.fullmatch(wikidata_id):
            raise ValueError(
                f"Record {index}: invalid Wikidata ID"
            )

        try:
            budget_style = normalize_budget_style(
                record["budget_style"]
            )
            daily_cost = normalize_daily_cost(
                record["daily_cost"]
            )
            currency = normalize_currency(
                record["currency"]
            )
            source = normalize_source(
                record["source"]
            )

            normalized = {
                "wikidata_id": wikidata_id,
                "budget_style": budget_style,
                "daily_cost": daily_cost,
                "currency": currency,
                "source": source,
            }

            if "source_url" in record:
                normalized["source_url"] = (
                    normalize_source_url(
                        record["source_url"]
                    )
                )

            if "methodology" in record:
                normalized["methodology"] = (
                    normalize_optional_text(
                        record["methodology"],
                        "methodology",
                        10000,
                    )
                )

            if "license_type" in record:
                normalized["license_type"] = (
                    normalize_optional_text(
                        record["license_type"],
                        "license_type",
                        100,
                    )
                )

            if "reference_date" in record:
                normalized["reference_date"] = (
                    normalize_reference_date(
                        record["reference_date"]
                    )
                )

            for field in COVERAGE_FIELDS:
                if field in record:
                    normalized[field] = (
                        normalize_coverage_flag(
                            record[field],
                            field,
                        )
                    )

        except ValueError as exc:
            raise ValueError(
                f"Record {index}: {exc}"
            ) from exc

        key = (
            wikidata_id,
            budget_style,
            currency,
        )

        if key in seen_keys:
            raise ValueError(
                f"Record {index}: duplicate destination-cost key"
            )

        seen_keys.add(key)
        validated.append(normalized)

    return validated