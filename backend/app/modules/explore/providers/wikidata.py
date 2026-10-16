
import re

import httpx

from app.modules.explore.providers.http_config import (
    get_wikimedia_user_agent,
)


WIKIDATA_SPARQL_URL = (
  "https://query.wikidata.org/sparql"
)

WIKIDATA_ID_PATTERN = re.compile(
  r"^Q[1-9][0-9]*$"
)


class WikidataProviderError(Exception):
  pass


async def _fetch_destination_batch(
  wikidata_ids: list[str],
) -> list[dict]:
  """
  Fetch destination information from Wikidata.

  This function performs read-only requests.
  It does not write to the database.
  """

  if not wikidata_ids:
    return []

  unique_ids = list(dict.fromkeys(wikidata_ids))

  if len(unique_ids) > 20:
    raise ValueError(
      "Maximum 20 destinations per request."
    )

  for wikidata_id in unique_ids:
    if not WIKIDATA_ID_PATTERN.fullmatch(
      wikidata_id
    ):
      raise ValueError(
        f"Invalid Wikidata ID: {wikidata_id}"
      )

  values = " ".join(
    f"wd:{wikidata_id}"
    for wikidata_id in unique_ids
  )

  
  query = f"""
  SELECT
    ?destination
    ?destinationLabel
    ?coordinates
  WHERE {{
    VALUES ?destination {{ {values} }}

    OPTIONAL {{
      ?destination wdt:P625 ?coordinates.
    }}

    SERVICE wikibase:label {{
      bd:serviceParam
        wikibase:language "en".
    }}
  }}
  """


  headers = {
    "Accept": "application/sparql-results+json",
    "User-Agent": get_wikimedia_user_agent(),
  }

  try:
    async with httpx.AsyncClient(
      timeout=30.0,
      follow_redirects=False,
    ) as client:
      response = await client.get(
        WIKIDATA_SPARQL_URL,
        params={
          "query": query,
          "format": "json",
        },
        headers=headers,
      )

      response.raise_for_status()

      payload = response.json()

  except httpx.HTTPStatusError as exc:
    raise WikidataProviderError(
      f"Wikidata HTTP error: "
      f"{exc.response.status_code} - "
      f"{exc.response.text[:300]}"
    ) from exc

  except httpx.TimeoutException as exc:
    raise WikidataProviderError(
      f"Wikidata request timed out: {exc}"
    ) from exc

  except httpx.RequestError as exc:
    raise WikidataProviderError(
      f"Wikidata connection error: {exc}"
    ) from exc

  except (ValueError, KeyError, TypeError) as exc:
    raise WikidataProviderError(
      f"Invalid Wikidata response: {exc}"
    ) from exc

  results = []

  bindings = payload.get(
    "results", {}
  ).get("bindings", [])

  for item in bindings:
    destination_uri = item[
      "destination"
    ]["value"]

    wikidata_id = destination_uri.rsplit(
      "/", 1
    )[-1]

    results.append({
      "wikidata_id": wikidata_id,
      "name": item.get(
        "destinationLabel", {}
      ).get("value"),
      "country": item.get(
        "countryLabel", {}
      ).get("value"),
      "coordinates": item.get(
        "coordinates", {}
      ).get("value"),
      "source": "wikidata",
    })

  return results

async def fetch_destinations(
    wikidata_ids: list[str],
) -> list[dict]:
    """
    Fetch destinations in sequential batches of 20.

    Preserves the original request limit and removes
    duplicate IDs while maintaining input order.
    """

    unique_ids = list(dict.fromkeys(wikidata_ids))

    if not unique_ids:
        return []

    batch_size = 20
    results: list[dict] = []

    for start in range(0, len(unique_ids), batch_size):
        batch = unique_ids[start:start + batch_size]

        print(
            f"Fetching Wikidata batch "
            f"{start // batch_size + 1} "
            f"({len(batch)} destinations)..."
        )

        batch_results = await _fetch_destination_batch(batch)
        results.extend(batch_results)

    return results


async def fetch_destination_classifications(
    wikidata_ids: list[str],
) -> dict[str, list[dict[str, str]]]:
    """
    Fetch Wikidata 'instance of' (P31) statements.

    Returns classification IDs and English labels,
    grouped by destination Wikidata ID.

    Read-only: does not modify the database.
    """

    unique_ids = list(dict.fromkeys(wikidata_ids))

    if not unique_ids:
        return {}

    for wikidata_id in unique_ids:
        if not WIKIDATA_ID_PATTERN.fullmatch(wikidata_id):
            raise ValueError(
                f"Invalid Wikidata ID: {wikidata_id}"
            )

    classifications = {
        wikidata_id: []
        for wikidata_id in unique_ids
    }

    for start in range(0, len(unique_ids), 20):
        batch = unique_ids[start:start + 20]

        values = " ".join(
            f"wd:{wikidata_id}"
            for wikidata_id in batch
        )

        query = f"""
        SELECT
            ?destination
            ?type
            ?typeLabel
        WHERE {{
            VALUES ?destination {{ {values} }}

            ?destination wdt:P31 ?type.

            SERVICE wikibase:label {{
                bd:serviceParam wikibase:language "en".
            }}
        }}
        """

        headers = {
            "Accept": "application/sparql-results+json",
            "User-Agent": get_wikimedia_user_agent(),
        }

        try:
            async with httpx.AsyncClient(
                timeout=30.0,
                follow_redirects=False,
            ) as client:
                response = await client.get(
                    WIKIDATA_SPARQL_URL,
                    params={
                        "query": query,
                        "format": "json",
                    },
                    headers=headers,
                )

                response.raise_for_status()
                payload = response.json()

        except httpx.HTTPStatusError as exc:
            raise WikidataProviderError(
                f"Wikidata classification HTTP error: "
                f"{exc.response.status_code}"
            ) from exc

        except httpx.RequestError as exc:
            raise WikidataProviderError(
                f"Wikidata classification request failed: {exc}"
            ) from exc

        except (ValueError, KeyError, TypeError) as exc:
            raise WikidataProviderError(
                f"Invalid classification response: {exc}"
            ) from exc

        bindings = payload.get(
            "results", {}
        ).get("bindings", [])

        for item in bindings:
            destination_uri = item["destination"]["value"]
            type_uri = item["type"]["value"]

            destination_id = destination_uri.rsplit("/", 1)[-1]
            type_id = type_uri.rsplit("/", 1)[-1]

            if destination_id not in classifications:
                continue

            entry = {
                "wikidata_id": type_id,
                "label": item.get(
                    "typeLabel", {}
                ).get("value", type_id),
            }

            if entry not in classifications[destination_id]:
                classifications[destination_id].append(entry)

    return classifications