import time

import asyncio
from app.integrations.images.schemas import (
  ImageResult,
  PlaceImageRequest,
  PlaceImageBatchItem,
)
from app.integrations.images.unsplash import search_unsplash_image


CACHE_TTL_SECONDS = 60 * 60 * 6  # 6 hours

_image_cache: dict[
  str,
  tuple[float, ImageResult | None],
] = {}


def _normalize_cache_key(value: str) -> str:
  return " ".join(
    value.lower().strip().split()
  )


def _get_cached_image(
  key: str,
) -> tuple[bool, ImageResult | None]:
  cached = _image_cache.get(key)

  if cached is None:
    return False, None

  cached_at, image = cached

  if (
    time.monotonic() - cached_at
    > CACHE_TTL_SECONDS
  ):
    _image_cache.pop(
      key,
      None,
    )

    return False, None

  return True, image


def _cache_image(
  key: str,
  image: ImageResult | None,
) -> None:
  _image_cache[key] = (
    time.monotonic(),
    image,
  )


async def _search_with_cache(
  *,
  cache_key: str,
  query: str,
) -> ImageResult | None:
  found, cached_image = (
    _get_cached_image(
      cache_key,
    )
  )

  if found:
    print(
      f"IMAGE CACHE HIT: {cache_key}"
    )

    return cached_image

  print(
    f"IMAGE CACHE MISS: {cache_key}"
  )

  image = await search_unsplash_image(
    query=query,
  )

  _cache_image(
    cache_key,
    image,
  )

  return image


async def get_destination_image(
  *,
  destination: str,
  country: str | None = None,
) -> ImageResult | None:
  query_parts = [
    destination,
  ]

  if country:
    query_parts.append(
      country,
    )

  query_parts.append(
    "travel",
  )

  query = " ".join(
    query_parts,
  )

  cache_key = (
    "destination:"
    + _normalize_cache_key(
      query,
    )
  )

  return await _search_with_cache(
    cache_key=cache_key,
    query=query,
  )


async def get_place_image(
  *,
  place_name: str,
  destination: str,
  country: str | None = None,
) -> ImageResult | None:
  query_parts = [
    place_name,
    destination,
  ]

  if country:
    query_parts.append(
      country,
    )

  query = " ".join(
    query_parts,
  )

  cache_key = (
    "place:"
    + _normalize_cache_key(
      query,
    )
  )

  image = await _search_with_cache(
    cache_key=cache_key,
    query=query,
  )

  if image:
    return image

  return await get_destination_image(
    destination=destination,
    country=country,
  )


async def get_place_images_batch(
  *,
  places: list[PlaceImageRequest],
) -> list[PlaceImageBatchItem]:
  unique_requests: dict[
    str,
    PlaceImageRequest,
  ] = {}

  for place in places:
    dedupe_key = (
      f"{place.place_name}|"
      f"{place.destination}|"
      f"{place.country or ''}"
    ).lower()

    if dedupe_key not in unique_requests:
      unique_requests[
        dedupe_key
      ] = place

  unique_places = list(
    unique_requests.values()
  )

  results = await asyncio.gather(
    *[
      get_place_image(
        place_name=place.place_name,
        destination=place.destination,
        country=place.country,
      )
      for place in unique_places
    ],
    return_exceptions=True,
  )

  resolved_images: dict[
    str,
    ImageResult | None,
  ] = {}

  for place, result in zip(
    unique_places,
    results,
  ):
    dedupe_key = (
      f"{place.place_name}|"
      f"{place.destination}|"
      f"{place.country or ''}"
    ).lower()

    if isinstance(
      result,
      BaseException,
    ):
      resolved_images[
        dedupe_key
      ] = None
    else:
      resolved_images[
        dedupe_key
      ] = result

  response: list[
    PlaceImageBatchItem
  ] = []

  for place in places:
    dedupe_key = (
      f"{place.place_name}|"
      f"{place.destination}|"
      f"{place.country or ''}"
    ).lower()

    response.append(
      PlaceImageBatchItem(
        key=place.key,
        image=resolved_images.get(
          dedupe_key
        ),
      )
    )

  return response