from typing import Any

import httpx

from app.core.config import settings


GEOAPIFY_PLACES_URL = (
  "https://api.geoapify.com/v2/places"
)

SEARCH_GROUPS = {
  "attractions": [
    "tourism.attraction",
  ],
  "nature": [
    "natural",
    "leisure.park",
  ],
  "food": [
    "catering.restaurant",
    "catering.cafe",
  ],
  "culture": [
    "entertainment.culture",
    "heritage",
    "religion",
  ],
  "shopping": [
    "commercial",
  ],
  "nightlife": [
    "adult.nightclub",
    "catering.bar",
  ],
}


async def _fetch_places(
  *,
  client: httpx.AsyncClient,
  latitude: float,
  longitude: float,
  categories: list[str],
  limit: int,
) -> list[dict[str, Any]]:
  """
  Make one Geoapify Places request.
  """

  params = {
    "categories": ",".join(
      categories
    ),
    "filter": (
      f"circle:{longitude},"
      f"{latitude},15000"
    ),
    "bias": (
      f"proximity:{longitude},"
      f"{latitude}"
    ),
    "limit": limit,
    "apiKey":
      settings.geoapify_api_key,
  }

  response = await client.get(
    GEOAPIFY_PLACES_URL,
    params=params,
  )

  response.raise_for_status()

  data = response.json()

  places = []

  for feature in data.get(
    "features",
    [],
  ):
    properties = feature.get(
      "properties",
      {},
    )

    geometry = feature.get(
      "geometry",
      {},
    )

    coordinates = geometry.get(
      "coordinates",
      [],
    )

    if len(coordinates) < 2:
      continue

    name = properties.get(
      "name"
    )

    if not name:
      continue

    places.append(
      {
        "provider_place_id":
          properties.get(
            "place_id"
          ),
        "name": name,
        "categories":
          properties.get(
            "categories",
            [],
          ),
        "address":
          properties.get(
            "formatted"
          ),
        "latitude":
          coordinates[1],
        "longitude":
          coordinates[0],
        "distance":
          properties.get(
            "distance"
          ),
        "source": "geoapify",
      }
    )

  return places


async def search_places(
  *,
  latitude: float,
  longitude: float,
  interests: list[str] | None = None,
  categories: list[str] | None = None,
  limit: int = 30,
) -> dict[str, Any]:
  """
  Search for a diverse set of POIs around
  the canonical trip destination.
  """

  interests = [
    interest.lower()
    for interest in (
      interests or []
    )
  ]

  search_groups: list[
    tuple[
      str,
      list[str],
    ]
  ] = []

  # Always search attractions.
  search_groups.append(
    (
      "attractions",
      SEARCH_GROUPS[
        "attractions"
      ],
    )
  )

  # Add searches based on traveler
  # interests.
  for interest in interests:
    group_categories = (
      SEARCH_GROUPS.get(
        interest
      )
    )

    if group_categories:
      search_groups.append(
        (
          interest,
          group_categories,
        )
      )

  # Optional explicit categories.
  if categories:
    search_groups.append(
      (
        "custom",
        categories,
      )
    )

  # Avoid duplicate groups.
  unique_groups = []
  seen_groups = set()

  for (
    group_name,
    group_categories,
  ) in search_groups:
    key = tuple(
      group_categories
    )

    if key in seen_groups:
      continue

    seen_groups.add(key)

    unique_groups.append(
      (
        group_name,
        group_categories,
      )
    )

  # Keep external provider calls
  # controlled.
  unique_groups = (
    unique_groups[:3]
  )

  results_per_group = max(
    1,
    limit
    // len(unique_groups),
  )

  all_places = []

  async with httpx.AsyncClient(
    timeout=15.0,
  ) as client:
    for (
      group_name,
      group_categories,
    ) in unique_groups:
      group_places = (
        await _fetch_places(
          client=client,
          latitude=latitude,
          longitude=longitude,
          categories=(
            group_categories
          ),
          limit=(
            results_per_group
          ),
        )
      )

      for place in group_places:
        place[
          "search_group"
        ] = group_name

      all_places.extend(
        group_places
      )

  # Deduplicate places returned by
  # multiple category searches.
  unique_places = {}

  for place in all_places:
    place_id = place.get(
      "provider_place_id"
    )

    if not place_id:
      place_id = (
        f"{place['name']}:"
        f"{place['latitude']}:"
        f"{place['longitude']}"
      )

    if (
      place_id
      not in unique_places
    ):
      unique_places[
        place_id
      ] = place

  places = list(
    unique_places.values()
  )

  # Never return more than the
  # requested overall limit.
  places = places[:limit]

  return {
    "latitude": latitude,
    "longitude": longitude,
    "radius_meters": 15000,
    "interests": interests,
    "search_groups": [
      {
        "name": name,
        "categories":
          group_categories,
      }
      for (
        name,
        group_categories,
      ) in unique_groups
    ],
    "places": places,
    "source": "geoapify",
  }