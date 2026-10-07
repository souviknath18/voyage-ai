from decimal import Decimal
from typing import Protocol


class CurrencyProvider(Protocol):
  async def get_rate(
    self,
    source_currency: str,
    target_currency: str,
  ) -> Decimal:
    ...