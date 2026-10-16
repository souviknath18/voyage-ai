
import uuid
from datetime import datetime, timezone

from sqlalchemy import func, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.notifications.models import Notification


async def get_notifications(
  db: AsyncSession,
  user_id: uuid.UUID,
  limit: int = 20,
  offset: int = 0,
  unread_only: bool = False,
) -> list[Notification]:
  statement = select(Notification).where(
    Notification.user_id == user_id
  )

  if unread_only:
    statement = statement.where(
      Notification.is_read.is_(False)
    )

  statement = (
    statement
    .order_by(
      Notification.created_at.desc(),
      Notification.id.desc(),
    )
    .limit(limit)
    .offset(offset)
  )

  result = await db.execute(statement)

  return list(result.scalars().all())


async def count_notifications(
  db: AsyncSession,
  user_id: uuid.UUID,
  unread_only: bool = False,
) -> int:
  statement = (
    select(func.count())
    .select_from(Notification)
    .where(Notification.user_id == user_id)
  )

  if unread_only:
    statement = statement.where(
      Notification.is_read.is_(False)
    )

  result = await db.execute(statement)

  return result.scalar_one()


async def get_notification_by_id(
  db: AsyncSession,
  notification_id: uuid.UUID,
  user_id: uuid.UUID,
) -> Notification | None:
  statement = select(Notification).where(
    Notification.id == notification_id,
    Notification.user_id == user_id,
  )

  result = await db.execute(statement)

  return result.scalar_one_or_none()


async def mark_notification_read(
  db: AsyncSession,
  notification_id: uuid.UUID,
  user_id: uuid.UUID,
) -> Notification | None:
  statement = (
    update(Notification)
    .where(
      Notification.id == notification_id,
      Notification.user_id == user_id,
      Notification.is_read.is_(False),
    )
    .values(
      is_read=True,
      read_at=datetime.now(timezone.utc),
    )
    .returning(Notification.id)
  )

  await db.execute(statement)

  await db.flush()

  return await get_notification_by_id(
    db=db,
    notification_id=notification_id,
    user_id=user_id,
  )


async def mark_all_notifications_read(
  db: AsyncSession,
  user_id: uuid.UUID,
) -> int:
  statement = (
    update(Notification)
    .where(
      Notification.user_id == user_id,
      Notification.is_read.is_(False),
    )
    .values(
      is_read=True,
      read_at=datetime.now(timezone.utc),
    )
  )

  result = await db.execute(statement)

  await db.flush()

  return result.rowcount or 0