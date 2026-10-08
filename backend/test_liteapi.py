
import asyncio
from datetime import date, timedelta

from dotenv import load_dotenv
import os

from app.integrations.hotels.liteapi import (
  LiteAPIHotelProvider,
)
from app.integrations.hotels.schemas import (
  HotelSearchRequest,
)


async def main():
  load_dotenv()

  provider = LiteAPIHotelProvider(
    api_key=os.environ["LITEAPI_API_KEY"],
    base_url=os.getenv(
      "LITEAPI_BASE_URL",
      "https://api.liteapi.travel",
    ),
  )

  check_in = date.today() + timedelta(days=30)

  search = HotelSearchRequest(
    latitude=1.3521,
    longitude=103.8198,
    check_in=check_in,
    check_out=check_in + timedelta(days=3),
    adults=2,
    rooms=1,
    currency="USD",
    guest_nationality="IN",
  )

  offers = await provider.search_hotels(search)

  print("Hotel offers found:", len(offers))

  for offer in offers[:5]:
    print(
      offer.name,
      offer.room.name,
      offer.total_price,
      offer.currency,
    )


if __name__ == "__main__":
  asyncio.run(main())