from fastapi import (
  APIRouter,
  Depends,
  Query,
  Response,
)

from sqlalchemy.ext.asyncio import (
  AsyncSession,
)

from app.db.dependencies import (
  get_db,
)

from app.modules.auth.dependencies import (
  get_current_user,
)

from app.modules.map_previews.service import (
  get_trip_map_preview,
)

from app.modules.users.models import (
  User,
)


router = APIRouter()


@router.get(
  "/{trip_id}/map-preview",
)
async def get_map_preview(
  trip_id: str,

  day: int = Query(
    ...,
    ge=1,
  ),

  db: AsyncSession = Depends(
    get_db
  ),

  current_user: User = Depends(
    get_current_user
  ),
):
  image_bytes, content_type = (
    await get_trip_map_preview(
      db=db,

      public_trip_id=trip_id,

      user_id=current_user.id,

      day_number=day,
    )
  )


  return Response(
    content=image_bytes,

    media_type=content_type,

    headers={
      "Cache-Control": (
        "private, max-age=300"
      ),
    },
  )