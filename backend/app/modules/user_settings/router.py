
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.dependencies import get_db
from app.modules.auth.dependencies import get_current_user
from app.modules.users.models import User

from app.modules.user_settings.schemas import (
  UserSettingsResponse,
  UserSettingsUpdate,
)

from app.modules.user_settings.service import (
  get_current_user_settings,
  save_user_settings,
)


router = APIRouter()


@router.get(
  "",
  response_model=UserSettingsResponse,
)
async def get_settings(
  db: AsyncSession = Depends(get_db),
  current_user: User = Depends(get_current_user),
):
  """
  Retrieve settings for the authenticated user.

  Default settings are created automatically
  when the user accesses this endpoint
  for the first time.
  """

  return await get_current_user_settings(
    db=db,
    user_id=current_user.id,
  )


@router.patch(
  "",
  response_model=UserSettingsResponse,
)
async def update_settings(
  payload: UserSettingsUpdate,
  db: AsyncSession = Depends(get_db),
  current_user: User = Depends(get_current_user),
):
  """
  Update the authenticated user's settings.

  Only fields included in the request body
  are modified.
  """

  return await save_user_settings(
    db=db,
    user_id=current_user.id,
    payload=payload,
  )