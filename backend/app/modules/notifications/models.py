import uuid
from datetime import datetime

from sqlalchemy import (
  Boolean,
  DateTime,
  ForeignKey,
  Index,
  String,
  Text,
  func,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import UniqueConstraint

from app.db.base import Base


class Notification(Base):
  __tablename__ = "notifications"

  
  __table_args__ = (
    Index(
      "ix_notifications_user_created_at",
      "user_id",
      "created_at",
    ),
    Index(
      "ix_notifications_user_is_read",
      "user_id",
      "is_read",
    ),
    UniqueConstraint(
      "user_id",
      "event_key",
      name="uq_notifications_user_event_key",
    ),
  )


  id: Mapped[uuid.UUID] = mapped_column(
    UUID(as_uuid=True),
    primary_key=True,
    default=uuid.uuid4,
  )

  user_id: Mapped[uuid.UUID] = mapped_column(
    UUID(as_uuid=True),
    ForeignKey("users.id", ondelete="CASCADE"),
    nullable=False,
  )

  type: Mapped[str] = mapped_column(
    String(50),
    nullable=False,
  )

  event_key: Mapped[str | None] = mapped_column(
    String(255),
    nullable=True,
  )

  title: Mapped[str] = mapped_column(
    String(255),
    nullable=False,
  )

  message: Mapped[str] = mapped_column(
    Text,
    nullable=False,
  )

  action_url: Mapped[str | None] = mapped_column(
    String(500),
    nullable=True,
  )

  is_read: Mapped[bool] = mapped_column(
    Boolean,
    nullable=False,
    default=False,
    server_default="false",
  )

  created_at: Mapped[datetime] = mapped_column(
    DateTime(timezone=True),
    nullable=False,
    server_default=func.now(),
  )

  read_at: Mapped[datetime | None] = mapped_column(
    DateTime(timezone=True),
    nullable=True,
  )