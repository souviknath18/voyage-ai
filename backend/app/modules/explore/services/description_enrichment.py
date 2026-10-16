
"""
Wikipedia description enrichment service for Vaycogo.

Fetches descriptions for existing Explore destinations.

Database changes are committed only when explicitly requested.
"""

from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.explore.providers.wikipedia import (
    fetch_wikipedia_summary,
)
from app.modules.explore.repository import (
    get_destination_by_wikidata_id,
    update_destination_description,
)


async def enrich_destination_description(
    db: AsyncSession,
    *,
    wikidata_id: str,
    commit: bool = False,
    overwrite: bool = False,
) -> dict:
    """
    Enrich an existing destination with its Wikipedia description.

    By default, this function runs in preview mode and
    does not modify the database.

    The caller should supply a session dedicated to this operation.
    """

    destination = await get_destination_by_wikidata_id(
        db,
        wikidata_id,
    )

    if destination is None:
        return {
            "wikidata_id": wikidata_id,
            "status": "not_found",
            "updated": False,
        }

    if destination.description is not None and not overwrite:
        return {
            "wikidata_id": wikidata_id,
            "status": "already_enriched",
            "updated": False,
        }

    wikipedia_data = await fetch_wikipedia_summary(
        wikidata_id,
    )

    if wikipedia_data is None:
        return {
            "wikidata_id": wikidata_id,
            "status": "no_description",
            "updated": False,
        }

    description = wikipedia_data["description"]

    if not commit:
        return {
            "wikidata_id": wikidata_id,
            "status": "preview",
            "updated": False,
            "description": description,
            "description_source": "wikipedia",
        }

    try:
        updated = await update_destination_description(
            db,
            wikidata_id=wikidata_id,
            description=description,
            description_source="wikipedia",
            overwrite=overwrite,
        )

        if updated:
            await db.commit()

            return {
                "wikidata_id": wikidata_id,
                "status": "updated",
                "updated": True,
                "description_source": "wikipedia",
            }

        await db.rollback()

        return {
            "wikidata_id": wikidata_id,
            "status": "skipped",
            "updated": False,
        }

    except Exception:
        await db.rollback()
        raise