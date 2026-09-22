import httpx

from app.core.config import settings
from app.integrations.images.schemas import ImageResult


UNSPLASH_SEARCH_URL = (
  "https://api.unsplash.com/search/photos"
)

TIMEOUT_SECONDS = 5.0


async def search_unsplash_image(
  query: str,
) -> ImageResult | None:
  params = {
    "query": query,
    "orientation": "landscape",
    "per_page": 1,
    "content_filter": "high",
  }

  headers = {
    "Authorization": (
      f"Client-ID "
      f"{settings.unsplash_access_key}"
    ),
    "Accept-Version": "v1",
  }

  try:
    async with httpx.AsyncClient(
      timeout=TIMEOUT_SECONDS,
    ) as client:
      response = await client.get(
        UNSPLASH_SEARCH_URL,
        params=params,
        headers=headers,
      )

    response.raise_for_status()

  except httpx.HTTPError:
    return None

  data = response.json()

  results = data.get(
    "results",
    [],
  )

  if not results:
    return None

  photo = results[0]

  urls = photo.get(
    "urls",
    {},
  )

  user = photo.get(
    "user",
    {},
  )

  links = photo.get(
    "links",
    {},
  )

  image_url = urls.get(
    "regular",
  )

  thumbnail_url = urls.get(
    "small",
  )

  if (
    not image_url
    or not thumbnail_url
  ):
    return None

  return ImageResult(
    provider="unsplash",
    provider_image_id=photo["id"],
    url=image_url,
    thumbnail_url=thumbnail_url,
    alt=(
      photo.get("alt_description")
      or photo.get("description")
      or query
    ),
    photographer_name=(
      user.get("name")
      or "Unknown"
    ),
    photographer_url=(
      user.get("links", {}).get(
        "html",
      )
      or ""
    ),
    attribution_url=(
      links.get("html")
      or ""
    ),
  )