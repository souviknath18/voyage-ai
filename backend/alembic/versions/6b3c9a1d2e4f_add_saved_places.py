"""Add saved flag to trip places."""

from alembic import op
import sqlalchemy as sa


revision = "6b3c9a1d2e4f"
down_revision = "3c5e51b520b7"
branch_labels = None
depends_on = None


def upgrade():
  op.add_column(
    "trip_places",
    sa.Column(
      "is_saved",
      sa.Boolean(),
      nullable=False,
      server_default=sa.false(),
    ),
  )


def downgrade():
  op.drop_column(
    "trip_places",
    "is_saved",
  )