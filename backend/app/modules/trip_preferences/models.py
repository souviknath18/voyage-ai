import uuid
from datetime import datetime

from sqlalchemy import (
  DateTime,
  ForeignKey,
  Integer,
  String,
  Text,
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


class TripPreference(Base):
  __tablename__ = "trip_preferences"

  __table_args__ = (
    UniqueConstraint(
      "trip_id",
      name="uq_trip_preferences_trip_id",
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

  pace: Mapped[str] = mapped_column(
    String(20),
    nullable=False,
    default="balanced",
  )

  interests: Mapped[list[str]] = mapped_column(
    ARRAY(String(100)),
    nullable=False,
    default=list,
  )

  ai_brief: Mapped[str | None] = mapped_column(
    Text,
    nullable=True,
  )

  budget_level: Mapped[int] = mapped_column(
    Integer,
    nullable=False,
    default=50,
  )

  created_at: Mapped[datetime] = mapped_column(
    DateTime(timezone=True),
    server_default=func.now(),
    nullable=False,
  )

  updated_at: Mapped[datetime] = mapped_column(
    DateTime(timezone=True),
    server_default=func.now(),
    onupdate=func.now(),
    nullable=False,
  )