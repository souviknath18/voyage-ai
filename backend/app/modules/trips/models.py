import uuid
from datetime import date, datetime
from decimal import Decimal

from sqlalchemy import (
  Date,
  DateTime,
  ForeignKey,
  Integer,
  Numeric,
  String,
  func,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Trip(Base):
  __tablename__ = "trips"

  id: Mapped[uuid.UUID] = mapped_column(
    UUID(as_uuid=True),
    primary_key=True,
    default=uuid.uuid4,
  )

  trip_id: Mapped[str] = mapped_column(
    String(40),
    unique=True,
    nullable=False,
    index=True,
  )

  user_id: Mapped[uuid.UUID] = mapped_column(
    UUID(as_uuid=True),
    ForeignKey(
        "users.id",
        ondelete="CASCADE",
    ),
    nullable=False,
    index=True,
  )

  origin: Mapped[str] = mapped_column(
    String(255),
    nullable=False,
  )

  destination: Mapped[str] = mapped_column(
    String(255),
    nullable=False,
  )

  start_date: Mapped[date] = mapped_column(
    Date,
    nullable=False,
  )

  end_date: Mapped[date] = mapped_column(
    Date,
    nullable=False,
  )

  travelers: Mapped[int] = mapped_column(
    Integer,
    nullable=False,
    default=1,
  )

  budget: Mapped[Decimal | None] = mapped_column(
    Numeric(12, 2),
    nullable=True,
  )

  currency: Mapped[str] = mapped_column(
    String(3),
    nullable=False,
    default="INR",
  )

  status: Mapped[str] = mapped_column(
    String(50),
    nullable=False,
    default="draft",
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

  destination_name: Mapped[str | None] = mapped_column(
    String(255),
    nullable=True,
  )

  destination_country: Mapped[str | None] = mapped_column(
    String(100),
    nullable=True,
  )

  destination_country_code: Mapped[str | None] = mapped_column(
    String(10),
    nullable=True,
  )

  destination_latitude: Mapped[Decimal | None] = mapped_column(
    Numeric(9, 6),
    nullable=True,
  )

  destination_longitude: Mapped[Decimal | None] = mapped_column(
    Numeric(9, 6),
    nullable=True,
  )

  destination_timezone: Mapped[str | None] = mapped_column(
    String(100),
    nullable=True,
  )