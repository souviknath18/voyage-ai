from typing import Any


async def get_weather(
  destination: str,
  start_date: str,
  end_date: str,
) -> dict[str, Any]:
  """
  Fetch weather information for a trip destination.

  A real weather provider will be integrated in the next step.
  """

  return {
    "destination": destination,
    "start_date": start_date,
    "end_date": end_date,
    "forecast": [],
    "source": None,
  }