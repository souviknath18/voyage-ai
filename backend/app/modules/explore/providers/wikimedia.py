
"""
Wikimedia Commons image provider for Vaycogo.

Retrieves Wikipedia article images and their Wikimedia
Commons attribution metadata.

Read-only: does not modify the database.
"""

import re
from urllib.parse import quote

import httpx

from app.modules.explore.providers.curated_images import (
    get_curated_image_filename,
)
from app.modules.explore.providers.http_config import (
    get_wikimedia_user_agent,
)

WIKIDATA_ENTITY_URL = (
    "https://www.wikidata.org/wiki/Special:EntityData"
)

WIKIPEDIA_API_URL = "https://en.wikipedia.org/w/api.php"

COMMONS_API_URL = "https://commons.wikimedia.org/w/api.php"

WIKIDATA_ID_PATTERN = re.compile(r"^Q[1-9][0-9]*$")

HEADERS = {
    "Accept": "application/json",
}


def get_request_headers() -> dict[str, str]:
    return {
        **HEADERS,
        "User-Agent": get_wikimedia_user_agent(),
    }


class WikimediaProviderError(Exception):
    """Raised when Wikimedia image retrieval fails."""


async def fetch_wikimedia_image(
    wikidata_id: str,
) -> dict | None:
    """
    Fetch the primary image of an English Wikipedia article.

    Returns image and attribution metadata when available.
    """

    if not WIKIDATA_ID_PATTERN.fullmatch(wikidata_id):
        raise ValueError(
            f"Invalid Wikidata ID: {wikidata_id}"
        )

    try:
        async with httpx.AsyncClient(
            timeout=30.0,
            follow_redirects=False,
            headers=get_request_headers(),
        ) as client:

            # Step 1: Resolve the exact English Wikipedia article.
            entity_response = await client.get(
                f"{WIKIDATA_ENTITY_URL}/{wikidata_id}.json"
            )
            entity_response.raise_for_status()

            entity = entity_response.json()["entities"][
                wikidata_id
            ]

            article = entity.get(
                "sitelinks", {}
            ).get("enwiki")

            if not article:
                return None

            title = article["title"]

            # Step 2: Retrieve the article's main image.
            image_response = await client.get(
                WIKIPEDIA_API_URL,
                params={
                    "action": "query",
                    "format": "json",
                    "prop": "pageimages",
                    "piprop": "name",
                    "titles": title,
                },
            )
            image_response.raise_for_status()

            pages = image_response.json()["query"]["pages"]

            page = next(iter(pages.values()))

            image_name = page.get("pageimage")

            if not image_name:
                return None

            # Step 3: Retrieve image URL and licensing metadata.
            commons_response = await client.get(
                COMMONS_API_URL,
                params={
                    "action": "query",
                    "format": "json",
                    "prop": "imageinfo",
                    "iiprop": "url|extmetadata",
                    "titles": f"File:{image_name}",
                },
            )
            commons_response.raise_for_status()

            commons_pages = commons_response.json()[
                "query"
            ]["pages"]

            commons_page = next(
                iter(commons_pages.values())
            )

            image_info = commons_page.get(
                "imageinfo", []
            )

            if not image_info:
                return None

            info = image_info[0]

            image_url = info.get("url")

            if not image_url:
                return None

            metadata = info.get("extmetadata", {})

            def metadata_value(key: str) -> str | None:
                value = metadata.get(key, {}).get("value")
                return value if isinstance(value, str) else None

            return {
                "wikidata_id": wikidata_id,
                "wikipedia_title": title,
                "image_url": image_url,
                "image_source": "wikimedia_commons",
                "image_file": image_name,
                "image_page_url": info.get(
                    "descriptionurl"
                ) or (
                    "https://commons.wikimedia.org/wiki/"
                    + quote(f"File:{image_name}".replace(" ", "_"))
                ),
                "artist": metadata_value("Artist"),
                "license": metadata_value("LicenseShortName"),
                "license_url": metadata_value("LicenseUrl"),
                "attribution": metadata_value(
                    "Attribution"
                ),
            }

    except httpx.HTTPError as exc:
        raise WikimediaProviderError(
            f"Wikimedia request failed for {wikidata_id}: {exc}"
        ) from exc

    except (KeyError, TypeError, ValueError, StopIteration) as exc:
        raise WikimediaProviderError(
            f"Invalid Wikimedia response for {wikidata_id}: {exc}"
        ) from exc


async def fetch_curated_wikimedia_image(
    wikidata_id: str,
) -> dict | None:
    """
    Retrieve a curated Wikimedia Commons image for a destination.

    Uses the destination's Wikidata ID to select a reviewed
    Commons filename, then fetches its current image URL
    and licensing metadata.

    Returns None when no curated image is configured.
    """
    if not WIKIDATA_ID_PATTERN.fullmatch(wikidata_id):
        raise ValueError(f"Invalid Wikidata ID: {wikidata_id}")

    filename = get_curated_image_filename(wikidata_id)

    if filename is None:
        return None

    try:
        async with httpx.AsyncClient(
            timeout=30.0,
            follow_redirects=False,
            headers=get_request_headers(),
        ) as client:
            response = await client.get(
                COMMONS_API_URL,
                params={
                    "action": "query",
                    "format": "json",
                    "prop": "imageinfo",
                    "iiprop": "url|extmetadata",
                    "titles": f"File:{filename}",
                },
            )

            response.raise_for_status()

            pages = response.json()["query"]["pages"]
            page = next(iter(pages.values()))

            image_info = page.get("imageinfo", [])

            if not image_info:
                raise WikimediaProviderError(
                    f"Curated Commons image not found: {filename}"
                )

            info = image_info[0]
            image_url = info.get("url")
            image_page_url = info.get("descriptionurl")

            if not image_url or not image_page_url:
                raise WikimediaProviderError(
                    f"Incomplete Commons image metadata: {filename}"
                )

            metadata = info.get("extmetadata", {})

            def metadata_value(key: str) -> str | None:
                value = metadata.get(key, {}).get("value")
                return value if isinstance(value, str) else None

            return {
                "wikidata_id": wikidata_id,
                "wikipedia_title": None,
                "image_url": image_url,
                "image_source": "wikimedia_commons",
                "image_file": filename,
                "image_page_url": image_page_url,
                "artist": metadata_value("Artist"),
                "license": metadata_value("LicenseShortName"),
                "license_url": metadata_value("LicenseUrl"),
                "attribution": metadata_value("Attribution"),
            }

    except httpx.HTTPError as exc:
        raise WikimediaProviderError(
            f"Curated Wikimedia request failed for "
            f"{wikidata_id}: {exc}"
        ) from exc

    except (KeyError, TypeError, ValueError, StopIteration) as exc:
        raise WikimediaProviderError(
            f"Invalid curated Wikimedia response for "
            f"{wikidata_id}: {exc}"
        ) from exc