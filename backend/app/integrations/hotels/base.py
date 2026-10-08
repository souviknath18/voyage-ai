
from typing import Protocol

from app.integrations.hotels.schemas import (
  HotelOffer,
  HotelSearchRequest,
)


class HotelProvider(Protocol):

  async def search_hotels(
    self,
    search: HotelSearchRequest,
  ) -> list[HotelOffer]:
    ...