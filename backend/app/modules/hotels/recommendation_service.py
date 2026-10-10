from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.agent_runs.models import AgentRun
from app.modules.hotels.schemas import (
  RecommendedHotelResponse,
  RankedHotelOffer,
)
from app.modules.trips.service import get_user_trip


async def get_trip_recommended_hotel(
  db: AsyncSession,
  trip_id: str,
  user_id: UUID,
) -> RecommendedHotelResponse | None:

  # Check trip ownership first.
  trip = await get_user_trip(
    db=db,
    trip_id=trip_id,
    user_id=user_id,
  )

  # Find the latest completed planning run
  # containing a hotel recommendation.
  result = await db.execute(
    select(AgentRun)
    .where(
      AgentRun.trip_id == trip.id,
      AgentRun.status == "completed",
      AgentRun.recommended_hotel.is_not(None),
    )
    .order_by(
      AgentRun.completed_at.desc(),
      AgentRun.id.desc(),
    )
    .limit(1)
  )

  agent_run = result.scalar_one_or_none()

  if agent_run is None:
    return None

  snapshot = agent_run.recommended_hotel

  return RecommendedHotelResponse(
    agent_run_id=agent_run.id,
    recommended_hotel=RankedHotelOffer.model_validate(
      snapshot
    ),
    recommended_at=snapshot.get("recommended_at"),
  )