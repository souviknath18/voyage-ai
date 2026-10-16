
import uuid
from datetime import datetime, timezone
from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock

import pytest

from app.modules.notifications.service import (
  create_user_notification,
)


@pytest.mark.asyncio
async def test_notification_creation_is_idempotent():
  user_id = uuid.uuid4()
  notification_id = uuid.uuid4()
  event_key = "itinerary_ready:test-run-123"

  notification = SimpleNamespace(
    id=notification_id,
    user_id=user_id,
    type="itinerary_ready",
    title="Your itinerary is ready",
    message="Your itinerary is ready to explore.",
    action_url="/trips/TRIP-TEST-001",
    is_read=False,
    created_at=datetime.now(timezone.utc),
    read_at=None,
  )

  first_result = MagicMock()
  first_result.scalar_one_or_none.return_value = notification

  duplicate_result = MagicMock()
  duplicate_result.scalar_one_or_none.return_value = None

  db = AsyncMock()
  db.execute.side_effect = [
    first_result,
    duplicate_result,
  ]

  payload = {
    "db": db,
    "user_id": user_id,
    "notification_type": "itinerary_ready",
    "title": "Your itinerary is ready",
    "message": "Your itinerary is ready to explore.",
    "action_url": "/trips/TRIP-TEST-001",
    "event_key": event_key,
  }

  first = await create_user_notification(**payload)
  second = await create_user_notification(**payload)

  assert first is not None
  assert first.id == notification_id

  assert second is None

  assert db.execute.await_count == 2

  for call in db.execute.await_args_list:
    statement = call.args[0]
    compiled = statement.compile()

    sql = str(compiled).upper()

    assert "ON CONFLICT" in sql
    assert "DO NOTHING" in sql
    assert "UQ_NOTIFICATIONS_USER_EVENT_KEY" in sql