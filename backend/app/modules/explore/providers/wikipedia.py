
import re
from urllib.parse import quote

import httpx

from app.modules.explore.providers.http_config import (
    get_wikimedia_user_agent,
)


WIKIDATA_ENTITY_URL = "https://www.wikidata.org/wiki/Special:EntityData"
WIKIPEDIA_SUMMARY_URL = "https://en.wikipedia.org/api/rest_v1/page/summary"

WIKIDATA_ID_PATTERN = re.compile(r"^Q[1-9][0-9]*$")

HEADERS = {
    "Accept": "application/json",
}


def get_request_headers() -> dict[str, str]:
    return {
        **HEADERS,
        "User-Agent": get_wikimedia_user_agent(),
    }


class WikipediaProviderError(Exception):
    pass


async def fetch_wikipedia_summary(
    wikidata_id: str,
) -> dict | None:
    """
    Retrieve an English Wikipedia summary using a Wikidata QID.

    Returns None when no English Wikipedia article or
    usable summary exists.

    Does not write to the database.
    """

    if not WIKIDATA_ID_PATTERN.fullmatch(wikidata_id):
        raise ValueError(f"Invalid Wikidata ID: {wikidata_id}")

    try:
        async with httpx.AsyncClient(
            timeout=30.0,
            follow_redirects=False,
            headers=get_request_headers(),
        ) as client:

            entity_response = await client.get(
                f"{WIKIDATA_ENTITY_URL}/{wikidata_id}.json"
            )
            entity_response.raise_for_status()

            entity_payload = entity_response.json()

            entity = entity_payload["entities"][wikidata_id]

            article = entity.get("sitelinks", {}).get("enwiki")

            if not article:
                return None

            title = article["title"]

            summary_response = await client.get(
                f"{WIKIPEDIA_SUMMARY_URL}/{quote(title, safe='')}"
            )

            if summary_response.status_code == 404:
                return None

            summary_response.raise_for_status()

            summary = summary_response.json()

    except httpx.HTTPError as exc:
        raise WikipediaProviderError(
            f"Wikipedia request failed for {wikidata_id}: {exc}"
        ) from exc

    except (KeyError, TypeError, ValueError) as exc:
        raise WikipediaProviderError(
            f"Invalid Wikipedia response for {wikidata_id}: {exc}"
        ) from exc

    description = summary.get("extract")

    if not isinstance(description, str) or not description.strip():
        return None

    # Confirm the returned article corresponds to the requested entity.
    if summary.get("wikibase_item") != wikidata_id:
        raise WikipediaProviderError(
            f"Wikipedia entity mismatch for {wikidata_id}"
        )

    return {
        "wikidata_id": wikidata_id,
        "description": description.strip(),
        "description_source": "wikipedia",
        "wikipedia_title": title,
    }