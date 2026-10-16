
import asyncio
import json
import re

from pydantic import ValidationError

from app.modules.explore.providers.wikidata import (
    WikidataProviderError,
    fetch_destinations,
)
from app.modules.explore.schemas.destination import (
    DestinationData,
)
from app.modules.explore.services.country_resolver import (
    resolve_country,
)
from app.modules.explore.services.destination_batch_validator import (
    DestinationBatchValidationError,
    validate_destination_batch,
)


DESTINATIONS = {
    # Existing destinations
    "Paris": "Q90",
    "Tokyo": "Q1490",
    "Kyoto": "Q34600",
    "London": "Q84",
    "Rome": "Q220",
    "New York City": "Q60",
    "Berlin": "Q64",
    "Singapore": "Q334",
    "Dubai": "Q612",
    "Bangkok": "Q1861",

    # Asia
    "Seoul": "Q8684",
    "Hong Kong": "Q8646",
    "Mumbai": "Q1156",
    "Delhi": "Q1353",
    "Kuala Lumpur": "Q1865",

    # Europe
    "Amsterdam": "Q727",
    "Barcelona": "Q1492",
    "Madrid": "Q2807",
    "Vienna": "Q1741",
    "Prague": "Q1085",

    # North America
    "Los Angeles": "Q65",
    "San Francisco": "Q62",
    "Toronto": "Q172",
    "Vancouver": "Q24639",

    # South America
    "Rio de Janeiro": "Q8678",
    "Buenos Aires": "Q1486",

    # Africa
    "Cape Town": "Q5465",
    "Cairo": "Q85",

    # Oceania
    "Sydney": "Q3130",
    "Melbourne": "Q3141",
}


def parse_coordinates(value: str | None) -> dict | None:
    """Parse Wikidata WKT coordinates: Point(longitude latitude)."""

    if not value:
        return None

    match = re.fullmatch(
        r"Point\((-?\d+(?:\.\d+)?) "
        r"(-?\d+(?:\.\d+)?)\)",
        value,
    )

    if not match:
        return None

    longitude = float(match.group(1))
    latitude = float(match.group(2))

    if not (
        -180 <= longitude <= 180
        and -90 <= latitude <= 90
    ):
        return None

    return {
        "latitude": latitude,
        "longitude": longitude,
    }


async def main() -> None:
    print("Fetching destinations from Wikidata...\n")

    try:
        destinations = await fetch_destinations(
            list(DESTINATIONS.values())
        )
    except WikidataProviderError as exc:
        print(f"Wikidata request failed: {exc}")
        raise SystemExit(1) from exc

    destination_by_id = {
        item["wikidata_id"]: item
        for item in destinations
    }

    results: list[DestinationData] = []

    for expected_name, wikidata_id in DESTINATIONS.items():
        destination = destination_by_id.get(wikidata_id)

        if destination is None:
            print(f"Missing destination: {expected_name}")
            continue

        coordinates = parse_coordinates(
            destination.get("coordinates")
        )

        if coordinates is None:
            print(
                f"Invalid destination {expected_name} "
                f"({wikidata_id}): Missing or invalid coordinates."
            )
            continue

        country = resolve_country(
            latitude=coordinates["latitude"],
            longitude=coordinates["longitude"],
        )

        if country is None:
            print(
                f"Invalid destination {expected_name} "
                f"({wikidata_id}): Country could not be resolved."
            )
            continue

        try:
            validated = DestinationData(
                wikidata_id=wikidata_id,
                name=destination["name"],
                country=country["name"],
                country_code=country["iso_code"],
                latitude=coordinates["latitude"],
                longitude=coordinates["longitude"],
                source=destination["source"],
                country_source="natural_earth",
            )

            results.append(validated)

        except (ValidationError, ValueError) as exc:
            print(
                f"Invalid destination "
                f"{expected_name} ({wikidata_id}): {exc}"
            )

    # Validate the complete batch AFTER processing all destinations.
    requested_ids = list(DESTINATIONS.values())

    try:
        validated_results = validate_destination_batch(
            destinations=results,
            requested_wikidata_ids=requested_ids,
        )
    except DestinationBatchValidationError as exc:
        print(f"Destination batch validation failed: {exc}")
        raise SystemExit(1) from exc

    # Convert validated Pydantic models to JSON-compatible dictionaries.
    normalized_results = [
        destination.model_dump()
        for destination in validated_results
    ]

    print(
        f"Batch validation passed: "
        f"{len(normalized_results)} destinations.\n"
    )

    print(
        json.dumps(
            normalized_results,
            indent=2,
            ensure_ascii=False,
        )
    )

    print(
        f"\nRetrieved {len(normalized_results)} "
        f"of {len(DESTINATIONS)} destinations."
    )


if __name__ == "__main__":
    asyncio.run(main())