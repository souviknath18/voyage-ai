from typing import Any

import httpx


GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search"
TIMEOUT_SECONDS = 10.0


async def search_locations(
  destination: str,
) -> list[dict[str, Any]]:
  async with httpx.AsyncClient(
    timeout=TIMEOUT_SECONDS,
  ) as client:
    response = await client.get(
      GEOCODING_URL,
      params={
        "name": destination,
        "count": 10,
        "language": "en",
        "format": "json",
      },
    )

    response.raise_for_status()

    data = response.json()

  results = data.get("results", [])

  return [
    {
      "name": result.get("name"),
      "admin1": result.get("admin1"),
      "country": result.get("country"),
      "country_code": result.get("country_code"),
      "latitude": result.get("latitude"),
      "longitude": result.get("longitude"),
      "timezone": result.get("timezone"),
    }
    for result in results
  ]