from pydantic import BaseModel, Field


class ImageResult(BaseModel):
  provider: str
  provider_image_id: str

  url: str
  thumbnail_url: str

  alt: str

  photographer_name: str
  photographer_url: str
  attribution_url: str


class PlaceImageRequest(BaseModel):
  key: str = Field(..., min_length=1)
  place_name: str = Field(..., min_length=1)
  destination: str = Field(..., min_length=1)
  country: str | None = None


class PlaceImageBatchRequest(BaseModel):
  places: list[PlaceImageRequest] = Field(
    ...,
    min_length=1,
    max_length=30,
  )


class PlaceImageBatchItem(BaseModel):
  key: str
  image: ImageResult | None


class PlaceImageBatchResponse(BaseModel):
  images: list[PlaceImageBatchItem]