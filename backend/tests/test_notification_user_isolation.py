
import uuid
from unittest.mock import AsyncMock, MagicMock

import pytest

from app.modules.notifications.repository import (
  get_notification_by_id,
  get_notifications,
  mark_all_notifications_read,
  mark_notification_read,
)


@pytest.mark.asyncio
async def test_user_cannot_fetch_another_users_notification():
  user_a = uuid.uuid4()
  notification_id = uuid.uuid4()

  db = AsyncMock()
  result = MagicMock()
  result.scalar_one_or_none.return_value = None
  db.execute.return_value = result

  notification = await get_notification_by_id(
    db=db,
    notification_id=notification_id,
    user_id=user_a,
  )

  assert notification is None

  statement = db.execute.await_args.args[0]
  sql = str(statement)

  assert "notifications.user_id" in sql
  assert "notifications.id" in sql


@pytest.mark.asyncio
async def test_notification_list_is_scoped_to_user():
  user_a = uuid.uuid4()

  db = AsyncMock()
  result = MagicMock()
  result.scalars.return_value.all.return_value = []
  db.execute.return_value = result

  notifications = await get_notifications(
    db=db,
    user_id=user_a,
    limit=20,
    offset=0,
  )

  assert notifications == []

  statement = db.execute.await_args.args[0]
  sql = str(statement)

  assert "notifications.user_id" in sql


@pytest.mark.asyncio
async def test_user_cannot_mark_another_users_notification_read():
  user_a = uuid.uuid4()
  notification_id = uuid.uuid4()

  db = AsyncMock()
  result = MagicMock()
  result.scalar_one_or_none.return_value = None
  db.execute.return_value = result

  notification = await mark_notification_read(
    db=db,
    notification_id=notification_id,
    user_id=user_a,
  )

  assert notification is None

  statement = db.execute.await_args.args[0]
  sql = str(statement)

  assert "notifications.user_id" in sql
  assert "notifications.id" in sql


@pytest.mark.asyncio
async def test_mark_all_read_only_updates_current_user():
  user_a = uuid.uuid4()

  db = AsyncMock()
  result = MagicMock()
  result.rowcount = 0
  db.execute.return_value = result

  await mark_all_notifications_read(
    db=db,
    user_id=user_a,
  )

  statement = db.execute.await_args.args[0]
  sql = str(statement)

  assert "notifications.user_id" in sql
  assert "UPDATE NOTIFICATIONS" in sql.upper()