from app.ai.tools.location import (
  search_locations,
)


async def search_location_suggestions(
  query: str,
) -> list[dict]:
  query = query.strip()

  if len(query) < 2:
    return []

  return await search_locations(
    destination=query,
  )