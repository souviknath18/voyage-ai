
"""
Wikimedia image enrichment service for Vaycogo.

Fetches and validates Wikimedia Commons images for
existing Explore destinations.

Preview mode is enabled by default.
"""

from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.explore.providers.wikimedia import (
    fetch_curated_wikimedia_image,
    fetch_wikimedia_image,
)
from app.modules.explore.repository import (
    get_destination_by_wikidata_id,
    update_destination_image,
)
from app.modules.explore.services.image_validator import (
    validate_wikimedia_image,
)


async def enrich_destination_image(
    db: AsyncSession,
    *,
    wikidata_id: str,
    commit: bool = False,
    overwrite: bool = False,
) -> dict:
    """
    Enrich an existing destination with a Wikimedia image.

    - Preview mode never writes to the database.
    - Existing images are protected unless overwrite=True.
    - Image metadata is validated before persistence.
    - Commit mode uses a dedicated database transaction.
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

    if destination.image_url is not None and not overwrite:
        return {
            "wikidata_id": wikidata_id,
            "status": "already_enriched",
            "updated": False,
        }

    image_data = await fetch_curated_wikimedia_image(wikidata_id)

    if image_data is None:
        image_data = await fetch_wikimedia_image(wikidata_id)

    if image_data is None:
        return {
            "wikidata_id": wikidata_id,
            "status": "no_image",
            "updated": False,
        }

    validated = validate_wikimedia_image(
        image_data,
    )

    if validated.get("wikidata_id") != wikidata_id:
        raise ValueError(
            "Image Wikidata ID does not match destination."
        )

    if not commit:
        return {
            "wikidata_id": wikidata_id,
            "status": "preview",
            "updated": False,
            "image_data": validated,
        }

    try:
        updated = await update_destination_image(
            db,
            wikidata_id=wikidata_id,
            image_data=validated,
            overwrite=overwrite,
        )

        if updated:
            await db.commit()

            return {
                "wikidata_id": wikidata_id,
                "status": "updated",
                "updated": True,
                "image_source": validated["image_source"],
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