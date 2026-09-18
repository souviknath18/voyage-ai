from pydantic import BaseModel


class LocationSearchResult(BaseModel):
  name: str | None = None
  admin1: str | None = None
  country: str | None = None
  country_code: str | None = None
  latitude: float
  longitude: float
  timezone: str | None = None