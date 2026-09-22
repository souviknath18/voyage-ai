from fastapi import APIRouter, Depends, Query

from app.modules.auth.dependencies import get_current_user
from app.integrations.images.schemas import (
  ImageResult,
  PlaceImageBatchRequest,
  PlaceImageBatchResponse,
)
from app.integrations.images.service import (
  get_destination_image,
  get_place_image,
  get_place_images_batch,
)
from app.modules.users.models import User


router = APIRouter()


@router.get(
  "/destination",
  response_model=ImageResult | None,
)
async def destination_image(
  destination: str = Query(..., min_length=1),
  country: str | None = None,
  current_user: User = Depends(get_current_user),
):
  return await get_destination_image(
    destination=destination,
    country=country,
  )


@router.get(
  "/place",
  response_model=ImageResult | None,
)
async def place_image(
  place_name: str = Query(..., min_length=1),
  destination: str = Query(..., min_length=1),
  country: str | None = None,
  current_user: User = Depends(get_current_user),
):
  return await get_place_image(
    place_name=place_name,
    destination=destination,
    country=country,
  )


@router.post(
  "/places/batch",
  response_model=PlaceImageBatchResponse,
)
async def place_images_batch(
  payload: PlaceImageBatchRequest,
  current_user: User = Depends(
    get_current_user,
  ),
):
  images = await get_place_images_batch(
    places=payload.places,
  )

  return PlaceImageBatchResponse(
    images=images,
  )