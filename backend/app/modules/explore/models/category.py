"""
Database model for Explore destination categories.
"""

import uuid

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from .associations import explore_destination_categories


class ExploreCategory(Base):
    __tablename__ = "explore_categories"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4,
    )

    slug: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        unique=True,
    )

    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    destinations: Mapped[list["ExploreDestination"]] = relationship(
        "ExploreDestination",
        secondary=explore_destination_categories,
        back_populates="categories",
        lazy="selectin",
    )