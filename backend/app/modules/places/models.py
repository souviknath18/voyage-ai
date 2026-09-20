import uuid

from datetime import datetime
from decimal import Decimal

from sqlalchemy import (
  DateTime,
  ForeignKey,
  Numeric,
  String,
  UniqueConstraint,
  func,
)
from sqlalchemy.dialects.postgresql import (
  ARRAY,
  UUID,
)
from sqlalchemy.orm import (
  Mapped,
  mapped_column,
)

from app.db.base import Base


class TripPlace(Base):
  __tablename__ = "trip_places"

  __table_args__ = (
    UniqueConstraint(
      "trip_id",
      "provider",
      "provider_place_id",
      name=(
        "uq_trip_places_"
        "trip_provider_place"
      ),
    ),
  )

  id: Mapped[uuid.UUID] = mapped_column(
    UUID(as_uuid=True),
    primary_key=True,
    default=uuid.uuid4,
  )

  trip_id: Mapped[uuid.UUID] = mapped_column(
    UUID(as_uuid=True),
    ForeignKey(
      "trips.id",
      ondelete="CASCADE",
    ),
    nullable=False,
    index=True,
  )

  provider: Mapped[str] = mapped_column(
    String(50),
    nullable=False,
  )

  provider_place_id: Mapped[str] = mapped_column(
    String(255),
    nullable=False,
  )

  name: Mapped[str] = mapped_column(
    String(255),
    nullable=False,
  )

  categories: Mapped[list[str]] = mapped_column(
    ARRAY(String),
    nullable=False,
    default=list,
  )

  address: Mapped[str | None] = mapped_column(
    String(500),
    nullable=True,
  )

  latitude: Mapped[Decimal] = mapped_column(
    Numeric(9, 6),
    nullable=False,
  )

  longitude: Mapped[Decimal] = mapped_column(
    Numeric(9, 6),
    nullable=False,
  )

  distance: Mapped[Decimal | None] = mapped_column(
    Numeric(12, 2),
    nullable=True,
  )

  search_group: Mapped[str | None] = mapped_column(
    String(50),
    nullable=True,
  )

  created_at: Mapped[datetime] = mapped_column(
    DateTime(timezone=True),
    server_default=func.now(),
    nullable=False,
  )