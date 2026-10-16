
"""
Import sourced Explore destination costs.

Default: validate and preview only.
Use --commit to persist validated records.

Only use datasets whose storage and commercial reuse
permissions have been verified.
"""

import argparse
import asyncio
import json
from pathlib import Path

from sqlalchemy.ext.asyncio import (
    async_sessionmaker,
    create_async_engine,
)

from app.core.config import settings
from app.modules.explore.repositories.cost import (
    get_destination_ids_by_wikidata_ids,
    upsert_destination_costs,
)
from app.modules.explore.services.cost_import_validator import (
    validate_cost_import_batch,
)


async def import_destination_costs(
    file_path: Path,
    commit: bool = False,
) -> None:
    if not file_path.is_file():
        raise ValueError(
            f"Cost dataset not found: {file_path}"
        )

    with file_path.open("r", encoding="utf-8-sig") as file:
        raw_records = json.load(file)

    records = validate_cost_import_batch(raw_records)

    if not records:
        raise ValueError("Cost dataset is empty.")

    print(f"Validated {len(records)} cost records.")

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
                destination_ids = (
                    await get_destination_ids_by_wikidata_ids(
                        db,
                        [
                            record["wikidata_id"]
                            for record in records
                        ],
                    )
                )

                missing_ids = sorted({
                    record["wikidata_id"]
                    for record in records
                    if record["wikidata_id"] not in destination_ids
                })

                if missing_ids:
                    raise ValueError(
                        "Unknown destination Wikidata IDs: "
                        + ", ".join(missing_ids)
                    )

                costs = [
                    {
                        **{
                            key: value
                            for key, value in record.items()
                            if key != "wikidata_id"
                        },
                        "destination_id": destination_ids[
                            record["wikidata_id"]
                        ],
                    }
                    for record in records
                ]

                preview = [
                    {
                        **record,
                        "daily_cost": str(record["daily_cost"]),
                    }
                    for record in records
                ]

                print(
                    json.dumps(
                        preview,
                        indent=2,
                        ensure_ascii=False,
                        default=lambda value: (
                            value.isoformat()
                            if hasattr(value, "isoformat")
                            else str(value)
                        ),
                    )
                )

                if not commit:
                    print(
                        "\nPreview complete. "
                        "No database changes were made."
                    )
                    return

                count = await upsert_destination_costs(
                    db,
                    costs,
                )

        print(
            f"\nSuccessfully committed {count} cost records."
        )

    finally:
        await engine.dispose()


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Import Vaycogo destination costs."
    )

    parser.add_argument(
        "file",
        type=Path,
        help="Path to the JSON cost dataset.",
    )

    parser.add_argument(
        "--commit",
        action="store_true",
        help="Persist validated costs to PostgreSQL.",
    )

    args = parser.parse_args()

    asyncio.run(
        import_destination_costs(
            file_path=args.file,
            commit=args.commit,
        )
    )


if __name__ == "__main__":
    main()