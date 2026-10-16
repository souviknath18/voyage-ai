
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.explore.models import (
    ExploreCategory,
    ExploreDestination,
)
from app.modules.explore.repository import (
    get_destination_by_wikidata_id,
    list_destinations,
)
from app.modules.explore.schemas.destination import (
    ExploreDestinationListResponse,
    ExploreDestinationResponse,
)


async def get_explore_destinations(
    db: AsyncSession,
    *,
    limit: int = 20,
    offset: int = 0,
    country_code: str | None = None,
    search: str | None = None,
    category: str | None = None,
    interest: str | None = None,
) -> ExploreDestinationListResponse:
    """
    Return paginated Explore destinations with optional
    country, search, category, and interest filtering.

    Category and interest filters use AND logic.
    """

    if not 1 <= limit <= 100:
        raise ValueError("limit must be between 1 and 100")

    if offset < 0:
        raise ValueError("offset must be non-negative")

    # Normalize and validate country code.
    normalized_country_code = (
        country_code.strip().upper()
        if country_code is not None
        else None
    )

    if normalized_country_code is not None:
        if (
            len(normalized_country_code) != 3
            or not normalized_country_code.isalpha()
        ):
            raise ValueError(
                "country_code must be a 3-letter country code"
            )

    # Normalize and validate destination search.
    normalized_search = (
        search.strip()
        if search is not None
        else None
    )

    if normalized_search == "":
        normalized_search = None

    if (
        normalized_search is not None
        and len(normalized_search) > 100
    ):
        raise ValueError(
            "search must not exceed 100 characters"
        )

    # Normalize and validate category.
    normalized_category = (
        category.strip().lower()
        if category is not None
        else None
    )

    if normalized_category in ("", "popular"):
        normalized_category = None

    allowed_categories = {
        "culinary",
        "adventure",
        "beaches",
        "culture",
        "technology",
    }

    if (
        normalized_category is not None
        and normalized_category not in allowed_categories
    ):
        raise ValueError(
            "Invalid Explore category"
        )

        # Normalize and validate interest.
    normalized_interest = (
        interest.strip().lower()
        if interest is not None
        else None
    )

    if normalized_interest in ("", "any"):
        normalized_interest = None

    allowed_interests = {
        "culinary",
        "culture",
        "adventure",
        "technology",
        "nature",
    }

    if (
        normalized_interest is not None
        and normalized_interest not in allowed_interests
    ):
        raise ValueError(
            "Invalid or unsupported Explore interest"
        )

    # Fetch destinations using combined filters.
    destinations = await list_destinations(
        db,
        limit=limit,
        offset=offset,
        country_code=normalized_country_code,
        search=normalized_search,
        category=normalized_category,
        interest=normalized_interest,
    )

    # Count destinations using the same filters.
    count_statement = select(
        func.count(ExploreDestination.id)
    )

    if normalized_country_code is not None:
        count_statement = count_statement.where(
            ExploreDestination.country_code
            == normalized_country_code
        )

    if normalized_search is not None:
        escaped_search = (
            normalized_search
            .replace("\\", "\\\\")
            .replace("%", "\\%")
            .replace("_", "\\_")
        )

        count_statement = count_statement.where(
            ExploreDestination.name.ilike(
                f"%{escaped_search}%",
                escape="\\",
            )
        )

    if normalized_category is not None:
        count_statement = count_statement.where(
            ExploreDestination.categories.any(
                ExploreCategory.slug == normalized_category
            )
        )

    # Apply interest to the total count as well.
    if normalized_interest is not None:
        count_statement = count_statement.where(
            ExploreDestination.categories.any(
                ExploreCategory.slug == normalized_interest
            )
        )

    total = await db.scalar(count_statement)

    return ExploreDestinationListResponse(
        items=[
            ExploreDestinationResponse.model_validate(
                destination
            )
            for destination in destinations
        ],
        total=total or 0,
        limit=limit,
        offset=offset,
    )


async def get_explore_destination(
    db: AsyncSession,
    wikidata_id: str,
) -> ExploreDestinationResponse | None:
    """Retrieve one destination using its Wikidata ID."""

    destination = await get_destination_by_wikidata_id(
        db,
        wikidata_id,
    )

    if destination is None:
        return None

    return ExploreDestinationResponse.model_validate(
        destination
    )