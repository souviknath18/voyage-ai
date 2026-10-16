
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Path, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.explore.schemas.destination import (
    ExploreDestinationListResponse,
    ExploreDestinationResponse,
)
from app.modules.explore.service import (
    get_explore_destination,
    get_explore_destinations,
)

# Use the existing database session dependency from your project.
from collections.abc import AsyncGenerator

from app.db.session import AsyncSessionLocal


async def get_explore_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session

router = APIRouter(
    prefix="/explore",
    tags=["Explore Destinations"],
)


@router.get(
    "/destinations",
    response_model=ExploreDestinationListResponse,
)
async def list_explore_destinations(
    db: Annotated[AsyncSession, Depends(get_explore_db)],
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
    offset: Annotated[int, Query(ge=0)] = 0,
    country_code: Annotated[
        str | None,
        Query(min_length=3, max_length=3, pattern=r"^[A-Za-z]{3}$"),
    ] = None,
    search: Annotated[
        str | None,
        Query(max_length=100),
    ] = None,
    category: Annotated[
        str | None,
        Query(
            max_length=50,
            description=(
                "Filter destinations by travel category: "
                "culinary, adventure, beaches, culture, "
                "or technology. Popular returns all destinations."
            ),
        ),
    ] = None,

    interest: Annotated[
        str | None,
        Query(
            max_length=50,
            description=(
                "Optional travel interest: culinary, culture, "
                "adventure, or technology. "
                "Combined with category using AND logic."
            ),
        ),
    ] = None,
):
    try:
        return await get_explore_destinations(
            db,
            limit=limit,
            offset=offset,
            country_code=country_code,
            search=search,
            category=category,
            interest=interest,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=422,
            detail=str(exc),
        ) from exc


@router.get(
    "/destinations/{wikidata_id}",
    response_model=ExploreDestinationResponse,
)
async def retrieve_explore_destination(
    db: Annotated[AsyncSession, Depends(get_explore_db)],
    wikidata_id: Annotated[
        str,
        Path(pattern=r"^Q[1-9][0-9]{0,18}$"),
    ],
):
    destination = await get_explore_destination(
        db,
        wikidata_id,
    )

    if destination is None:
        raise HTTPException(
            status_code=404,
            detail="Destination not found",
        )

    return destination