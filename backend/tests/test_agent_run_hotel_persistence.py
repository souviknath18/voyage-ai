from unittest.mock import AsyncMock, MagicMock

import pytest

from app.modules.agent_runs.repository import (
  mark_agent_run_completed,
)


@pytest.mark.asyncio
async def test_completed_run_flushes_recommended_hotel():
  db = MagicMock()
  db.flush = AsyncMock()
  db.commit = AsyncMock()
  db.refresh = AsyncMock()

  agent_run = MagicMock()
  agent_run.recommended_hotel = {
    "id": "hotel-123",
    "name": "Test Hotel",
    "provider": "liteapi",
  }

  result = await mark_agent_run_completed(
    db=db,
    agent_run=agent_run,
    commit=False,
  )

  assert result.recommended_hotel["id"] == "hotel-123"
  assert result.status == "completed"
  assert result.current_step == "completed"

  db.flush.assert_awaited_once()
  db.commit.assert_not_awaited()
  db.refresh.assert_not_awaited()