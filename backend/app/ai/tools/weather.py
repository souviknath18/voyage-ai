import asyncio

from datetime import date
from typing import Any

import httpx


FORECAST_URL = "https://api.open-meteo.com/v1/forecast"

TIMEOUT_SECONDS = 10.0

MAX_RETRIES = 3

RETRYABLE_STATUS_CODES = {
  429,
  500,
  502,
  503,
  504,
}


def get_weather_description(
  weather_code: int | None,
) -> str:
  descriptions = {
    0: "clear sky",
    1: "mainly clear",
    2: "partly cloudy",
    3: "overcast",
    45: "fog",
    48: "depositing rime fog",
    51: "light drizzle",
    53: "moderate drizzle",
    55: "dense drizzle",
    56: "light freezing drizzle",
    57: "dense freezing drizzle",
    61: "slight rain",
    63: "moderate rain",
    65: "heavy rain",
    66: "light freezing rain",
    67: "heavy freezing rain",
    71: "slight snowfall",
    73: "moderate snowfall",
    75: "heavy snowfall",
    77: "snow grains",
    80: "slight rain showers",
    81: "moderate rain showers",
    82: "violent rain showers",
    85: "slight snow showers",
    86: "heavy snow showers",
    95: "thunderstorm",
    96: "thunderstorm with slight hail",
    99: "thunderstorm with heavy hail",
  }

  return descriptions.get(
    weather_code,
    "unknown",
  )


def unavailable_weather(
  *,
  destination: str,
  latitude: float,
  longitude: float,
  timezone: str | None,
  start_date: str,
  end_date: str,
  reason: str,
) -> dict[str, Any]:
  return {
    "available": False,
    "destination": destination,
    "resolved_location": {
      "latitude": latitude,
      "longitude": longitude,
      "timezone": timezone,
    },
    "start_date": start_date,
    "end_date": end_date,
    "forecast": [],
    "forecast_available_until": None,
    "source": "open-meteo",
    "unavailable_reason": reason,
  }


async def get_weather(
  *,
  destination: str,
  latitude: float,
  longitude: float,
  timezone: str | None,
  start_date: str,
  end_date: str,
) -> dict[str, Any]:
  params = {
    "latitude": latitude,
    "longitude": longitude,
    "daily": (
      "weather_code,"
      "temperature_2m_max,"
      "temperature_2m_min,"
      "precipitation_probability_max"
    ),
    "timezone": timezone or "auto",
    "forecast_days": 16,
  }

  forecast_data: dict[str, Any] | None = None

  async with httpx.AsyncClient(
    timeout=TIMEOUT_SECONDS,
  ) as client:
    for attempt in range(
      1,
      MAX_RETRIES + 1,
    ):
      try:
        response = await client.get(
          FORECAST_URL,
          params=params,
        )

        if (
          response.status_code
          in RETRYABLE_STATUS_CODES
        ):
          if attempt < MAX_RETRIES:
            await asyncio.sleep(
              2 ** (attempt - 1)
            )
            continue

          return unavailable_weather(
            destination=destination,
            latitude=latitude,
            longitude=longitude,
            timezone=timezone,
            start_date=start_date,
            end_date=end_date,
            reason=(
              "Weather provider is "
              "temporarily unavailable."
            ),
          )

        response.raise_for_status()

        forecast_data = response.json()

        break

      except (
        httpx.TimeoutException,
        httpx.NetworkError,
      ):
          if attempt < MAX_RETRIES:
            await asyncio.sleep(
              2 ** (attempt - 1)
            )
            continue

          return unavailable_weather(
            destination=destination,
            latitude=latitude,
            longitude=longitude,
            timezone=timezone,
            start_date=start_date,
            end_date=end_date,
            reason=(
              "Weather provider could "
              "not be reached."
            ),
          )

  if forecast_data is None:
    return unavailable_weather(
      destination=destination,
      latitude=latitude,
      longitude=longitude,
      timezone=timezone,
      start_date=start_date,
      end_date=end_date,
      reason=(
        "Weather information is "
        "currently unavailable."
      ),
    )

  daily = forecast_data.get(
    "daily",
    {},
  )

  dates = daily.get(
    "time",
    [],
  )

  max_temperatures = daily.get(
    "temperature_2m_max",
    [],
  )

  min_temperatures = daily.get(
    "temperature_2m_min",
    [],
  )

  precipitation_probabilities = daily.get(
    "precipitation_probability_max",
    [],
  )

  weather_codes = daily.get(
    "weather_code",
    [],
  )

  requested_start = date.fromisoformat(
    start_date
  )

  requested_end = date.fromisoformat(
    end_date
  )

  forecast = []

  for (
    forecast_date,
    temperature_max,
    temperature_min,
    precipitation_probability,
    weather_code,
  ) in zip(
    dates,
    max_temperatures,
    min_temperatures,
    precipitation_probabilities,
    weather_codes,
  ):
    current_date = date.fromisoformat(
      forecast_date
    )

    if (
      requested_start
      <= current_date
      <= requested_end
    ):
      forecast.append(
        {
          "date": forecast_date,
          "temperature_max": (
            temperature_max
          ),
          "temperature_min": (
            temperature_min
          ),
          "precipitation_probability": (
            precipitation_probability
          ),
          "weather_code": weather_code,
          "weather_description": (
            get_weather_description(
              weather_code
            )
          ),
        }
      )

  return {
    "available": True,
    "destination": destination,
    "resolved_location": {
      "latitude": latitude,
      "longitude": longitude,
      "timezone": timezone,
    },
    "start_date": start_date,
    "end_date": end_date,
    "forecast": forecast,
    "forecast_available_until": (
      dates[-1]
      if dates
      else None
    ),
    "source": "open-meteo",
    "unavailable_reason": None,
  }