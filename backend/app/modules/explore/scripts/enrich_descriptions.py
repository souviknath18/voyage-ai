
"""
Batch Wikipedia description enrichment for Vaycogo.

Usage:
    python -m app.modules.explore.scripts.enrich_descriptions
    python -m app.modules.explore.scripts.enrich_descriptions --commit

Default mode: Preview only.
"""

import argparse
import asyncio

from sqlalchemy import select

from app.db.session import AsyncSessionLocal
from app.modules.explore.models import ExploreDestination
from app.modules.explore.services.description_enrichment import (
    enrich_destination_description,
)


async def run_enrichment(
    *,
    commit: bool = False,
    overwrite: bool = False,
) -> None:
    async with AsyncSessionLocal() as db:
        result = await db.execute(
            select(
                ExploreDestination.wikidata_id,
                ExploreDestination.name,
            ).order_by(ExploreDestination.name)
        )

        destinations = result.all()
        await db.rollback()

    print(f"Total destinations: {len(destinations)}")
    print(f"Mode: {'COMMIT' if commit else 'PREVIEW'}")
    print("-" * 60)

    counts = {
        "preview": 0,
        "updated": 0,
        "already_enriched": 0,
        "no_description": 0,
        "not_found": 0,
        "skipped": 0,
        "errors": 0,
    }

    for index, (wikidata_id, name) in enumerate(
        destinations,
        start=1,
    ):
        print(
            f"[{index}/{len(destinations)}] "
            f"{name} ({wikidata_id})"
        )

        try:
            # Use a dedicated session for each destination.
            async with AsyncSessionLocal() as db:
                result = await enrich_destination_description(
                    db,
                    wikidata_id=wikidata_id,
                    commit=commit,
                    overwrite=overwrite,
                )

                status = result["status"]
                counts[status] = counts.get(status, 0) + 1

                print(f"  Status: {status}")

                if status == "preview":
                    description = result["description"]
                    print(
                        f"  Description length: {len(description)}"
                    )
                    print(
                        f"  Preview: {description[:150]}"
                    )

                if not commit:
                    await db.rollback()

        except Exception as exc:
            counts["errors"] += 1
            print(
                f"  ERROR: {type(exc).__name__}: {exc}"
            )

        # Avoid sending requests too quickly.
        await asyncio.sleep(0.5)

    print()
    print("=" * 60)
    print("ENRICHMENT SUMMARY")
    print("=" * 60)

    for status, count in counts.items():
        print(f"{status}: {count}")

    print()
    print(
        "Database writes:",
        "ENABLED" if commit else "DISABLED",
    )


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Enrich Vaycogo destinations with Wikipedia descriptions."
    )

    parser.add_argument(
        "--commit",
        action="store_true",
        help="Persist descriptions to the database.",
    )

    parser.add_argument(
        "--overwrite",
        action="store_true",
        help="Replace existing descriptions.",
    )

    args = parser.parse_args()

    if args.overwrite and not args.commit:
        parser.error("--overwrite requires --commit")

    asyncio.run(
        run_enrichment(
            commit=args.commit,
            overwrite=args.overwrite,
        )
    )


if __name__ == "__main__":
    main()