
"""
Estimated daily travel costs for Explore destinations.

These are indicative per-person daily estimates,
not live hotel or flight booking prices.
"""

import uuid
from datetime import date, datetime
from decimal import Decimal

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    Date,
    DateTime,
    ForeignKey,
    Numeric,
    String,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class ExploreDestinationCost(Base):
    __tablename__ = "explore_destination_costs"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    destination_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey(
            "explore_destinations.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    budget_style: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    daily_cost: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        nullable=False,
    )

    currency: Mapped[str] = mapped_column(
        String(3),
        nullable=False,
    )

    source: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    # Source and methodology metadata

    source_url: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    methodology: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    license_type: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    reference_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
    )

    # Cost coverage metadata

    includes_accommodation: Mapped[bool | None] = mapped_column(
        Boolean,
        nullable=True,
    )

    includes_food: Mapped[bool | None] = mapped_column(
        Boolean,
        nullable=True,
    )

    includes_local_transport: Mapped[bool | None] = mapped_column(
        Boolean,
        nullable=True,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    __table_args__ = (
        UniqueConstraint(
            "destination_id",
            "budget_style",
            "currency",
            name="uq_explore_cost_destination_style_currency",
        ),
        CheckConstraint(
            "budget_style IN ('value', 'balanced', 'luxury')",
            name="ck_explore_cost_budget_style",
        ),
        CheckConstraint(
            "daily_cost >= 0",
            name="ck_explore_cost_nonnegative",
        ),
    )