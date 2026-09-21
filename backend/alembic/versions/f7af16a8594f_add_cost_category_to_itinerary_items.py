"""add cost category to itinerary items

Revision ID: f7af16a8594f
Revises: 0d2500f2dd80
Create Date: 2026-09-20 20:34:03.241906
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "f7af16a8594f"

down_revision: Union[
    str,
    Sequence[str],
    None,
] = "0d2500f2dd80"

branch_labels: Union[
    str,
    Sequence[str],
    None,
] = None

depends_on: Union[
    str,
    Sequence[str],
    None,
] = None


def upgrade() -> None:
    # Add as nullable first because existing
    # itinerary items do not have this field.
    op.add_column(
        "itinerary_items",
        sa.Column(
            "cost_category",
            sa.String(length=30),
            nullable=True,
        ),
    )

    # Existing itinerary items were created before
    # cost categories existed. We cannot reliably
    # infer their category, so use "other".
    op.execute(
        """
        UPDATE itinerary_items
        SET cost_category = 'other'
        WHERE cost_category IS NULL
        """
    )

    # New itinerary items must always have a category.
    op.alter_column(
        "itinerary_items",
        "cost_category",
        existing_type=sa.String(length=30),
        nullable=False,
    )


def downgrade() -> None:
    op.drop_column(
        "itinerary_items",
        "cost_category",
    )