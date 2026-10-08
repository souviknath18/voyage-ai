
from decimal import Decimal, InvalidOperation

import httpx

from app.integrations.hotels.schemas import (
  HotelOffer,
  HotelRoom,
  HotelSearchRequest,
)


class LiteAPIHotelProvider:
  def __init__(
    self,
    api_key: str,
    base_url: str = "https://api.liteapi.travel",
  ):
    if not api_key:
      raise ValueError("LiteAPI API key is required")

    self.api_key = api_key
    self.base_url = base_url.rstrip("/")

  async def search_hotels(
    self,
    search: HotelSearchRequest,
  ) -> list[HotelOffer]:
    if search.check_out <= search.check_in:
      raise ValueError(
        "Check-out must be after check-in"
      )

    if search.rooms != 1:
      raise ValueError(
        "Multiple rooms are not supported yet"
      )

    payload = {
      "latitude": search.latitude,
      "longitude": search.longitude,
      "radius": 10000,
      "checkin": search.check_in.isoformat(),
      "checkout": search.check_out.isoformat(),
      "occupancies": [
        {"adults": search.adults}
      ],
      "currency": search.currency.upper(),
      "guestNationality": (
        search.guest_nationality.upper()
      ),
      "roomMapping": True,
      "includeHotelData": True,
      "maxRatesPerHotel": 1,
      "limit": 20,
    }

    headers = {
      "X-API-Key": self.api_key,
      "Accept": "application/json",
      "Content-Type": "application/json",
    }

    timeout = httpx.Timeout(
      15.0,
      connect=5.0,
    )

    async with httpx.AsyncClient(
      timeout=timeout,
    ) as client:
      response = await client.post(
        f"{self.base_url}/v3.0/hotels/rates",
        headers=headers,
        json=payload,
      )

      response.raise_for_status()

      if response.status_code == 204:
        return []

      body = response.json()

    return self._normalize_offers(
      body,
      search,
    )

  def _normalize_offers(
    self,
    body: dict,
    search: HotelSearchRequest,
  ) -> list[HotelOffer]:
    nights = (
      search.check_out - search.check_in
    ).days

    hotels = {
      hotel["id"]: hotel
      for hotel in body.get("hotels", [])
      if isinstance(hotel, dict)
      and hotel.get("id")
    }

    offers: list[HotelOffer] = []

    for item in body.get("data", []):
      hotel_id = item.get("hotelId")

      if not hotel_id:
        continue

      hotel = hotels.get(hotel_id, {})

      for room_type in item.get(
        "roomTypes", []
      ):
        offer_id = room_type.get("offerId")

        if not offer_id:
          continue

        for rate in room_type.get(
          "rates", []
        ):
          totals = (
            rate.get("retailRate") or {}
          ).get("total") or []

          if not totals:
            continue

          total = totals[0]

          try:
            amount = Decimal(
              str(total["amount"])
            )
          except (
            KeyError,
            InvalidOperation,
            TypeError,
          ):
            continue

          currency = total.get(
            "currency",
            search.currency,
          )

          policies = (
            rate.get(
              "cancellationPolicies"
            ) or {}
          )

          refundable_tag = policies.get(
            "refundableTag"
          )

          refundable = (
            True
            if refundable_tag == "RFN"
            else False
            if refundable_tag == "NRFN"
            else None
          )

          offers.append(
            HotelOffer(
              id=offer_id,
              hotel_id=hotel_id,
              name=hotel.get(
                "name",
                "Hotel",
              ),
              address=hotel.get(
                "address"
              ),
              rating=hotel.get(
                "rating"
              ),
              image_url=hotel.get(
                "main_photo"
              ),
              room=HotelRoom(
                id=str(
                  rate.get(
                    "mappedRoomId"
                  )
                  or room_type.get(
                    "roomTypeId"
                  )
                  or offer_id
                ),
                name=rate.get(
                  "name"
                )
                or "Room",
                board_type=rate.get(
                  "boardName"
                ),
                refundable=refundable,
              ),
              check_in=search.check_in,
              check_out=search.check_out,
              nights=nights,
              total_price=amount,
              currency=currency,
              price_per_night=(
                amount / nights
              ),
            )
          )

    return offers
