
"""
Validate Vaycogo's Natural Earth country resolver.

Run:
python -m app.modules.explore.scripts.test_country_resolver
"""

from app.modules.explore.services.country_resolver import (
  resolve_country,
)


TEST_DESTINATIONS = [
  {
    "city": "Paris",
    "latitude": 48.856666666,
    "longitude": 2.352222222,
    "expected_country": "France",
  },
  {
    "city": "Tokyo",
    "latitude": 35.689444444,
    "longitude": 139.691666666,
    "expected_country": "Japan",
  },
  {
    "city": "Kyoto",
    "latitude": 35.011611111,
    "longitude": 135.768111111,
    "expected_country": "Japan",
  },
  {
    "city": "London",
    "latitude": 51.507222222,
    "longitude": -0.1275,
    "expected_country": "United Kingdom",
  },
  {
    "city": "Rome",
    "latitude": 41.893055555,
    "longitude": 12.482777777,
    "expected_country": "Italy",
  },
  {
    "city": "New York City",
    "latitude": 40.712777777,
    "longitude": -74.006111111,
    "expected_country": "United States of America",
  },
  {
    "city": "Berlin",
    "latitude": 52.516666666,
    "longitude": 13.383333333,
    "expected_country": "Germany",
  },
  {
    "city": "Singapore",
    "latitude": 1.3,
    "longitude": 103.8,
    "expected_country": "Singapore",
  },
  {
    "city": "Dubai",
    "latitude": 25.269722222,
    "longitude": 55.309444444,
    "expected_country": "United Arab Emirates",
  },
  {
    "city": "Bangkok",
    "latitude": 13.75,
    "longitude": 100.516666666,
    "expected_country": "Thailand",
  },
]


def diagnose_dubai() -> None:
  import geopandas as gpd
  from shapely.geometry import Point

  from app.modules.explore.services.country_resolver import (
    DATA_PATH,
  )

  countries = gpd.read_file(DATA_PATH)

  dubai = Point(
    55.309444444,
    25.269722222,
  )

  print("\n--- Dubai Diagnostic ---")

  print(f"Dataset CRS: {countries.crs}")

  uae = countries[
    countries["ADMIN"]
    == "United Arab Emirates"
  ]

  print(f"UAE records: {len(uae)}")

  if uae.empty:
    print("UAE boundary not found.")
    return

  if countries.crs is None:
    print("Dataset CRS is missing.")
    return

  if countries.crs.to_epsg() != 4326:
    uae = uae.to_crs("EPSG:4326")

  geometry = uae.geometry.union_all()

  print(
        "Dubai intersects UAE:",
        geometry.intersects(dubai),
  )

  print(
    "UAE bounds:",
    geometry.bounds,
  )

  print(
    "Dubai longitude:",
    dubai.x,
  )

  print(
    "Dubai latitude:",
    dubai.y,
  )

  # Distance is approximate because coordinates
  # are expressed in degrees.
  print(
    "Distance to UAE boundary (degrees):",
    geometry.distance(dubai),
  )


def main() -> None:
  print("\nTesting Vaycogo Country Resolver...\n")

  passed = 0
  failed = 0

  for destination in TEST_DESTINATIONS:
    result = resolve_country(
      latitude=destination["latitude"],
      longitude=destination["longitude"],
    )

    actual_country = (
      result["name"] if result else None
    )

    expected_country = destination[
      "expected_country"
    ]

    if actual_country == expected_country:
      passed += 1
      status = "PASS"
    else:
      failed += 1
      status = "FAIL"

    print(
      f"[{status}] {destination['city']}: "
      f"{actual_country} "
      f"(Expected: {expected_country})"
    )

  print("\n" + "-" * 50)
  print(f"Total: {len(TEST_DESTINATIONS)}")
  print(f"Passed: {passed}")
  print(f"Failed: {failed}")
  print("-" * 50)

  if failed:
    raise SystemExit(
      "Country resolution validation failed."
    )

  print("\nAll country resolutions passed!")


if __name__ == "__main__":
  diagnose_dubai()
  main()