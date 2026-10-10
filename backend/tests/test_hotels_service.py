from datetime import date
from decimal import Decimal
from types import SimpleNamespace
from unittest.mock import AsyncMock, patch

import pytest

from app.modules.hotels.service import get_trip_hotels


@pytest.mark.asyncio
async def test_get_trip_hotels_uses_shared_search():
  trip = SimpleNamespace(
    trip_id="TRIP-TEST-001",
    destination="Sydney, Australia",
    destination_latitude=-33.8688,
    destination_longitude=151.2093,
    start_date=date(2026, 10, 12),
    end_date=date(2026, 10, 14),
    travelers=2,
    currency="INR",
    budget=Decimal("100000"),
  )

  search_result = {
    "currency": "INR",
    "hotel_budget": Decimal("30000"),
    "recommended_hotel_id": "hotel-123",
    "offers": [{"id": "hotel-123"}],
  }

  with (
    patch(
      "app.modules.hotels.service.get_user_trip",
      new_callable=AsyncMock,
      return_value=trip,
    ),
    patch(
      "app.modules.hotels.service.search_and_rank_hotels",
      new_callable=AsyncMock,
      return_value=search_result,
    ) as mock_search,
  ):
    result = await get_trip_hotels(
      db=None,
      public_trip_id="TRIP-TEST-001",
      user_id="test-user",
    )

  assert result["trip_id"] == "TRIP-TEST-001"
  assert result["recommended_hotel_id"] == "hotel-123"
  assert result["offers"] == [{"id": "hotel-123"}]

  mock_search.assert_awaited_once_with(
    latitude=-33.8688,
    longitude=151.2093,
    check_in=date(2026, 10, 12),
    check_out=date(2026, 10, 14),
    travelers=2,
    currency="INR",
    budget=Decimal("100000"),
  )