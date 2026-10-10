from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock
from uuid import uuid4

import pytest

from app.modules.hotels import recommendation_service


@pytest.mark.asyncio
async def test_no_recommended_hotel():
  trip_id = uuid4()
  user_id = uuid4()

  db = MagicMock()
  result = MagicMock()
  result.scalar_one_or_none.return_value = None
  db.execute = AsyncMock(return_value=result)

  original = recommendation_service.get_user_trip

  async def mock_get_user_trip(**kwargs):
    return SimpleNamespace(id=trip_id)

  recommendation_service.get_user_trip = mock_get_user_trip

  try:
    response = await (
      recommendation_service.get_trip_recommended_hotel(
        db=db,
        trip_id="TRIP-TEST-001",
        user_id=user_id,
    )
    )

    assert response is None
    db.execute.assert_awaited_once()
  finally:
    recommendation_service.get_user_trip = original


@pytest.mark.asyncio
async def test_recommendation_lookup_checks_trip_ownership():
  db = MagicMock()
  db.execute = AsyncMock()

  original = recommendation_service.get_user_trip

  async def mock_get_user_trip(**kwargs):
    raise PermissionError("Trip not accessible")

  recommendation_service.get_user_trip = mock_get_user_trip

  try:
    with pytest.raises(PermissionError):
      await recommendation_service.get_trip_recommended_hotel(
        db=db,
        trip_id="TRIP-OTHER-USER",
        user_id=uuid4(),
      )

    db.execute.assert_not_awaited()
  finally:
    recommendation_service.get_user_trip = original


@pytest.mark.asyncio
async def test_get_recommended_hotel_success(monkeypatch):
  from datetime import date, datetime, timezone
  from decimal import Decimal

  trip_id = uuid4()
  user_id = uuid4()
  agent_run_id = uuid4()

  recommended_at = datetime(
    2026, 10, 10, 8, 30,
    tzinfo=timezone.utc,
  )

  hotel_snapshot = {
    "id": "offer-123",
    "hotel_id": "hotel-456",
    "name": "Sydney Harbour Hotel",
    "address": "Sydney, Australia",
    "latitude": -33.8688,
    "longitude": 151.2093,
    "rating": 4.7,
    "star_rating": 5.0,
    "image_url": None,
    "amenities": ["WiFi", "Pool"],
    "room": {
      "id": "room-789",
      "name": "Deluxe Room",
      "refundable": True,
    },
    "check_in": "2026-11-10",
    "check_out": "2026-11-15",
    "nights": 5,
    "total_price": "500.00",
    "currency": "USD",
    "price_per_night": "100.00",
    "converted_price": "42000.00",
    "converted_price_per_night": "8400.00",
    "converted_currency": "INR",
    "exchange_rate": "84.00",
    "rank": 1,
    "ranking_score": 95.5,
    "within_hotel_budget": True,
    "provider": "liteapi",
    "recommended_at": recommended_at.isoformat(),
  }

  async def mock_get_user_trip(**kwargs):
    return SimpleNamespace(id=trip_id)

  monkeypatch.setattr(
    recommendation_service,
    "get_user_trip",
    mock_get_user_trip,
  )

  agent_run = SimpleNamespace(
    id=agent_run_id,
    trip_id=trip_id,
    status="completed",
    recommended_hotel=hotel_snapshot,
  )

  db = MagicMock()

  query_result = MagicMock()
  query_result.scalar_one_or_none.return_value = agent_run

  db.execute = AsyncMock(return_value=query_result)

  response = await (
    recommendation_service.get_trip_recommended_hotel(
      db=db,
      trip_id="TRIP-TEST-001",
      user_id=user_id,
    )
  )

  assert response is not None
  assert response.agent_run_id == agent_run_id

  hotel = response.recommended_hotel

  assert hotel.id == "offer-123"
  assert hotel.hotel_id == "hotel-456"
  assert hotel.name == "Sydney Harbour Hotel"

  assert hotel.total_price == Decimal("500.00")
  assert hotel.converted_price == Decimal("42000.00")
  assert hotel.converted_currency == "INR"

  assert hotel.rank == 1
  assert hotel.room.name == "Deluxe Room"

  assert response.recommended_at == recommended_at

  db.execute.assert_awaited_once()