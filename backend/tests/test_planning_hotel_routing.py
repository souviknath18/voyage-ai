import pytest

from app.ai.planning.graph import (
    build_planning_graph,
)


@pytest.mark.asyncio
@pytest.mark.parametrize(
  "mode, expected_hotel_calls",
  [
    ("planning", 1),
    ("optimization", 0),
  ],
)
async def test_hotel_node_routing(
  mode,
  expected_hotel_calls,
):
  hotel_calls = []

  async def mock_load_context(state):
    return {
      "recommended_hotel": None,
      "validation_errors": [],
      "replan_count": 0,
    }

  async def mock_research(state):
    return {}

  async def mock_flight(state):
    return {"recommended_flight": None}

  async def mock_hotel(state):
    hotel_calls.append(True)
    return {
      "recommended_hotel": {
        "id": "hotel-123",
      }
    }

  async def mock_generate(state):
    return {"draft_itinerary": {}}

  async def mock_optimize(state):
    return {"draft_itinerary": {}}

  async def mock_validate(state):
    return {
      "validation_errors": [],
      "final_itinerary": {},
    }

  async def mock_replan(state):
    return {}

  async def mock_failed(state):
    return {"error": "failed"}

  graph = build_planning_graph(
    load_context_node=mock_load_context,
    research_trip_node=mock_research,
    recommend_flight_node=mock_flight,
    recommend_hotel_node=mock_hotel,
    generate_itinerary_node=mock_generate,
    optimize_itinerary_node=mock_optimize,
    validate_itinerary_node=mock_validate,
    replan_itinerary_node=mock_replan,
    planning_failed_node=mock_failed,
  )

  result = await graph.ainvoke({
    "mode": mode,
    "input_snapshot": {"trip": {}},
  })

  assert len(hotel_calls) == expected_hotel_calls

  if mode == "planning":
    assert result["recommended_hotel"]["id"] == "hotel-123"
  else:
    assert result["recommended_hotel"] is None