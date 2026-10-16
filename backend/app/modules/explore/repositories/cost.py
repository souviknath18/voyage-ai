
"""
Database repository for Explore destination costs.

Input records must be validated before persistence.
Transaction management belongs to the caller.
"""

from collections.abc import Sequence
from decimal import Decimal
from uuid import UUID

from sqlalchemy import select, func
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.explore.models import (
    ExploreDestination,
    ExploreDestinationCost,
)


async def get_destination_ids_by_wikidata_ids(
    db: AsyncSession,
    wikidata_ids: Sequence[str],
) -> dict[str, UUID]:
    """
    Resolve Wikidata IDs to existing destination UUIDs.

    Unknown destinations are omitted.
    """

    if not wikidata_ids:
        return {}

    statement = select(
        ExploreDestination.wikidata_id,
        ExploreDestination.id,
    ).where(
        ExploreDestination.wikidata_id.in_(
            set(wikidata_ids)
        )
    )

    result = await db.execute(statement)

    return {
        wikidata_id: destination_id
        for wikidata_id, destination_id in result.all()
    }



async def upsert_destination_costs(
    db: AsyncSession,
    costs: Sequence[dict],
) -> int:
    """
    Insert or update validated destination-cost records.

    Required fields:
        destination_id
        budget_style
        daily_cost
        currency
        source

    Optional metadata:
        source_url
        methodology
        license_type
        reference_date
        includes_accommodation
        includes_food
        includes_local_transport

    Omitted metadata fields preserve existing values
    during updates.

    Explicit None values clear existing metadata.

    Does not commit the transaction.
    """

    if not costs:
        return 0

    required_fields = (
        "destination_id",
        "budget_style",
        "daily_cost",
        "currency",
        "source",
    )

    metadata_fields = (
        "source_url",
        "methodology",
        "license_type",
        "reference_date",
        "includes_accommodation",
        "includes_food",
        "includes_local_transport",
    )

    values = []

    for cost in costs:
        record = {
            field: cost[field]
            for field in required_fields
        }

        for field in metadata_fields:
            if field in cost:
                record[field] = cost[field]

        values.append(record)

    # Reject duplicate conflict keys.
    keys = [
        (
            value["destination_id"],
            value["budget_style"],
            value["currency"],
        )
        for value in values
    ]

    if len(keys) != len(set(keys)):
        raise ValueError(
            "Duplicate destination-cost records in batch."
        )

    # Records can contain different optional metadata
    # fields. Group them by their column sets so omitted
    # fields are not inserted as NULL during an upsert.
    groups = {}

    for value in values:
        column_key = tuple(sorted(value.keys()))
        groups.setdefault(column_key, []).append(value)

    for column_key, group_values in groups.items():
        statement = insert(
            ExploreDestinationCost
        ).values(group_values)

        update_fields = {
            "daily_cost": statement.excluded.daily_cost,
            "source": statement.excluded.source,
            "updated_at": func.now(),
        }

        # Update only metadata explicitly supplied
        # in this group.
        for field in metadata_fields:
            if field in column_key:
                update_fields[field] = getattr(
                    statement.excluded,
                    field,
                )

        statement = statement.on_conflict_do_update(
            constraint=(
                "uq_explore_cost_destination_style_currency"
            ),
            set_=update_fields,
        )

        await db.execute(statement)

    return len(values)