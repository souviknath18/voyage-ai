
"""
Convert Natural Earth country boundaries from Shapefile
to GeoJSON for Vaycogo.

Features:
- Validates source Shapefile
- Validates required country fields
- Converts coordinates to WGS84 (EPSG:4326)
- Repairs invalid country geometries
- Prevents invalid geometries from being exported
- Exports country boundaries to GeoJSON

Run from the backend directory:

  python -m app.modules.explore.scripts.convert_countries
"""

from pathlib import Path

import geopandas as gpd


# --------------------------------------------------
# File paths
# --------------------------------------------------

EXPLORE_DIR = Path(__file__).resolve().parents[1]

DATA_DIR = EXPLORE_DIR / "data"

SOURCE_FILE = (
  DATA_DIR
  / "natural_earth"
  / "ne_10m_admin_0_countries.shp"
)

OUTPUT_FILE = DATA_DIR / "countries.geojson"


# --------------------------------------------------
# Convert Shapefile to GeoJSON
# --------------------------------------------------

def convert_countries() -> None:
  print("Starting Natural Earth conversion...\n")

  # Step 1: Validate source file
  if not SOURCE_FILE.is_file():
    raise FileNotFoundError(
      f"Natural Earth Shapefile not found:\n"
      f"{SOURCE_FILE}"
    )

  print(f"Source: {SOURCE_FILE}")

  # Step 2: Load Natural Earth dataset
  countries = gpd.read_file(SOURCE_FILE)

  if countries.empty:
    raise ValueError(
      "Natural Earth dataset is empty."
    )

  original_count = len(countries)

  print(
    f"Loaded {original_count} country records."
  )

  # Step 3: Validate required columns
  required_columns = {
    "ADMIN",
    "ISO_A3",
    "ADM0_A3",
  }

  missing_columns = (
    required_columns - set(countries.columns)
  )

  if missing_columns:
    raise ValueError(
      "Missing required columns: "
      f"{sorted(missing_columns)}"
    )

  # Step 4: Validate coordinate reference system
  if countries.crs is None:
    raise ValueError(
      "Source dataset has no coordinate "
      "reference system."
    )

  print(f"Original CRS: {countries.crs}")

  # Step 5: Convert to WGS84
  countries = countries.to_crs(
    "EPSG:4326"
  )

  print(f"Converted CRS: {countries.crs}")

  # Step 6: Check for missing or empty geometries
  missing_geometry_mask = (
    countries.geometry.isna()
    | countries.geometry.is_empty
  )

  missing_geometry_count = int(
    missing_geometry_mask.sum()
  )

  if missing_geometry_count:
    raise ValueError(
      f"Found {missing_geometry_count} "
      "missing or empty geometries."
    )

  # Step 7: Detect invalid geometries
  invalid_mask = ~countries.geometry.is_valid

  invalid_count = int(
    invalid_mask.sum()
  )

  print(
    f"Invalid geometries found: {invalid_count}"
  )

  # Step 8: Repair invalid geometries
  if invalid_count:
    print("Repairing invalid geometries...")

    repaired = (
      countries.loc[
        invalid_mask, "geometry"
      ].make_valid()
    )

    countries.loc[
      invalid_mask, "geometry"
    ] = repaired

  # Step 9: Validate repaired geometries
  if countries.geometry.isna().any():
    raise ValueError(
      "Geometry repair produced null geometries."
    )

  if countries.geometry.is_empty.any():
    raise ValueError(
      "Geometry repair produced empty geometries."
    )

  if not countries.geometry.is_valid.all():
    raise ValueError(
      "Some geometries remain invalid "
      "after repair."
    )

  # Step 10: Ensure all geometries are polygons
  polygon_mask = (
    countries.geometry.geom_type.isin(
      [
        "Polygon",
        "MultiPolygon",
      ]
    )
  )

  if not polygon_mask.all():
    invalid_types = (
      countries.loc[
        ~polygon_mask,
        ["ADMIN", "geometry"]
      ]
      .geometry.geom_type.tolist()
    )

    raise ValueError(
      "Geometry repair produced unsupported "
      f"geometry types: {invalid_types}. "
      "Manual review is required."
    )

  print("Geometry validation successful.")

  # Step 11: Retain required country fields
  
    # Keep Natural Earth country identifiers.
  countries = countries[
    [
      "ADMIN",
      "ISO_A3",
      "ADM0_A3",
      "geometry",
    ]
  ].copy()

  # Use ADM0_A3 when ISO_A3 is unavailable.
  missing_iso = (
    countries["ISO_A3"].isna()
    | countries["ISO_A3"].eq("-99")
  )

  countries.loc[
    missing_iso, "ISO_A3"
  ] = countries.loc[
    missing_iso, "ADM0_A3"
  ]

  # Validate resolved country codes.
  invalid_iso = ~countries["ISO_A3"].str.fullmatch(
    r"[A-Z]{3}",
    na=False,
  )

  if invalid_iso.any():
    invalid_countries = countries.loc[
      invalid_iso,
      ["ADMIN", "ISO_A3"],
    ]

    raise ValueError(
      "Invalid country codes remain:\n"
      f"{invalid_countries.to_string(index=False)}"
    )

  # Remove the temporary fallback column.
  countries = countries[
    [
      "ADMIN",
      "ISO_A3",
      "geometry",
    ]
  ].copy()

  # Step 12: Ensure country names exist
  if countries["ADMIN"].isna().any():
    raise ValueError(
      "Some country records have no name."
    )

  # Step 13: Ensure ISO codes exist
  if countries["ISO_A3"].isna().any():
    raise ValueError(
      "Some country records have no ISO code."
    )

  # Step 14: Create output directory
  DATA_DIR.mkdir(
    parents=True,
    exist_ok=True,
  )

  # Step 15: Export to GeoJSON
  countries.to_file(
    OUTPUT_FILE,
    driver="GeoJSON",
    index=False,
  )

  # Step 16: Verify generated file
  if not OUTPUT_FILE.is_file():
    raise RuntimeError(
      "GeoJSON file was not created."
    )

  # Step 17: Read generated GeoJSON
  exported = gpd.read_file(OUTPUT_FILE)

  if len(exported) != len(countries):
    raise RuntimeError(
      "Export verification failed: "
      "record count mismatch."
    )

  if not exported.geometry.is_valid.all():
    raise RuntimeError(
      "Export verification failed: "
      "invalid geometries detected."
    )

  # Step 18: Print conversion summary
  print("\nConversion successful!")
  print("-" * 50)
  print(f"Original records: {original_count}")
  print(f"Exported records: {len(exported)}")
  print(f"Repaired geometries: {invalid_count}")
  print(f"CRS: {exported.crs}")
  print(f"Output: {OUTPUT_FILE}")
  print(
    "File size: "
    f"{OUTPUT_FILE.stat().st_size / (1024 * 1024):.2f} MB"
  )
  print("-" * 50)


if __name__ == "__main__":
  convert_countries()