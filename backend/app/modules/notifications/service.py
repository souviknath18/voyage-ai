
import uuid
from datetime import datetime, timezone
from urllib.parse import urlsplit

from app.modules.notifications.models import Notification

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.dialects.postgresql import insert

from app.modules.notifications import repository
from app.modules.notifications.schemas import (
  NotificationListResponse,
  NotificationMarkAllReadResponse,
  NotificationResponse,
  NotificationUnreadCountResponse,
)


async def list_user_notifications(
  db: AsyncSession,
  user_id: uuid.UUID,
  limit: int = 20,
  offset: int = 0,
  unread_only: bool = False,
) -> NotificationListResponse:
  if not 1 <= limit <= 100:
    raise HTTPException(
      status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
      detail="Limit must be between 1 and 100.",
    )

  if offset < 0:
    raise HTTPException(
      status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
      detail="Offset cannot be negative.",
    )

  notifications = await repository.get_notifications(
    db=db,
    user_id=user_id,
    limit=limit,
    offset=offset,
    unread_only=unread_only,
  )

  total = await repository.count_notifications(
    db=db,
    user_id=user_id,
    unread_only=unread_only,
  )

  unread_count = await repository.count_notifications(
    db=db,
    user_id=user_id,
    unread_only=True,
  )

  return NotificationListResponse(
    items=[
      NotificationResponse.model_validate(notification)
      for notification in notifications
    ],
    total=total,
    unread_count=unread_count,
    limit=limit,
    offset=offset,
  )


async def get_user_unread_count(
  db: AsyncSession,
  user_id: uuid.UUID,
) -> NotificationUnreadCountResponse:
  unread_count = await repository.count_notifications(
    db=db,
    user_id=user_id,
    unread_only=True,
  )

  return NotificationUnreadCountResponse(
    unread_count=unread_count,
  )


async def mark_user_notification_read(
  db: AsyncSession,
  notification_id: uuid.UUID,
  user_id: uuid.UUID,
) -> NotificationResponse:
  notification = await repository.mark_notification_read(
    db=db,
    notification_id=notification_id,
    user_id=user_id,
  )

  if notification is None:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND,
      detail="Notification not found.",
    )

  await db.commit()

  await db.refresh(notification)

  return NotificationResponse.model_validate(notification)


async def mark_all_user_notifications_read(
  db: AsyncSession,
  user_id: uuid.UUID,
) -> NotificationMarkAllReadResponse:
  updated_count = await repository.mark_all_notifications_read(
    db=db,
    user_id=user_id,
  )

  await db.commit()

  return NotificationMarkAllReadResponse(
    updated_count=updated_count,
  )


async def create_user_notification(
  db: AsyncSession,
  user_id: uuid.UUID,
  notification_type: str,
  title: str,
  message: str,
  action_url: str | None = None,
  event_key: str | None = None,
) -> NotificationResponse | None:
  notification_type = notification_type.strip()
  title = title.strip()
  message = message.strip()

  if not notification_type or len(notification_type) > 50:
    raise ValueError("Invalid notification type.")

  if not title or len(title) > 255:
    raise ValueError("Invalid notification title.")

  if not message:
    raise ValueError("Notification message cannot be empty.")

  if event_key is not None:
    event_key = event_key.strip()

    if not event_key or len(event_key) > 255:
      raise ValueError("Invalid notification event key.")

  if action_url is not None:
    action_url = action_url.strip()

    if (
      not action_url.startswith("/")
      or action_url.startswith("//")
      or "\\" in action_url
      or len(action_url) > 500
    ):
      raise ValueError("Invalid notification action URL.")

    parsed_url = urlsplit(action_url)

    if parsed_url.scheme or parsed_url.netloc:
      raise ValueError("Notification URL must be internal.")

  statement = (
    insert(Notification)
    .values(
      id=uuid.uuid4(),
      user_id=user_id,
      type=notification_type,
      event_key=event_key,
      title=title,
      message=message,
      action_url=action_url,
      is_read=False,
    )
    .on_conflict_do_nothing(
      constraint="uq_notifications_user_event_key",
    )
    .returning(Notification)
  )

  result = await db.execute(statement)

  notification = result.scalar_one_or_none()

  if notification is None:
    # The event was already processed.
    return None

  return NotificationResponse.model_validate(notification)