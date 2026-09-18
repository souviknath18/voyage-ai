from pydantic import BaseModel


class WeatherDayResponse(BaseModel):
  date: str
  temperature_max: float | None = None
  temperature_min: float | None = None
  precipitation_probability: float | None = None
  weather_code: int | None = None
  weather_description: str


class TripWeatherResponse(BaseModel):
  destination: str
  country: str | None = None
  timezone: str | None = None
  source: str
  forecast_available_until: str | None = None
  forecast: list[WeatherDayResponse]