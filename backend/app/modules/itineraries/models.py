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
  Text,
  func,
)

from sqlalchemy.dialects.postgresql import UUID

from sqlalchemy.orm import (
  Mapped,
  mapped_column,
  relationship,
)

from app.db.base import Base


class Itinerary(Base):
  __tablename__ = "itineraries"

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
    unique=True,
    index=True,
  )

  agent_run_id: Mapped[uuid.UUID] = mapped_column(
    UUID(as_uuid=True),
    ForeignKey(
      "agent_runs.id",
      ondelete="CASCADE",
    ),
    nullable=False,
    index=True,
  )

  days: Mapped[list["ItineraryDay"]] = relationship(
    back_populates="itinerary",
    cascade="all, delete-orphan",
    order_by="ItineraryDay.day_number",
  )

  destination: Mapped[str] = mapped_column(
    String(255),
    nullable=False,
  )

  summary: Mapped[str] = mapped_column(
    Text,
    nullable=False,
  )

  currency: Mapped[str] = mapped_column(
    String(3),
    nullable=False,
  )

  estimated_total_cost: Mapped[Decimal] = mapped_column(
    Numeric(12, 2),
    nullable=False,
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


class ItineraryDay(Base):
  __tablename__ = "itinerary_days"

  id: Mapped[uuid.UUID] = mapped_column(
    UUID(as_uuid=True),
    primary_key=True,
    default=uuid.uuid4,
  )

  itinerary_id: Mapped[uuid.UUID] = mapped_column(
    UUID(as_uuid=True),
    ForeignKey(
      "itineraries.id",
      ondelete="CASCADE",
    ),
    nullable=False,
    index=True,
  )

  itinerary: Mapped["Itinerary"] = relationship(
    back_populates="days",
  )

  activities: Mapped[list["ItineraryItem"]] = relationship(
    back_populates="itinerary_day",
    cascade="all, delete-orphan",
    order_by="ItineraryItem.sort_order",
  )

  day_number: Mapped[int] = mapped_column(
    Integer,
    nullable=False,
  )

  date: Mapped[date] = mapped_column(
    Date,
    nullable=False,
  )

  title: Mapped[str] = mapped_column(
    String(255),
    nullable=False,
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


class ItineraryItem(Base):
  __tablename__ = "itinerary_items"

  id: Mapped[uuid.UUID] = mapped_column(
    UUID(as_uuid=True),
    primary_key=True,
    default=uuid.uuid4,
  )

  itinerary_day_id: Mapped[uuid.UUID] = mapped_column(
    UUID(as_uuid=True),
    ForeignKey(
      "itinerary_days.id",
      ondelete="CASCADE",
    ),
    nullable=False,
    index=True,
  )

  itinerary_day: Mapped["ItineraryDay"] = relationship(
    back_populates="activities",
  )

  sort_order: Mapped[int] = mapped_column(
    Integer,
    nullable=False,
  )

  time: Mapped[str] = mapped_column(
    String(20),
    nullable=False,
  )

  title: Mapped[str] = mapped_column(
    String(255),
    nullable=False,
  )

  description: Mapped[str] = mapped_column(
    Text,
    nullable=False,
  )

  location: Mapped[str | None] = mapped_column(
    String(255),
    nullable=True,
  )

  activity_type: Mapped[str] = mapped_column(
    String(30),
    nullable=False,
    default="generic",
  )

  cost_category: Mapped[str] = mapped_column(
    String(30),
    nullable=False,
  )

  place_id: Mapped[str | None] = mapped_column(
    String(255),
    nullable=True,
  )

  estimated_cost: Mapped[Decimal] = mapped_column(
    Numeric(12, 2),
    nullable=False,
    default=Decimal("0.00"),
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