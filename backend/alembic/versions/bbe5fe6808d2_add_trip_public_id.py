"""add trip public id

Revision ID: bbe5fe6808d2
Revises: 6e7a0609bb0b
Create Date: 2026-09-16 18:14:42.261154

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "bbe5fe6808d2"
down_revision: Union[str, Sequence[str], None] = "6e7a0609bb0b"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Step 1:
    # Add trip_id as nullable first because
    # existing trips do not have a trip_id.
    op.add_column(
        "trips",
        sa.Column(
            "trip_id",
            sa.String(length=40),
            nullable=True,
        ),
    )

    connection = op.get_bind()

    # Step 2:
    # Get existing trips in creation order.
    trips = connection.execute(
        sa.text(
            """
            SELECT id, created_at
            FROM trips
            ORDER BY created_at ASC, id ASC
            """
        )
    ).fetchall()

    # Step 3:
    # Generate public IDs for existing trips.
    #
    # Numbering resets for each date:
    #
    # TRIP-20260915-0001
    # TRIP-20260915-0002
    # TRIP-20260916-0001
    counters: dict[str, int] = {}

    for trip in trips:
        created_at = trip.created_at

        date_part = created_at.strftime(
            "%Y%m%d"
        )

        counters[date_part] = (
            counters.get(date_part, 0)
            + 1
        )

        sequence_number = (
            counters[date_part]
        )

        trip_public_id = (
            f"TRIP-{date_part}-"
            f"{sequence_number:04d}"
        )

        connection.execute(
            sa.text(
                """
                UPDATE trips
                SET trip_id = :trip_id
                WHERE id = :id
                """
            ),
            {
                "trip_id": trip_public_id,
                "id": trip.id,
            },
        )

    # Step 4:
    # Existing rows now have IDs,
    # so make the column required.
    op.alter_column(
        "trips",
        "trip_id",
        existing_type=sa.String(
            length=40
        ),
        nullable=False,
    )

    # Step 5:
    # Create a unique index.
    op.create_index(
        "ix_trips_trip_id",
        "trips",
        ["trip_id"],
        unique=True,
    )


def downgrade() -> None:
    op.drop_index(
        "ix_trips_trip_id",
        table_name="trips",
    )

    op.drop_column(
        "trips",
        "trip_id",
    )