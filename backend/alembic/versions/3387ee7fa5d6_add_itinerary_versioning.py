"""add itinerary versioning

Revision ID: 3387ee7fa5d6
Revises: be427fded315
Create Date: 2026-10-02 20:22:23.370534

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3387ee7fa5d6'
down_revision: Union[str, Sequence[str], None] = 'be427fded315'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    # Add version and give existing itineraries version 1.
    op.add_column(
        "itineraries",
        sa.Column(
            "version",
            sa.Integer(),
            nullable=False,
            server_default="1",
        ),
    )

    # trip_id can now have multiple itinerary versions.
    op.drop_index(
        op.f("ix_itineraries_trip_id"),
        table_name="itineraries",
    )

    op.create_index(
        op.f("ix_itineraries_trip_id"),
        "itineraries",
        ["trip_id"],
        unique=False,
    )

    # A trip cannot have duplicate version numbers.
    op.create_unique_constraint(
        "uq_itineraries_trip_version",
        "itineraries",
        ["trip_id", "version"],
    )

    # New versions are assigned by application logic.
    op.alter_column(
        "itineraries",
        "version",
        server_default=None,
    )


def downgrade() -> None:
    """Downgrade schema."""

    # Keep only the newest itinerary for each trip before
    # restoring the old one-itinerary-per-trip constraint.
    op.execute(
        """
        DELETE FROM itineraries AS old
        USING itineraries AS newer
        WHERE old.trip_id = newer.trip_id
          AND old.version < newer.version
        """
    )

    op.drop_constraint(
        "uq_itineraries_trip_version",
        "itineraries",
        type_="unique",
    )

    op.drop_index(
        op.f("ix_itineraries_trip_id"),
        table_name="itineraries",
    )

    op.create_index(
        op.f("ix_itineraries_trip_id"),
        "itineraries",
        ["trip_id"],
        unique=True,
    )

    op.drop_column(
        "itineraries",
        "version",
    )
