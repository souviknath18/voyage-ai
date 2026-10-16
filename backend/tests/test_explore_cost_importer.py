
import json

import pytest
from datetime import date
from unittest.mock import AsyncMock, patch
from uuid import uuid4
from decimal import Decimal

from app.modules.explore.scripts.import_destination_costs import (
    import_destination_costs,
)


def write_dataset(tmp_path, records):
    file_path = tmp_path / "destination_costs.json"
    file_path.write_text(
        json.dumps(records),
        encoding="utf-8-sig",
    )
    return file_path


def make_record(**overrides):
    record = {
        "wikidata_id": "Q90",
        "budget_style": "balanced",
        "daily_cost": "100.50",
        "currency": "EUR",
        "source": "synthetic_test",
    }
    record.update(overrides)
    return record


@pytest.mark.asyncio
async def test_rejects_negative_cost_before_database(tmp_path):
    file_path = write_dataset(
        tmp_path,
        [make_record(daily_cost="-100.00")],
    )

    with pytest.raises(
        ValueError,
        match="Daily cost cannot be negative",
    ):
        await import_destination_costs(file_path)


@pytest.mark.asyncio
async def test_rejects_empty_dataset(tmp_path):
    file_path = write_dataset(tmp_path, [])

    with pytest.raises(
        ValueError,
        match="Cost dataset is empty",
    ):
        await import_destination_costs(file_path)


@pytest.mark.asyncio
async def test_rejects_missing_file(tmp_path):
    file_path = tmp_path / "missing.json"

    with pytest.raises(
        ValueError,
        match="Cost dataset not found",
    ):
        await import_destination_costs(file_path)


@pytest.mark.asyncio
async def test_rejects_duplicate_records(tmp_path):
    file_path = write_dataset(
        tmp_path,
        [
            make_record(),
            make_record(daily_cost="200.00"),
        ],
    )

    with pytest.raises(
        ValueError,
        match="duplicate destination-cost key",
    ):
        await import_destination_costs(file_path)


@pytest.mark.asyncio
async def test_rejects_unknown_destination(tmp_path):
    file_path = write_dataset(
        tmp_path,
        [
            make_record(
                wikidata_id="Q999999999999999",
            )
        ],
    )

    with pytest.raises(
        ValueError,
        match="Unknown destination Wikidata IDs",
    ):
        await import_destination_costs(file_path)


@pytest.mark.asyncio
async def test_valid_dry_run(tmp_path, capsys):
    file_path = write_dataset(
        tmp_path,
        [make_record()],
    )

    await import_destination_costs(
        file_path,
        commit=False,
    )

    output = capsys.readouterr().out

    assert "Validated 1 cost records." in output
    assert "No database changes were made." in output
    assert '"daily_cost": "100.50"' in output



@pytest.mark.asyncio
async def test_valid_commit_calls_cost_repository(
    tmp_path,
    capsys,
):
    file_path = write_dataset(
        tmp_path,
        [make_record()],
    )

    destination_id = uuid4()

    with patch(
        "app.modules.explore.scripts.import_destination_costs."
        "get_destination_ids_by_wikidata_ids",
        new_callable=AsyncMock,
        return_value={"Q90": destination_id},
    ), patch(
        "app.modules.explore.scripts.import_destination_costs."
        "upsert_destination_costs",
        new_callable=AsyncMock,
        return_value=1,
    ) as mock_upsert:
        await import_destination_costs(
            file_path,
            commit=True,
        )

    mock_upsert.assert_awaited_once()

    db, costs = mock_upsert.await_args.args

    assert db is not None
    assert costs == [{
        "destination_id": destination_id,
        "budget_style": "balanced",
        "daily_cost": Decimal("100.50"),
        "currency": "EUR",
        "source": "synthetic_test",
    }]

    output = capsys.readouterr().out
    assert "Successfully committed 1 cost records." in output



@pytest.mark.asyncio
async def test_metadata_dry_run_preview(
    tmp_path,
    capsys,
):
    file_path = write_dataset(
        tmp_path,
        [
            make_record(
                source_url="https://example.org/prices",
                methodology="Synthetic daily cost estimate",
                license_type="TEST ONLY",
                reference_date="2026-01-01",
                includes_accommodation=True,
                includes_food=True,
                includes_local_transport=False,
            )
        ],
    )

    await import_destination_costs(
        file_path,
        commit=False,
    )

    output = capsys.readouterr().out

    assert "Validated 1 cost records." in output
    assert '"source_url": "https://example.org/prices"' in output
    assert '"reference_date": "2026-01-01"' in output
    assert '"includes_accommodation": true' in output
    assert '"includes_food": true' in output
    assert '"includes_local_transport": false' in output
    assert "No database changes were made." in output


@pytest.mark.asyncio
async def test_metadata_commit_passes_fields_to_repository(
    tmp_path,
    capsys,
):
    file_path = write_dataset(
        tmp_path,
        [
            make_record(
                source_url="https://example.org/prices",
                methodology="Synthetic daily cost estimate",
                license_type="TEST ONLY",
                reference_date="2026-01-01",
                includes_accommodation=True,
                includes_food=True,
                includes_local_transport=False,
            )
        ],
    )

    destination_id = uuid4()

    with patch(
        "app.modules.explore.scripts.import_destination_costs."
        "get_destination_ids_by_wikidata_ids",
        new_callable=AsyncMock,
        return_value={"Q90": destination_id},
    ), patch(
        "app.modules.explore.scripts.import_destination_costs."
        "upsert_destination_costs",
        new_callable=AsyncMock,
        return_value=1,
    ) as mock_upsert:

        await import_destination_costs(
            file_path,
            commit=True,
        )

    mock_upsert.assert_awaited_once()

    db, costs = mock_upsert.await_args.args

    assert db is not None

    assert costs == [{
        "destination_id": destination_id,
        "budget_style": "balanced",
        "daily_cost": Decimal("100.50"),
        "currency": "EUR",
        "source": "synthetic_test",
        "source_url": "https://example.org/prices",
        "methodology": "Synthetic daily cost estimate",
        "license_type": "TEST ONLY",
        "reference_date": date(2026, 1, 1),
        "includes_accommodation": True,
        "includes_food": True,
        "includes_local_transport": False,
    }]

    output = capsys.readouterr().out

    assert "Successfully committed 1 cost records." in output