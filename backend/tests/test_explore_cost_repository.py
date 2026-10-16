
import uuid
from decimal import Decimal
from datetime import date
from sqlalchemy import select

import pytest
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine

from app.core.config import settings
from app.modules.explore.models import ExploreDestinationCost
from app.modules.explore.repositories.cost import (
    get_destination_ids_by_wikidata_ids,
    upsert_destination_costs,
)
from app.modules.explore.repositories.destination import (
    upsert_destinations,
)
from app.modules.explore.schemas.destination import DestinationData


@pytest.mark.asyncio
async def test_explore_cost_repository_transaction():
    engine = create_async_engine(
        settings.database_url,
        pool_pre_ping=True,
    )

    test_id = f"Q{uuid.uuid4().int % (10**18) + 10**18}"

    destination = DestinationData(
        wikidata_id=test_id,
        name="Vaycogo Cost Repository Test",
        country="France",
        country_code="FRA",
        latitude=48.8566,
        longitude=2.3522,
        source="wikidata",
        country_source="natural_earth",
    )

    try:
        async with engine.connect() as connection:
            transaction = await connection.begin()

            try:
                async with AsyncSession(
                    bind=connection,
                    expire_on_commit=False,
                ) as db:
                    await upsert_destinations(
                        db,
                        [destination],
                    )

                    # Resolve destination IDs.
                    destination_ids = (
                        await get_destination_ids_by_wikidata_ids(
                            db,
                            [test_id, "Q_NONEXISTENT_TEST"],
                        )
                    )

                    assert test_id in destination_ids
                    assert "Q_NONEXISTENT_TEST" not in destination_ids

                    destination_id = destination_ids[test_id]

                    # Insert a cost record.
                    cost = {
                        "destination_id": destination_id,
                        "budget_style": "balanced",
                        "daily_cost": Decimal("100.00"),
                        "currency": "USD",
                        "source": "repository_test",
                    }

                    inserted = await upsert_destination_costs(
                        db,
                        [cost],
                    )

                    assert inserted == 1

                    statement = select(
                        ExploreDestinationCost
                    ).where(
                        ExploreDestinationCost.destination_id
                        == destination_id
                    )

                    result = await db.execute(statement)
                    saved = result.scalar_one()

                    assert saved.daily_cost == Decimal("100.00")
                    assert saved.currency == "USD"
                    assert saved.budget_style == "balanced"

                    # Update existing record.
                    updated_cost = {
                        **cost,
                        "daily_cost": Decimal("125.50"),
                    }

                    updated = await upsert_destination_costs(
                        db,
                        [updated_cost],
                    )

                    assert updated == 1

                    db.expire_all()

                    result = await db.execute(statement)
                    saved_again = result.scalar_one()

                    assert saved_again.daily_cost == Decimal("125.50")

                    # Reject duplicate keys in a batch.
                    with pytest.raises(
                        ValueError,
                        match="Duplicate destination-cost",
                    ):
                        await upsert_destination_costs(
                            db,
                            [cost, updated_cost],
                        )

                    # Empty batches are safe.
                    assert (
                        await upsert_destination_costs(db, [])
                        == 0
                    )

                    assert (
                        await get_destination_ids_by_wikidata_ids(
                            db,
                            [],
                        )
                        == {}
                    )

            finally:
                await transaction.rollback()

    finally:
        await engine.dispose()



