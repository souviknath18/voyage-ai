
"""
Import Vaycogo Explore Destinations into PostgreSQL.

Default: validate and preview only.
Use --commit to persist destinations.
"""

import argparse
import asyncio
import json

from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker

from app.core.config import settings
from app.modules.explore.providers.wikidata import fetch_destinations
from app.modules.explore.schemas.destination import DestinationData
from app.modules.explore.services.country_resolver import resolve_country
from app.modules.explore.services.destination_batch_validator import (
    validate_destination_batch,
)
from app.modules.explore.scripts.preview_wikidata_destinations import (
    DESTINATIONS,
    parse_coordinates,
)
from app.modules.explore.repository import upsert_destinations


async def import_destinations(commit: bool = False) -> None:
    requested_ids = list(DESTINATIONS.values())

    expected_names = {
        wikidata_id: city_name
        for city_name, wikidata_id in DESTINATIONS.items()
    }

    print(f"Fetching {len(requested_ids)} destinations...")

    raw_destinations = await fetch_destinations(requested_ids)

    # Detect duplicate provider records before indexing by ID.
    raw_ids = [
        item["wikidata_id"]
        for item in raw_destinations
    ]

    if len(raw_ids) != len(set(raw_ids)):
        raise ValueError(
            "Wikidata returned duplicate destination records."
        )

    raw_by_id = {
        item["wikidata_id"]: item
        for item in raw_destinations
    }

    validated_destinations: list[DestinationData] = []

    for wikidata_id in requested_ids:
        raw = raw_by_id.get(wikidata_id)

        if raw is None:
            continue

        coordinates = parse_coordinates(
            raw.get("coordinates")
        )

        if coordinates is None:
            raise ValueError(
                f"Invalid coordinates for {wikidata_id}."
            )

        country = resolve_country(
            latitude=coordinates["latitude"],
            longitude=coordinates["longitude"],
        )

        if country is None:
            raise ValueError(
                f"Country could not be resolved for {wikidata_id}."
            )

        destination = DestinationData(
            wikidata_id=wikidata_id,
            name=raw["name"],
            country=country["name"],
            country_code=country["iso_code"],
            latitude=coordinates["latitude"],
            longitude=coordinates["longitude"],
            source=raw["source"],
            country_source="natural_earth",
        )

        validated_destinations.append(destination)

    validated_destinations = validate_destination_batch(
        destinations=validated_destinations,
        requested_wikidata_ids=requested_ids,
    )

    validated_destinations = validate_destination_batch(
        destinations=validated_destinations,
        requested_wikidata_ids=requested_ids,
        expected_names=expected_names,
    )

    print(
        json.dumps(
            [
                destination.model_dump()
                for destination in validated_destinations
            ],
            indent=2,
            ensure_ascii=False,
        )
    )

    if not commit:
        print(
            "\nPreview complete. "
            "No database changes were made."
        )
        return

    engine = create_async_engine(
        settings.database_url,
        pool_pre_ping=True,
    )

    try:
        session_factory = async_sessionmaker(
            engine,
            expire_on_commit=False,
        )

        async with session_factory() as db:
            async with db.begin():
                count = await upsert_destinations(
                    db,
                    validated_destinations,
                )

        print(
            f"\nSuccessfully committed "
            f"{count} destinations."
        )

    finally:
        await engine.dispose()


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Import Vaycogo destinations."
    )

    parser.add_argument(
        "--commit",
        action="store_true",
        help="Persist destinations to PostgreSQL.",
    )

    args = parser.parse_args()

    asyncio.run(
        import_destinations(commit=args.commit)
    )


if __name__ == "__main__":
    main()