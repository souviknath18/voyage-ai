"""
Seed the default Explore destination categories.

Run from the backend directory:
    python -m scripts.seed_explore_categories
"""

import asyncio

from sqlalchemy import select

from app.db.session import AsyncSessionLocal
from app.modules.explore.models import ExploreCategory


DEFAULT_CATEGORIES = {
    "culinary": "Culinary",
    "adventure": "Adventure",
    "beaches": "Beaches",
    "culture": "Culture",
    "technology": "Technology",
    "nature": "Nature",
}


async def seed_explore_categories() -> None:
    async with AsyncSessionLocal() as db:
        async with db.begin():
            result = await db.execute(
                select(ExploreCategory.slug)
            )

            existing_slugs = set(result.scalars().all())

            added = 0

            for slug, name in DEFAULT_CATEGORIES.items():
                if slug in existing_slugs:
                    continue

                db.add(
                    ExploreCategory(
                        slug=slug,
                        name=name,
                    )
                )

                added += 1

        print(
            f"Explore categories seeded successfully. "
            f"Added: {added}, "
            f"Already existing: {len(DEFAULT_CATEGORIES) - added}"
        )


if __name__ == "__main__":
    asyncio.run(seed_explore_categories())