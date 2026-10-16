
"""
Database repository for Vaycogo Explore Destinations.
"""

from collections.abc import Sequence

from sqlalchemy import select, update
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.explore.models import (
    ExploreCategory,
    ExploreDestination,
)
from app.modules.explore.schemas.destination import DestinationData


async def upsert_destinations(
    db: AsyncSession,
    destinations: Sequence[DestinationData],
) -> int:
    """
    Insert new destinations or update existing ones.

    Uses Wikidata ID as the unique identifier.

    Does not commit the transaction; the caller
    is responsible for committing or rolling back.
    """

    if not destinations:
        return 0

    values = [
        destination.model_dump()
        for destination in destinations
    ]

    statement = insert(ExploreDestination).values(values)

    statement = statement.on_conflict_do_update(
        constraint="uq_explore_destinations_wikidata_id",
        set_={
            "name": statement.excluded.name,
            "country": statement.excluded.country,
            "country_code": statement.excluded.country_code,
            "latitude": statement.excluded.latitude,
            "longitude": statement.excluded.longitude,
            "source": statement.excluded.source,
            "country_source": statement.excluded.country_source,
        },
    )

    await db.execute(
        statement,
        execution_options={"synchronize_session": "fetch"},
    )

    return len(destinations)


async def get_destination_by_wikidata_id(
    db: AsyncSession,
    wikidata_id: str,
) -> ExploreDestination | None:
    """Retrieve a destination using its Wikidata ID."""

    statement = select(ExploreDestination).where(
        ExploreDestination.wikidata_id == wikidata_id
    )

    result = await db.execute(
        statement.execution_options(populate_existing=True)
    )

    return result.scalar_one_or_none()


async def list_destinations(
    db: AsyncSession,
    limit: int = 50,
    offset: int = 0,
    country_code: str | None = None,
    search: str | None = None,
    category: str | None = None,
    interest: str | None = None,
) -> list[ExploreDestination]:
    """
    Retrieve destinations with optional:
    - Country filtering
    - Case-insensitive name search
    - Travel category filtering
    - Pagination

    All filters can be combined.
    """

    if not 1 <= limit <= 100:
        raise ValueError("Limit must be between 1 and 100.")

    if offset < 0:
        raise ValueError("Offset cannot be negative.")

    statement = select(ExploreDestination)

    # Country filtering
    if country_code is not None:
        statement = statement.where(
            ExploreDestination.country_code == country_code.upper()
        )

    # Destination name search
    if search is not None:
        normalized_search = search.strip()

        if normalized_search:
            escaped_search = (
                normalized_search
                .replace("\\", "\\\\")
                .replace("%", "\\%")
                .replace("_", "\\_")
            )

            statement = statement.where(
                ExploreDestination.name.ilike(
                    f"%{escaped_search}%",
                    escape="\\",
                )
            )

    # Travel category filtering
    if category is not None:
        normalized_category = category.strip().lower()

        if normalized_category and normalized_category != "popular":
            statement = statement.where(
                ExploreDestination.categories.any(
                    ExploreCategory.slug == normalized_category
                )
            )

    if interest is not None:
        normalized_interest = interest.strip().lower()

        if normalized_interest and normalized_interest != "any":
            statement = statement.where(
                ExploreDestination.categories.any(
                    ExploreCategory.slug == normalized_interest
                )
            )

    statement = (
        statement.order_by(
            ExploreDestination.name,
            ExploreDestination.wikidata_id,
        )
        .limit(limit)
        .offset(offset)
    )

    result = await db.execute(statement)

    return list(result.scalars().all())


async def update_destination_description(
    db: AsyncSession,
    *,
    wikidata_id: str,
    description: str,
    description_source: str = "wikipedia",
    overwrite: bool = False,
) -> bool:
    """
    Update an existing destination's description.

    Returns True if a row was updated, otherwise False.

    Does not create destinations or commit the transaction.
    """

    normalized_description = description.strip()
    normalized_source = description_source.strip()

    if not normalized_description:
        raise ValueError("Description cannot be empty.")

    if not normalized_source:
        raise ValueError("Description source cannot be empty.")

    if len(normalized_source) > 100:
        raise ValueError("Description source is too long.")

    statement = (
        update(ExploreDestination)
        .where(
            ExploreDestination.wikidata_id == wikidata_id
        )
    )

    if not overwrite:
        statement = statement.where(
            ExploreDestination.description.is_(None)
        )

    statement = statement.values(
        description=normalized_description,
        description_source=normalized_source,
    )

    result = await db.execute(statement)

    return result.rowcount > 0



async def update_destination_image(
    db: AsyncSession,
    *,
    wikidata_id: str,
    image_data: dict,
    overwrite: bool = False,
) -> bool:
    """
    Update an existing destination's Wikimedia image metadata.

    - Does not create destinations.
    - Does not overwrite existing images by default.
    - Does not commit the transaction.
    - Preserves geographic and description fields.
    """

    from app.modules.explore.services.image_validator import (
        validate_wikimedia_image,
    )

    validated = validate_wikimedia_image(image_data)

    if validated.get("wikidata_id") != wikidata_id:
        raise ValueError(
            "Image Wikidata ID does not match destination."
        )

    statement = (
        update(ExploreDestination)
        .where(
            ExploreDestination.wikidata_id == wikidata_id
        )
    )

    if not overwrite:
        statement = statement.where(
            ExploreDestination.image_url.is_(None)
        )

    statement = statement.values(
        image_url=validated["image_url"],
        image_source=validated["image_source"],
        image_file=validated["image_file"],
        image_page_url=validated["image_page_url"],
        image_artist=validated["artist"],
        image_license=validated["license"],
        image_license_url=validated["license_url"],
    )

    result = await db.execute(statement)

    return result.rowcount > 0