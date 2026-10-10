from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi.encoders import jsonable_encoder

import traceback

from app.modules.trips.models import Trip
from app.ai.planning.graph import (
  build_planning_graph,
  load_context,
  planning_failed,
)
from app.ai.planning.nodes.generate_itinerary import (
  generate_itinerary,
)
from app.ai.planning.nodes.validate_itinerary import (
  validate_itinerary,
)
from app.ai.planning.nodes.replan_itinerary import (
  replan_itinerary,
)
from app.ai.planning.nodes.research_trip import (
  research_trip,
)
from app.ai.planning.tracking import (
  tracked_step,
)
from app.ai.planning.state import PlanningState
from app.modules.agent_runs.models import AgentRun
from app.modules.agent_runs.repository import (
  mark_agent_run_completed,
  mark_agent_run_failed,
  mark_agent_run_running,
)
from app.modules.itineraries.repository import (
  save_itinerary,
)
from app.modules.trips.repository import (
  update_trip_status,
)
from app.modules.places.repository import (
  replace_trip_places,
)
from app.modules.flights.repository import (
  save_selected_flight,
)
from app.ai.planning.nodes.optimize_itinerary import (
  optimize_itinerary,
)
from app.ai.planning.nodes.recommend_flight import (
  recommend_flight,
)
from app.ai.planning.nodes.recommend_hotel import (
  recommend_hotel,
)


async def execute_planning_graph(
  db: AsyncSession,
  agent_run: AgentRun,
) -> AgentRun:
  try:
    await mark_agent_run_running(
      db=db,
      agent_run=agent_run,
      current_step="load_context",
    )
    await db.commit()

    input_snapshot = (
      agent_run.input_snapshot or {}
    )

    initial_state: PlanningState = {
      "agent_run_id": agent_run.id,
      "input_snapshot": input_snapshot,

      "mode": input_snapshot.get(
        "mode",
        "planning",
      ),

      "base_itinerary": input_snapshot.get(
        "base_itinerary"
      ),

      "optimization_request": (
        input_snapshot.get(
          "optimization_request"
        )
      ),

      "research_results": {},
      "recommended_flight": None,
      "draft_itinerary": None,
      "validation_errors": [],
      "replan_count": 0,
      "final_itinerary": None,
      "error": None,
    }

    planning_graph = build_planning_graph(
      load_context_node=tracked_step(
        db=db,
        agent_run=agent_run,
        step_name="load_context",
        node=load_context,
      ),

      generate_itinerary_node=tracked_step(
        db=db,
        agent_run=agent_run,
        step_name="generate_itinerary",
        node=generate_itinerary,
      ),

      optimize_itinerary_node=tracked_step(
        db=db,
        agent_run=agent_run,
        step_name="optimize_itinerary",
        node=optimize_itinerary,
      ),

      validate_itinerary_node=tracked_step(
        db=db,
        agent_run=agent_run,
        step_name="validate_itinerary",
        node=validate_itinerary,
      ),

      replan_itinerary_node=tracked_step(
        db=db,
        agent_run=agent_run,
        step_name="replan_itinerary",
        node=replan_itinerary,
      ),

      planning_failed_node=tracked_step(
        db=db,
        agent_run=agent_run,
        step_name="planning_failed",
        node=planning_failed,
      ),

      research_trip_node=tracked_step(
        db=db,
        agent_run=agent_run,
        step_name="research_trip",
        node=research_trip,
        inject_context=True,
      ),

      recommend_flight_node=tracked_step(
        db=db,
        agent_run=agent_run,
        step_name="recommend_flight",
        node=recommend_flight,
      ),

      recommend_hotel_node=tracked_step(
        db=db,
        agent_run=agent_run,
        step_name="recommend_hotel",
        node=recommend_hotel,
      ),
    )

    result = await planning_graph.ainvoke(
      initial_state
    )
    await db.commit()

    if result.get("error"):
      return await mark_agent_run_failed(
        db=db,
        agent_run=agent_run,
        error_message=result["error"],
      )

    final_itinerary = result.get(
      "final_itinerary"
    )

    if not final_itinerary:
      return await mark_agent_run_failed(
        db=db,
        agent_run=agent_run,
        error_message=(
          "Planning completed without "
          "a valid itinerary."
        ),
      )

    recommended_hotel = result.get(
      "recommended_hotel"
    )

    if recommended_hotel is not None:
      agent_run.recommended_hotel = jsonable_encoder(
        recommended_hotel
      )

    await db.flush()

    await save_itinerary(
      db=db,
      trip_id=agent_run.trip_id,
      agent_run_id=agent_run.id,
      itinerary_data=final_itinerary,
    )

    research_results = result.get(
      "research_results",
      {},
    )

    places = research_results.get(
      "places",
      [],
    )

    await replace_trip_places(
      db=db,
      trip_id=agent_run.trip_id,
      places=places,
    )

    recommended_flight = result.get(
      "recommended_flight"
    )

    if recommended_flight:
      await save_selected_flight(
        db=db,
        trip_id=agent_run.trip_id,

        provider=recommended_flight[
          "provider"
        ],

        provider_offer_id=(
          recommended_flight[
            "provider_offer_id"
          ]
        ),

        airline=recommended_flight[
          "airline"
        ],

        airline_code=(
          recommended_flight.get(
            "airline_code"
          )
        ),

        original_price=(
          recommended_flight[
            "original_price"
          ]
        ),

        original_currency=(
          recommended_flight[
            "original_currency"
          ]
        ),

        converted_price=(
          recommended_flight[
            "converted_price"
          ]
        ),

        converted_currency=(
          recommended_flight[
            "converted_currency"
          ]
        ),

        exchange_rate=(
          recommended_flight[
            "exchange_rate"
          ]
        ),

        outbound=recommended_flight[
          "outbound"
        ],

        return_flight=(
          recommended_flight.get(
            "return_flight"
          )
        ),

        baggage=(
          recommended_flight.get(
            "baggage"
          )
        ),

        expires_at=(
          recommended_flight.get(
            "expires_at"
          )
        ),

        commit=False,
      )

    result = await db.execute(
      select(Trip).where(
        Trip.id == agent_run.trip_id
      )
    )

    trip = result.scalar_one()

    await update_trip_status(
      db=db,
      trip=trip,
      status="upcoming",
      commit=False,
    )

    await mark_agent_run_completed(
      db=db,
      agent_run=agent_run,
      commit=False,
    )

    await db.commit()
    await db.refresh(agent_run)

    return agent_run

  except Exception as exc:
    print("\n[PLANNING ERROR] Full traceback:")
    traceback.print_exc()

    await db.rollback()

    await mark_agent_run_failed(
      db=db,
      agent_run=agent_run,
      error_message=str(exc),
    )

    raise