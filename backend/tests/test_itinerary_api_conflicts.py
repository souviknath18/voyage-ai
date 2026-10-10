import uuid

from datetime import date, datetime, timezone
from decimal import Decimal
from types import SimpleNamespace
from unittest.mock import AsyncMock

from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.modules.itineraries.router import (
  router,
  get_db,
  get_current_user,
  get_trip_itinerary,
)


def test_itinerary_api_returns_overlap_warning():
  now = datetime.now(timezone.utc)

  activities = [
    SimpleNamespace(
      id=uuid.uuid4(),
      time="9:00 AM",
      duration_minutes=180,
      title="Museum Visit",
      description="Explore the museum.",
      location=None,
      activity_type="generic",
      cost_category="activity",
      place_id=None,
      estimated_cost=Decimal("500"),
    ),
    SimpleNamespace(
      id=uuid.uuid4(),
      time="11:00 AM",
      duration_minutes=60,
      title="Lunch",
      description="Have lunch.",
      location=None,
      activity_type="generic",
      cost_category="food",
      place_id=None,
      estimated_cost=Decimal("1000"),
    ),
  ]

  itinerary = SimpleNamespace(
    id=uuid.uuid4(),
    trip_id=uuid.uuid4(),
    agent_run_id=uuid.uuid4(),
    destination="Sydney",
    summary="Test itinerary",
    currency="INR",
    estimated_total_cost=Decimal("1500"),
    days=[
      SimpleNamespace(
        id=uuid.uuid4(),
        day_number=1,
        date=date(2026, 10, 12),
        title="Day 1",
        activities=activities,
      )
    ],
    created_at=now,
    updated_at=now,
    version=1,
  )

  app = FastAPI()
  app.include_router(router)

  app.dependency_overrides[get_db] = (
    lambda: None
  )

  app.dependency_overrides[get_current_user] = (
    lambda: SimpleNamespace(id=uuid.uuid4())
  )

  mock_service = AsyncMock(
    return_value=itinerary
  )

  with __import__(
    "unittest.mock",
    fromlist=["patch"],
  ).patch(
    "app.modules.itineraries.router.get_trip_itinerary",
    mock_service,
  ):
    client = TestClient(app)

    response = client.get(
      "/TEST-TRIP-001/itinerary"
    )

  assert response.status_code == 200

  data = response.json()

  assert data["days"][0]["activities"][0][
    "duration_minutes"
  ] == 180

  assert data["validation_warnings"] == [
    "Day 1: 'Museum Visit' overlaps with "
    "'Lunch' by 60 minutes."
  ]

  mock_service.assert_awaited_once()