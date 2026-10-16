
"""
Country resolver for Vaycogo.

Uses Natural Earth country boundaries to identify
countries from latitude and longitude.
"""

from functools import lru_cache
from pathlib import Path

import geopandas as gpd
from shapely.geometry import Point


DATA_PATH = (
  Path(__file__).resolve().parents[1]
  / "data"
  / "countries.geojson"
)

# Maximum fallback distance in metres.
COASTAL_TOLERANCE_METERS = 50


class CountryResolverError(Exception):
  pass


@lru_cache(maxsize=1)
def load_countries() -> gpd.GeoDataFrame:
  """Load and cache country boundaries."""

  if not DATA_PATH.is_file():
    raise CountryResolverError(
      f"Country dataset not found: {DATA_PATH}"
    )

  countries = gpd.read_file(DATA_PATH)

  if countries.empty:
    raise CountryResolverError(
      "Country boundary dataset is empty."
    )

  if countries.crs is None:
    raise CountryResolverError(
      "Country dataset has no CRS."
    )

  required = {"ADMIN", "ISO_A3"}

  if not required.issubset(countries.columns):
    raise CountryResolverError(
      "Country dataset is missing required fields."
    )

  return countries.to_crs("EPSG:4326")


def resolve_country(
  latitude: float,
  longitude: float,
) -> dict | None:
  """
  Resolve a geographic point to a country.

  First uses polygon intersection, then a
  conservative proximity fallback.

  Returns None for unresolved or ambiguous points.
  """

  if not (-90 <= latitude <= 90):
    raise ValueError("Invalid latitude")

  if not (-180 <= longitude <= 180):
    raise ValueError("Invalid longitude")

  countries = load_countries()

  point = Point(longitude, latitude)

  # Step 1: Exact polygon intersection
  matches = countries[
    countries.geometry.intersects(point)
  ]

  if len(matches) == 1:
    country = matches.iloc[0]

    return {
      "name": country["ADMIN"],
      "iso_code": country["ISO_A3"],
    }

  # Multiple matches are ambiguous.
  if len(matches) > 1:
    return None

  # Step 2: Calculate local distances in metres.
  # Use an azimuthal equidistant projection centred
  # on the destination to avoid measuring degrees.
  local_crs = (
    f"+proj=aeqd +lat_0={latitude} "
    f"+lon_0={longitude} "
    "+datum=WGS84 +units=m +no_defs"
  )

  local_countries = countries.to_crs(local_crs)

  local_point = gpd.GeoSeries(
    [point],
    crs="EPSG:4326",
  ).to_crs(local_crs).iloc[0]

  distances = local_countries.geometry.distance(
    local_point
  )

  nearby = countries.loc[
    distances.index[
      distances <= COASTAL_TOLERANCE_METERS
    ]
  ]

  # Accept only one nearby country.
  if len(nearby) != 1:
    return None

  country = nearby.iloc[0]

  return {
    "name": country["ADMIN"],
    "iso_code": country["ISO_A3"],
  }