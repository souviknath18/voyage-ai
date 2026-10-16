
import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class NotificationResponse(BaseModel):
  model_config = ConfigDict(from_attributes=True)

  id: uuid.UUID
  user_id: uuid.UUID

  type: str
  title: str
  message: str

  action_url: str | None = None

  is_read: bool
  created_at: datetime
  read_at: datetime | None = None


class NotificationListResponse(BaseModel):
  items: list[NotificationResponse] = Field(
    default_factory=list,
  )

  total: int = Field(ge=0)
  unread_count: int = Field(ge=0)

  limit: int = Field(ge=1)
  offset: int = Field(ge=0)


class NotificationUnreadCountResponse(BaseModel):
  unread_count: int = Field(ge=0)


class NotificationMarkAllReadResponse(BaseModel):
  updated_count: int = Field(ge=0)