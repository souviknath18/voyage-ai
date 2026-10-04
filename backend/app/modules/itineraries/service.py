import uuid

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.itineraries.models import Itinerary
from app.modules.itineraries.repository import (
  get_itinerary_by_trip_id,
  get_itinerary_by_version,
  get_itinerary_versions,
)
from app.modules.trips.service import get_user_trip
from app.modules.agent_runs.repository import (
  create_agent_run,
  mark_agent_run_completed,
)
from app.modules.itineraries.repository import (
  get_itinerary_by_trip_id,
  get_itinerary_by_version,
  get_itinerary_versions,
  save_itinerary,
  serialize_itinerary,
)


async def get_trip_itinerary(
  db: AsyncSession,
  public_trip_id: str,
  user_id: uuid.UUID,
) -> Itinerary:
  # This also verifies that the trip belongs
  # to the authenticated user.
  trip = await get_user_trip(
    db=db,
    trip_id=public_trip_id,
    user_id=user_id,
  )

  itinerary = await get_itinerary_by_trip_id(
    db=db,
    trip_id=trip.id,
  )

  if itinerary is None:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND,
      detail="Itinerary not found",
    )

  return itinerary


async def list_trip_itinerary_versions(
  db: AsyncSession,
  public_trip_id: str,
  user_id: uuid.UUID,
) -> list[Itinerary]:
  trip = await get_user_trip(
    db=db,
    trip_id=public_trip_id,
    user_id=user_id,
  )

  return await get_itinerary_versions(
    db=db,
    trip_id=trip.id,
  )


async def get_trip_itinerary_version(
  db: AsyncSession,
  public_trip_id: str,
  user_id: uuid.UUID,
  version: int,
) -> Itinerary:
  trip = await get_user_trip(
    db=db,
    trip_id=public_trip_id,
    user_id=user_id,
  )

  itinerary = await get_itinerary_by_version(
    db=db,
    trip_id=trip.id,
    version=version,
  )

  if itinerary is None:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND,
      detail="Itinerary version not found",
    )

  return itinerary


async def restore_trip_itinerary_version(
  db: AsyncSession,
  public_trip_id: str,
  user_id: uuid.UUID,
  version: int,
) -> Itinerary:
  trip = await get_user_trip(
    db=db,
    trip_id=public_trip_id,
    user_id=user_id,
  )

  source_itinerary = await get_itinerary_by_version(
    db=db,
    trip_id=trip.id,
    version=version,
  )

  if source_itinerary is None:
    raise HTTPException(
      status_code=status.HTTP_404_NOT_FOUND,
      detail="Itinerary version not found",
    )

  latest_itinerary = await get_itinerary_by_trip_id(
    db=db,
    trip_id=trip.id,
  )

  if (
    latest_itinerary is not None
    and latest_itinerary.version == version
  ):
    raise HTTPException(
      status_code=status.HTTP_400_BAD_REQUEST,
      detail="This itinerary version is already current",
    )

  agent_run = await create_agent_run(
    db=db,
    trip_id=trip.id,
    input_snapshot={
      "mode": "restore",
      "restored_from_version": version,
      "restored_from_itinerary_id": str(
        source_itinerary.id
      ),
    },
  )

  itinerary_data = serialize_itinerary(
    source_itinerary
  )

  try:
    restored_itinerary = await save_itinerary(
      db=db,
      trip_id=trip.id,
      agent_run_id=agent_run.id,
      itinerary_data=itinerary_data,
    )

    await mark_agent_run_completed(
      db=db,
      agent_run=agent_run,
      commit=False,
    )

    await db.commit()

    return await get_itinerary_by_version(
      db=db,
      trip_id=trip.id,
      version=restored_itinerary.version,
    )

  except Exception:
    await db.rollback()
    raise