"""
Assign curated travel categories to Explore destinations.

Run from the backend directory:

python -m app.modules.explore.scripts.seed_destination_categories
"""

import asyncio

from sqlalchemy import select

from app.db.session import AsyncSessionLocal
from app.modules.explore.models import (
    ExploreCategory,
    ExploreDestination,
)


# Editorial travel-interest classifications.
# Review these assignments before production release.
DESTINATION_CATEGORIES = {
    "Q727": ["culture", "culinary"],
    "Q1861": ["culinary", "culture"],
    "Q1492": ["beaches", "culture", "culinary"],
    "Q64": ["culture", "technology", "culinary"],
    "Q1486": ["culture", "culinary"],
    "Q85": ["culture", "adventure"],
    "Q5465": ["adventure", "beaches", "culinary"],
    "Q1353": ["culture", "culinary"],
    "Q612": ["technology", "adventure", "beaches"],
    "Q8646": ["culinary", "technology", "adventure"],
    "Q1865": ["culinary", "culture", "technology"],
    "Q34600": ["culture", "culinary"],
    "Q84": ["culture", "culinary", "technology"],
    "Q65": ["beaches", "culture", "culinary"],
    "Q2807": ["culture", "culinary"],
    "Q3141": ["culinary", "culture", "beaches"],
    "Q1156": ["culinary", "culture"],
    "Q60": ["culture", "culinary", "technology"],
    "Q90": ["culture", "culinary"],
    "Q1085": ["culture", "culinary"],
    "Q8678": ["beaches", "adventure", "culture"],
    "Q220": ["culture", "culinary"],
    "Q62": ["technology", "culinary", "culture"],
    "Q8684": ["technology", "culinary", "culture"],
    "Q334": ["technology", "culinary", "culture"],
    "Q3130": ["beaches", "adventure", "culture"],
    "Q1490": ["technology", "culinary", "culture"],
    "Q172": ["culinary", "culture", "technology"],
    "Q24639": ["adventure", "beaches", "culinary"],
    "Q1741": ["culture", "culinary"],
    "Q85": ["culture", "adventure", "nature"],
    "Q5465": ["adventure", "beaches", "culinary", "nature"],
    "Q612": ["technology", "adventure", "beaches", "nature"],
    "Q65": ["beaches", "culture", "culinary", "nature"],
    "Q8678": ["beaches", "adventure", "culture", "nature"],
    "Q3130": ["beaches", "adventure", "culture", "nature"],
    "Q24639": ["adventure", "beaches", "culinary", "nature"],
}


async def seed_destination_categories() -> None:
    async with AsyncSessionLocal() as db:
        categories_result = await db.execute(
            select(ExploreCategory)
        )

        categories = {
            category.slug: category
            for category in categories_result.scalars().all()
        }

        missing_categories = {
            slug
            for slugs in DESTINATION_CATEGORIES.values()
            for slug in slugs
            if slug not in categories
        }

        if missing_categories:
            raise RuntimeError(
                "Missing categories: "
                + ", ".join(sorted(missing_categories))
            )

        destinations_result = await db.execute(
            select(ExploreDestination)
        )

        destinations = {
            destination.wikidata_id: destination
            for destination in destinations_result.scalars().all()
        }

        added = 0
        existing = 0
        missing_destinations = []

        for wikidata_id, slugs in DESTINATION_CATEGORIES.items():
            destination = destinations.get(wikidata_id)

            if destination is None:
                missing_destinations.append(wikidata_id)
                continue

            existing_slugs = {
                category.slug
                for category in destination.categories
            }

            for slug in slugs:
                if slug in existing_slugs:
                    existing += 1
                    continue

                destination.categories.append(categories[slug])
                existing_slugs.add(slug)
                added += 1

        await db.commit()

        print("Destination category seeding completed.")
        print(f"Relationships added: {added}")
        print(f"Already existing: {existing}")
        print(
            f"Missing destinations: "
            f"{len(missing_destinations)}"
        )

        if missing_destinations:
            print(
                "Missing Wikidata IDs: "
                + ", ".join(missing_destinations)
            )


if __name__ == "__main__":
    asyncio.run(seed_destination_categories())