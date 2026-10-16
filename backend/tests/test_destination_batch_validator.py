
import pytest

from app.modules.explore.schemas.destination import DestinationData
from app.modules.explore.services.destination_batch_validator import (
    DestinationBatchValidationError,
    validate_destination_batch,
)


def make_destination(
    wikidata_id: str = "Q90",
    name: str = "Paris",
) -> DestinationData:
    return DestinationData(
        wikidata_id=wikidata_id,
        name=name,
        country="France",
        country_code="FRA",
        latitude=48.8566,
        longitude=2.3522,
        source="wikidata",
        country_source="natural_earth",
    )


def test_valid_batch():
    records = [
        make_destination("Q90", "Paris"),
        make_destination("Q1490", "Tokyo"),
    ]

    result = validate_destination_batch(
        destinations=records,
        requested_wikidata_ids=["Q90", "Q1490"],
    )

    assert len(result) == 2
    assert result == records


def test_duplicate_returned_destination():
    records = [
        make_destination("Q90"),
        make_destination("Q90"),
    ]

    with pytest.raises(
        DestinationBatchValidationError,
        match="Duplicate returned IDs",
    ):
        validate_destination_batch(
            destinations=records,
            requested_wikidata_ids=["Q90"],
        )


def test_duplicate_requested_destination():
    with pytest.raises(
        DestinationBatchValidationError,
        match="Duplicate requested IDs",
    ):
        validate_destination_batch(
            destinations=[make_destination()],
            requested_wikidata_ids=["Q90", "Q90"],
        )


def test_missing_destination():
    with pytest.raises(
        DestinationBatchValidationError,
        match="Missing destinations",
    ):
        validate_destination_batch(
            destinations=[make_destination()],
            requested_wikidata_ids=["Q90", "Q1490"],
        )


def test_unexpected_destination():
    with pytest.raises(
        DestinationBatchValidationError,
        match="Unexpected destinations",
    ):
        validate_destination_batch(
            destinations=[
                make_destination("Q90"),
                make_destination("Q1490"),
            ],
            requested_wikidata_ids=["Q90"],
        )


def test_invalid_requested_id():
    with pytest.raises(
        DestinationBatchValidationError,
        match="Invalid requested Wikidata IDs",
    ):
        validate_destination_batch(
            destinations=[make_destination()],
            requested_wikidata_ids=["invalid"],
        )


def test_unvalidated_record():
    with pytest.raises(
        DestinationBatchValidationError,
        match="Unvalidated destination records",
    ):
        validate_destination_batch(
            destinations=[{"wikidata_id": "Q90"}],
            requested_wikidata_ids=["Q90"],
        )


def test_empty_requested_batch():
    with pytest.raises(
        DestinationBatchValidationError,
        match="At least one Wikidata ID",
    ):
        validate_destination_batch(
            destinations=[],
            requested_wikidata_ids=[],
        )
