import uuid

from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel


class TripPlaceResponse(BaseModel):
  id: uuid.UUID

  provider: str
  provider_place_id: str

  name: str
  categories: list[str]
  address: str | None

  latitude: Decimal
  longitude: Decimal

  distance: Decimal | None
  search_group: str | None

  created_at: datetime

  model_config = {
    "from_attributes": True,
  }