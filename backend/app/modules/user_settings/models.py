
import uuid
from datetime import datetime

from sqlalchemy import (
  Boolean,
  DateTime,
  ForeignKey,
  String,
  func,
)
from sqlalchemy.dialects.postgresql import ARRAY, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class UserSettings(Base):
  __tablename__ = "user_settings"

  # One settings record per user.
  user_id: Mapped[uuid.UUID] = mapped_column(
    UUID(as_uuid=True),
    ForeignKey("users.id", ondelete="CASCADE"),
    primary_key=True,
  )

  # Profile preferences
  phone: Mapped[str | None] = mapped_column(
    String(30),
    nullable=True,
  )

  home_city: Mapped[str | None] = mapped_column(
    String(255),
    nullable=True,
  )

  preferred_airport: Mapped[str | None] = mapped_column(
    String(255),
    nullable=True,
  )

  # Localization
  currency: Mapped[str] = mapped_column(
    String(3),
    nullable=False,
    default="INR",
  )

  region: Mapped[str] = mapped_column(
    String(10),
    nullable=False,
    default="IN",
  )

  # Account-wide travel preferences
  travel_pace: Mapped[str] = mapped_column(
    String(20),
    nullable=False,
    default="balanced",
  )

  accommodation_preferences: Mapped[list[str]] = mapped_column(
    ARRAY(String(30)),
    nullable=False,
    default=list,
  )

  dietary_requirement: Mapped[str] = mapped_column(
    String(100),
    nullable=False,
    default="none",
  )

  # Notifications
  email_notifications: Mapped[bool] = mapped_column(
    Boolean,
    nullable=False,
    default=True,
  )

  trip_updates: Mapped[bool] = mapped_column(
    Boolean,
    nullable=False,
    default=True,
  )

  price_alerts: Mapped[bool] = mapped_column(
    Boolean,
    nullable=False,
    default=True,
  )

  weather_alerts: Mapped[bool] = mapped_column(
    Boolean,
    nullable=False,
    default=True,
  )

  ai_activity_alerts: Mapped[bool] = mapped_column(
    Boolean,
    nullable=False,
    default=True,
  )

  marketing_emails: Mapped[bool] = mapped_column(
    Boolean,
    nullable=False,
    default=False,
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