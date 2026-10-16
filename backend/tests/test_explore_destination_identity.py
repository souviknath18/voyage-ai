import pytest

from app.modules.explore.schemas.destination import DestinationData
from app.modules.explore.services.destination_batch_validator import (
    DestinationBatchValidationError,
    validate_destination_batch,
)


def make_destination(
    wikidata_id: str,
    name: str,
) -> DestinationData:
    return DestinationData(
        wikidata_id=wikidata_id,
        name=name,
        country="Austria",
        country_code="AUT",
        latitude=48.208333333,
        longitude=16.3725,
        source="wikidata",
        country_source="natural_earth",
    )


def test_correct_destination_name_passes():
    destination = make_destination("Q1741", "Vienna")

    result = validate_destination_batch(
        destinations=[destination],
        requested_wikidata_ids=["Q1741"],
        expected_names={"Q1741": "Vienna"},
    )

    assert len(result) == 1
    assert result[0].name == "Vienna"


def test_incorrect_destination_name_rejected():
    destination = make_destination("Q1748", "Copenhagen")

    with pytest.raises(
        DestinationBatchValidationError,
        match="Destination name mismatch",
    ):
        validate_destination_batch(
            destinations=[destination],
            requested_wikidata_ids=["Q1748"],
            expected_names={"Q1748": "Vienna"},
        )


def test_destination_name_case_insensitive():
    destination = make_destination("Q1741", "VIENNA")

    result = validate_destination_batch(
        destinations=[destination],
        requested_wikidata_ids=["Q1741"],
        expected_names={"Q1741": "vienna"},
    )

    assert len(result) == 1


def test_missing_expected_name_rejected():
    destination = make_destination("Q1741", "Vienna")

    with pytest.raises(
        DestinationBatchValidationError,
        match="No expected name configured",
    ):
        validate_destination_batch(
            destinations=[destination],
            requested_wikidata_ids=["Q1741"],
            expected_names={},
        )