
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


class SelectedHotel(Base):
  __tablename__ = "selected_hotels"

  id: Mapped[uuid.UUID] = mapped_column(
    UUID(as_uuid=True),
    primary_key=True,
    default=uuid.uuid4,
  )

  trip_id: Mapped[uuid.UUID] = mapped_column(
    UUID(as_uuid=True),
    ForeignKey("trips.id", ondelete="CASCADE"),
    unique=True,
    nullable=False,
    index=True,
  )

  provider: Mapped[str] = mapped_column(
    String(50),
    nullable=False,
    default="liteapi",
  )

  # LiteAPI rate IDs can be much longer than 255 chars.
  provider_offer_id: Mapped[str] = mapped_column(
    String,
    nullable=False,
  )

  hotel_id: Mapped[str] = mapped_column(
    String(255),
    nullable=False,
  )

  hotel_name: Mapped[str] = mapped_column(
    String(255),
    nullable=False,
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

  # Complete hotel and room snapshot.
  hotel_snapshot: Mapped[dict] = mapped_column(
    JSONB,
    nullable=False,
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