@pytest.mark.asyncio
async def test_cost_upsert_rolls_back_on_failure():
    engine = create_async_engine(
        settings.database_url,
        pool_pre_ping=True,
    )

    try:
        async with engine.connect() as connection:
            transaction = await connection.begin()

            try:
                async with AsyncSession(
                    bind=connection,
                    expire_on_commit=False,
                ) as db:
                    # Use an existing destination.
                    destination_ids = (
                        await get_destination_ids_by_wikidata_ids(
                            db,
                            ["Q90"],
                        )
                    )

                    assert "Q90" in destination_ids
                    destination_id = destination_ids["Q90"]

                    # This valid insert must be rolled back.
                    await upsert_destination_costs(
                        db,
                        [{
                            "destination_id": destination_id,
                            "budget_style": "balanced",
                            "daily_cost": Decimal("100.00"),
                            "currency": "ZZZ",
                            "source": "synthetic_rollback_test",
                        }],
                    )

                    # Force a database constraint violation.
                    with pytest.raises(Exception):
                        await upsert_destination_costs(
                            db,
                            [{
                                "destination_id": destination_id,
                                "budget_style": "invalid_style",
                                "daily_cost": Decimal("200.00"),
                                "currency": "ZZZ",
                                "source": "synthetic_rollback_test",
                            }],
                        )

            finally:
                await transaction.rollback()

        # Verify the rolled-back test record does not exist.
        async with AsyncSession(engine) as verify_db:
            destination_ids = (
                await get_destination_ids_by_wikidata_ids(
                    verify_db,
                    ["Q90"],
                )
            )

            statement = select(
                ExploreDestinationCost
            ).where(
                ExploreDestinationCost.destination_id
                == destination_ids["Q90"],
                ExploreDestinationCost.budget_style
                == "balanced",
                ExploreDestinationCost.currency
                == "ZZZ",
                ExploreDestinationCost.source
                == "synthetic_rollback_test",
            )

            result = await verify_db.execute(statement)
            assert result.scalar_one_or_none() is None

    finally:
        await engine.dispose()



@pytest.mark.asyncio
async def test_cost_metadata_upsert():
    engine = create_async_engine(
        settings.database_url,
        pool_pre_ping=True,
    )

    try:
        async with engine.connect() as connection:
            transaction = await connection.begin()

            try:
                async with AsyncSession(
                    bind=connection,
                    expire_on_commit=False,
                ) as db:
                    destination_ids = (
                        await get_destination_ids_by_wikidata_ids(
                            db,
                            ["Q90"],
                        )
                    )

                    assert "Q90" in destination_ids
                    destination_id = destination_ids["Q90"]

                    base_record = {
                        "destination_id": destination_id,
                        "budget_style": "balanced",
                        "daily_cost": Decimal("100.00"),
                        "currency": "ZZZ",
                        "source": "synthetic_metadata_test",
                    }

                    
                    async def fetch_cost():
                        statement = (
                            select(ExploreDestinationCost)
                            .where(
                                ExploreDestinationCost.destination_id
                                == destination_id,
                                ExploreDestinationCost.budget_style
                                == "balanced",
                                ExploreDestinationCost.currency
                                == "ZZZ",
                            )
                            .execution_options(
                                populate_existing=True
                            )
                        )

                        result = await db.execute(statement)

                        return result.scalar_one()


                    # 1. Insert metadata.
                    await upsert_destination_costs(
                        db,
                        [{
                            **base_record,
                            "source_url": "https://example.org/data",
                            "methodology": "Synthetic test methodology",
                            "license_type": "TEST ONLY",
                            "reference_date": date(2026, 10, 16),
                            "includes_accommodation": True,
                            "includes_food": True,
                            "includes_local_transport": False,
                        }],
                    )

                    cost = await fetch_cost()
                    assert cost.source_url == "https://example.org/data"
                    assert cost.methodology == "Synthetic test methodology"
                    assert cost.license_type == "TEST ONLY"
                    assert cost.reference_date == date(2026, 10, 16)
                    assert cost.includes_accommodation is True
                    assert cost.includes_food is True
                    assert cost.includes_local_transport is False

                    # 2. Omitted metadata must be preserved.
                    await upsert_destination_costs(
                        db,
                        [{
                            **base_record,
                            "daily_cost": Decimal("110.00"),
                        }],
                    )

                    cost = await fetch_cost()
                    assert cost.daily_cost == Decimal("110.00")
                    assert cost.source_url == "https://example.org/data"
                    assert cost.license_type == "TEST ONLY"

                    # 3. Explicit metadata changes must be saved.
                    await upsert_destination_costs(
                        db,
                        [{
                            **base_record,
                            "source_url": "https://example.org/updated",
                            "includes_food": False,
                        }],
                    )

                    cost = await fetch_cost()
                    assert cost.source_url == "https://example.org/updated"
                    assert cost.includes_food is False
                    assert cost.includes_accommodation is True

                    # 4. Explicit None clears a metadata field.
                    await upsert_destination_costs(
                        db,
                        [{
                            **base_record,
                            "source_url": None,
                        }],
                    )

                    cost = await fetch_cost()
                    assert cost.source_url is None
                    assert cost.license_type == "TEST ONLY"

            finally:
                await transaction.rollback()

    finally:
        await engine.dispose()
