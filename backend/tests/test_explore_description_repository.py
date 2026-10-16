
import uuid

import pytest
import pytest_asyncio

from sqlalchemy import select

from app.db.session import AsyncSessionLocal, engine
from app.modules.explore.models import ExploreDestination
from app.modules.explore.repository import (
    update_destination_description,
)


def generate_test_qid() -> str:
    """
    Generate a unique Wikidata-style ID that fits
    the database VARCHAR(20) constraint.
    """
    return f"Q{uuid.uuid4().int % (10**18) + 10**18}"


@pytest_asyncio.fixture(
    scope="module",
    loop_scope="module",
    autouse=True,
)
async def reset_database_pool():
    """
    Dispose stale database connections before testing
    and clean up the connection pool afterward.
    """
    await engine.dispose()

    yield

    await engine.dispose()


@pytest.mark.asyncio(loop_scope="module")
async def test_description_update_with_rollback():
    """
    Verify description updates without persisting
    any test changes.
    """

    test_qid = generate_test_qid()

    async with AsyncSessionLocal() as db:
        try:
            destination = ExploreDestination(
                wikidata_id=test_qid,
                name="Test Destination",
                country="Test Country",
                country_code="TST",
                latitude=10.0,
                longitude=20.0,
                source="test",
                country_source="test",
            )

            db.add(destination)
            await db.flush()

            # First update should succeed.
            updated = await update_destination_description(
                db,
                wikidata_id=test_qid,
                description="First description.",
            )

            assert updated is True

            # Existing description must not be overwritten.
            updated_again = await update_destination_description(
                db,
                wikidata_id=test_qid,
                description="Second description.",
            )

            assert updated_again is False

            # Explicit overwrite should succeed.
            overwritten = await update_destination_description(
                db,
                wikidata_id=test_qid,
                description="Updated description.",
                overwrite=True,
            )

            assert overwritten is True

            result = await db.execute(
                select(ExploreDestination)
                .where(
                    ExploreDestination.wikidata_id == test_qid
                )
                .execution_options(populate_existing=True)
            )

            saved = result.scalar_one()

            assert saved.description == "Updated description."
            assert saved.description_source == "wikipedia"

            # Geographic data must remain unchanged.
            assert saved.name == "Test Destination"
            assert saved.country == "Test Country"
            assert saved.country_code == "TST"
            assert saved.latitude == 10.0
            assert saved.longitude == 20.0

        finally:
            # Roll back all test database changes.
            await db.rollback()


@pytest.mark.asyncio(loop_scope="module")
async def test_description_update_missing_destination():
    """
    Updating a nonexistent destination should
    return False without creating a record.
    """

    test_qid = generate_test_qid()

    async with AsyncSessionLocal() as db:
        try:
            updated = await update_destination_description(
                db,
                wikidata_id=test_qid,
                description="Missing destination.",
            )

            assert updated is False

        finally:
            await db.rollback()


@pytest.mark.asyncio(loop_scope="module")
async def test_description_update_rejects_empty_text():
    """
    Empty descriptions should be rejected.
    """

    async with AsyncSessionLocal() as db:
        try:
            with pytest.raises(
                ValueError,
                match="Description cannot be empty",
            ):
                await update_destination_description(
                    db,
                    wikidata_id="Q90",
                    description="   ",
                )

        finally:
            await db.rollback()