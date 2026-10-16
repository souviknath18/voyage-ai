
import uuid

import pytest
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine

from app.core.config import settings
from app.modules.explore.repository import (
    get_destination_by_wikidata_id,
    list_destinations,
    upsert_destinations,
)
from app.modules.explore.schemas.destination import DestinationData


@pytest.mark.asyncio
async def test_explore_repository_transaction():
    engine = create_async_engine(
        settings.database_url,
        pool_pre_ping=True,
    )

    test_id = f"Q{uuid.uuid4().int % (10**18) + 10**18}"

    destination = DestinationData(
        wikidata_id=test_id,
        name="Vaycogo Repository Test",
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
                    inserted = await upsert_destinations(
                        db,
                        [destination],
                    )

                    assert inserted == 1

                    saved = await get_destination_by_wikidata_id(
                        db,
                        test_id,
                    )

                    assert saved is not None
                    assert saved.name == "Vaycogo Repository Test"
                    assert saved.country_code == "FRA"

                    updated_destination = destination.model_copy(
                        update={
                            "name": "Vaycogo Updated Test",
                        }
                    )

                    updated = await upsert_destinations(
                        db,
                        [updated_destination],
                    )

                    assert updated == 1

                    saved_again = await get_destination_by_wikidata_id(
                        db,
                        test_id,
                    )

                    assert saved_again is not None
                    assert saved_again.name == "Vaycogo Updated Test"

                    listed = await list_destinations(
                        db,
                        limit=100,
                        country_code="FRA",
                    )

                    assert any(
                        item.wikidata_id == test_id
                        for item in listed
                    )

            finally:
                await transaction.rollback()

    finally:
        await engine.dispose()