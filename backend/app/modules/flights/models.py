import uuid
from datetime import datetime
from decimal import Decimal

from sqlalchemy import (
  DateTime,
  ForeignKey,
  Numeric,
  String,
  func,
)
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class SelectedFlight(Base):
  __tablename__ = "selected_flights"

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
    unique=True,
    nullable=False,
    index=True,
  )

  provider: Mapped[str] = mapped_column(
    String(50),
    nullable=False,
    default="duffel",
  )

  provider_offer_id: Mapped[str] = mapped_column(
    String(255),
    nullable=False,
  )

  airline: Mapped[str] = mapped_column(
    String(255),
    nullable=False,
  )

  airline_code: Mapped[str | None] = mapped_column(
    String(20),
    nullable=True,
  )

  original_price: Mapped[Decimal] = mapped_column(
    Numeric(12, 2),
    nullable=False,
  )

  original_currency: Mapped[str] = mapped_column(
    String(3),
    nullable=False,
  )

  converted_price: Mapped[Decimal] = mapped_column(
    Numeric(12, 2),
    nullable=False,
  )

  converted_currency: Mapped[str] = mapped_column(
    String(3),
    nullable=False,
  )

  exchange_rate: Mapped[Decimal] = mapped_column(
    Numeric(18, 8),
    nullable=False,
  )

  outbound: Mapped[dict] = mapped_column(
    JSONB,
    nullable=False,
  )

  return_flight: Mapped[dict | None] = mapped_column(
    JSONB,
    nullable=True,
  )

  baggage: Mapped[str | None] = mapped_column(
    String(255),
    nullable=True,
  )

  expires_at: Mapped[str | None] = mapped_column(
    String(100),
    nullable=True,
  )

  selected_at: Mapped[datetime] = mapped_column(
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