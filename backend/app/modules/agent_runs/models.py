import uuid
from datetime import datetime

from sqlalchemy import (
  DateTime,
  ForeignKey,
  Integer,
  String,
  Text,
  func,
)
from sqlalchemy.dialects.postgresql import (
  JSONB,
  UUID,
)
from sqlalchemy.orm import (
  Mapped,
  mapped_column,
)

from app.db.base import Base


class AgentRun(Base):
  __tablename__ = "agent_runs"

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

  status: Mapped[str] = mapped_column(
    String(30),
    nullable=False,
    default="pending",
    index=True,
  )

  current_step: Mapped[str | None] = mapped_column(
    String(100),
    nullable=True,
  )

  attempt: Mapped[int] = mapped_column(
    Integer,
    nullable=False,
    default=1,
  )

  input_snapshot: Mapped[dict | None] = mapped_column(
    JSONB,
    nullable=True,
  )

  error_message: Mapped[str | None] = mapped_column(
    Text,
    nullable=True,
  )

  started_at: Mapped[datetime | None] = mapped_column(
    DateTime(timezone=True),
    nullable=True,
  )

  completed_at: Mapped[datetime | None] = mapped_column(
    DateTime(timezone=True),
    nullable=True,
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