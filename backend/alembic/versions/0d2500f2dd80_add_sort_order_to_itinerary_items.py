"""add sort order to itinerary items

Revision ID: 0d2500f2dd80
Revises: 8b7ec35a8b06
Create Date: 2026-09-20 19:38:56.426480
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "0d2500f2dd80"

down_revision: Union[
    str,
    Sequence[str],
    None,
] = "8b7ec35a8b06"

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
    # 1. Add the column as nullable
    # so existing rows do not fail.
    op.add_column(
        "itinerary_items",
        sa.Column(
            "sort_order",
            sa.Integer(),
            nullable=True,
        ),
    )

    # 2. Give existing rows a temporary
    # value.
    op.execute(
        """
        UPDATE itinerary_items
        SET sort_order = 1
        WHERE sort_order IS NULL
        """
    )

    # 3. Make it required for all future
    # rows.
    op.alter_column(
        "itinerary_items",
        "sort_order",
        nullable=False,
    )


def downgrade() -> None:
    op.drop_column(
        "itinerary_items",
        "sort_order",
    )