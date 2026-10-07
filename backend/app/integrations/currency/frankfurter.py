from decimal import Decimal

import httpx

from app.core.config import settings


TIMEOUT_SECONDS = 10.0


class FrankfurterCurrencyProvider:
  def __init__(self) -> None:
    self.base_url = (
      settings.currency_api_base_url.rstrip("/")
    )

  async def get_rate(
    self,
    source_currency: str,
    target_currency: str,
  ) -> Decimal:
    source = source_currency.upper()
    target = target_currency.upper()

    if source == target:
      return Decimal("1")

    async with httpx.AsyncClient(
      timeout=TIMEOUT_SECONDS,
    ) as client:
      response = await client.get(
        f"{self.base_url}/v2/rate/"
        f"{source.lower()}/"
        f"{target.lower()}",
      )

      response.raise_for_status()

      data = response.json()

    rate = data.get("rate")

    if rate is None:
      raise ValueError(
        f"No exchange rate found for "
        f"{source} to {target}."
      )

    return Decimal(str(rate))