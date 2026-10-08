
import uuid
from decimal import Decimal
from typing import Any

from sqlalchemy import delete, func, select
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.hotels.models import SelectedHotel


async def get_selected_hotel(
  db: AsyncSession,
  trip_id: uuid.UUID,
) -> SelectedHotel | None:
  result = await db.execute(
    select(SelectedHotel).where(
      SelectedHotel.trip_id == trip_id
    )
  )
  return result.scalar_one_or_none()


async def save_selected_hotel(
  db: AsyncSession,
  *,
  trip_id: uuid.UUID,
  provider_offer_id: str,
  hotel_id: str,
  hotel_name: str,
  original_price: Decimal,
  original_currency: str,
  converted_price: Decimal,
  converted_currency: str,
  exchange_rate: Decimal,
  hotel_snapshot: dict[str, Any],
) -> SelectedHotel:
  values = {
    "id": uuid.uuid4(),
    "trip_id": trip_id,
    "provider": "liteapi",
    "provider_offer_id": provider_offer_id,
    "hotel_id": hotel_id,
    "hotel_name": hotel_name,
    "original_price": original_price,
    "original_currency": original_currency,
    "converted_price": converted_price,
    "converted_currency": converted_currency,
    "exchange_rate": exchange_rate,
    "hotel_snapshot": hotel_snapshot,
  }

  stmt = insert(SelectedHotel).values(**values)

  stmt = stmt.on_conflict_do_update(
    index_elements=[SelectedHotel.trip_id],
    set_={
      key: value
      for key, value in values.items()
      if key not in {"id", "trip_id"}
    } | {"updated_at": func.now()},
  )

  await db.execute(stmt)
  await db.commit()

  selected = await get_selected_hotel(db, trip_id)

  if selected is None:
    raise RuntimeError(
      "Failed to retrieve saved hotel selection"
    )

  return selected


async def delete_selected_hotel(
  db: AsyncSession,
  trip_id: uuid.UUID,
) -> bool:
  result = await db.execute(
    delete(SelectedHotel).where(
      SelectedHotel.trip_id == trip_id
    )
  )

  await db.commit()

  return result.rowcount > 0
