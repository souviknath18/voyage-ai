from unittest.mock import AsyncMock, patch

import pytest

from app.ai.planning.nodes.recommend_hotel import (
  recommend_hotel,
)


@pytest.fixture
def planning_state():
  return {
    "input_snapshot": {
      "trip": {
        "destination_latitude": -33.8688,
        "destination_longitude": 151.2093,
        "start_date": "2026-10-12",
        "end_date": "2026-10-14",
        "travelers": 2,
        "currency": "INR",
        "budget": "100000",
      }
    }
  }


@pytest.mark.asyncio
async def test_recommend_hotel_success(planning_state):
  search_result = {
    "recommended_hotel_id": "hotel-123",
    "offers": [
      {
        "id": "hotel-123",
        "name": "Sydney Test Hotel",
        "converted_price": 15000,
        "converted_currency": "INR",
      }
    ],
  }

  with patch(
    "app.ai.planning.nodes.recommend_hotel.search_and_rank_hotels",
    new_callable=AsyncMock,
    return_value=search_result,
  ) as mock_search:
    result = await recommend_hotel(planning_state)

  hotel = result["recommended_hotel"]

  assert hotel is not None
  assert hotel["id"] == "hotel-123"
  assert hotel["provider"] == "liteapi"
  assert hotel["recommended_at"]

  mock_search.assert_awaited_once()


@pytest.mark.asyncio
async def test_recommend_hotel_no_offers(planning_state):
  with patch(
    "app.ai.planning.nodes.recommend_hotel.search_and_rank_hotels",
    new_callable=AsyncMock,
    return_value={
      "recommended_hotel_id": None,
      "offers": [],
    },
  ):
    result = await recommend_hotel(planning_state)

  assert result["recommended_hotel"] is None


@pytest.mark.asyncio
async def test_recommend_hotel_provider_failure(planning_state):
  with patch(
    "app.ai.planning.nodes.recommend_hotel.search_and_rank_hotels",
    new_callable=AsyncMock,
    side_effect=RuntimeError("Provider unavailable"),
  ):
    result = await recommend_hotel(planning_state)

  assert result["recommended_hotel"] is None