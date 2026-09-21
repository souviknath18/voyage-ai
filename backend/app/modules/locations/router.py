from fastapi import (
  APIRouter,
  Query,
)

from app.modules.locations.schemas import (
  LocationSearchResult,
)
from app.modules.locations.service import (
    search_location_suggestions,
)


router = APIRouter()


@router.get(
  "/locations/search",
  response_model=list[LocationSearchResult],
)
async def search_locations_endpoint(
  query: str = Query(
    ...,
    min_length=2,
    max_length=100,
  ),
):
  return await search_location_suggestions(
    query=query,
  )