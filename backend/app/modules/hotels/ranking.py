
from decimal import Decimal

from app.modules.hotels.schemas import ConvertedHotelOffer


HOTEL_BUDGET_SHARE = Decimal("0.30")


def rank_hotels(
  offers: list[ConvertedHotelOffer],
  trip_budget: Decimal | None,
) -> list[dict]:
  if not offers:
    return []

  hotel_budget = (
    trip_budget * HOTEL_BUDGET_SHARE
    if trip_budget is not None
    else None
  )

  prices = [
    offer.converted_price
    for offer in offers
  ]

  min_price = min(prices)
  max_price = max(prices)

  ranked = []

  for offer in offers:
    price = offer.converted_price

    # Lower price is better.
    if min_price == max_price:
      price_score = 1.0
    else:
      price_score = float(
        (max_price - price)
        / (max_price - min_price)
      )

    # LiteAPI guest ratings use a 0-10 scale.
    rating_score = (
      max(0.0, min(float(offer.rating) / 10, 1.0))
      if offer.rating is not None
      else 0.5
    )

    # Reward offers within the hotel budget.
    if hotel_budget is None or hotel_budget <= 0:
      budget_score = 0.5
      within_budget = None
    else:
      within_budget = price <= hotel_budget
      budget_score = min(
        1.0,
        float(hotel_budget / price),
      ) if price > 0 else 1.0

    # Unknown refundability is neutral.
    refundable = offer.room.refundable
    refund_score = (
      1.0 if refundable is True
      else 0.0 if refundable is False
      else 0.5
    )

    score = (
      price_score * 0.40
      + rating_score * 0.25
      + budget_score * 0.25
      + refund_score * 0.10
    )

    ranked.append({
      **offer.model_dump(),
      "ranking_score": round(score, 4),
      "within_hotel_budget": within_budget,
    })

  ranked.sort(
    key=lambda hotel: (
      -hotel["ranking_score"],
      hotel["converted_price"],
    )
  )

  for index, hotel in enumerate(ranked, start=1):
    hotel["rank"] = index

  return ranked