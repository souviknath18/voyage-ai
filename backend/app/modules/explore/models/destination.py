"""
Database model for Explore destinations.
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import (
    DateTime,
    Float,
    Index,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from .associations import explore_destination_categories


class ExploreDestination(Base):
    __tablename__ = "explore_destinations"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4,
    )

    wikidata_id: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    name: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    country: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    country_code: Mapped[str] = mapped_column(
        String(3),
        nullable=False,
    )

    latitude: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    longitude: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    source: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="wikidata",
    )

    country_source: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="natural_earth",
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    description_source: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    image_url: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    image_source: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    image_file: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    image_page_url: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    image_artist: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    image_license: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    image_license_url: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    categories: Mapped[list["ExploreCategory"]] = relationship(
        "ExploreCategory",
        secondary=explore_destination_categories,
        back_populates="destinations",
        lazy="selectin",
    )

    __table_args__ = (
        UniqueConstraint(
            "wikidata_id",
            name="uq_explore_destinations_wikidata_id",
        ),
        Index(
            "ix_explore_destinations_country_code",
            "country_code",
        ),
    )