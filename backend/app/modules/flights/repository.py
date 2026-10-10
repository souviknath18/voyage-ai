import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.flights.models import (
  SelectedFlight,
)


async def get_selected_flight(
  db: AsyncSession,
  trip_id: uuid.UUID,
) -> SelectedFlight | None:
  result = await db.execute(
    select(SelectedFlight).where(
      SelectedFlight.trip_id == trip_id
    )
  )

  return result.scalar_one_or_none()


async def save_selected_flight(
  db: AsyncSession,
  *,
  trip_id: uuid.UUID,
  provider: str,
  provider_offer_id: str,
  airline: str,
  airline_code: str | None,
  original_price,
  original_currency: str,
  converted_price,
  converted_currency: str,
  exchange_rate,
  outbound: dict,
  return_flight: dict | None,
  baggage: str | None,
  expires_at: str | None,
  commit: bool = True,
) -> SelectedFlight:
  selected = await get_selected_flight(
    db=db,
    trip_id=trip_id,
  )

  if selected is None:
    selected = SelectedFlight(
      trip_id=trip_id,
    )

    db.add(selected)

  selected.provider = provider
  selected.provider_offer_id = provider_offer_id
  selected.airline = airline
  selected.airline_code = airline_code

  selected.original_price = original_price
  selected.original_currency = original_currency

  selected.converted_price = converted_price
  selected.converted_currency = converted_currency
  selected.exchange_rate = exchange_rate

  selected.outbound = outbound
  selected.return_flight = return_flight

  selected.baggage = baggage
  selected.expires_at = expires_at

  if commit:
    await db.commit()
    await db.refresh(selected)
  else:
    await db.flush()

  return selected


async def delete_selected_flight(
  db: AsyncSession,
  trip_id: uuid.UUID,
) -> bool:
  selected = await get_selected_flight(
    db=db,
    trip_id=trip_id,
  )

  if selected is None:
    return False

  await db.delete(selected)
  await db.commit()

  return True