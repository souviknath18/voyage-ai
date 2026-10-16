
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.user_settings.models import UserSettings
from app.modules.user_settings.repository import (
  create_user_settings,
  get_user_settings,
  update_user_settings,
)
from app.modules.user_settings.schemas import (
  UserSettingsUpdate,
)


NULLABLE_FIELDS = {
  "phone",
  "home_city",
  "preferred_airport",
}


async def get_or_create_user_settings(
  db: AsyncSession,
  user_id: UUID,
) -> UserSettings:
  """Return existing settings or create defaults."""

  settings = await get_user_settings(
    db=db,
    user_id=user_id,
  )

  if settings is not None:
    return settings

  try:
    # Savepoint allows recovery from a concurrent
    # insert without invalidating the outer transaction.
    async with db.begin_nested():
      settings = await create_user_settings(
        db=db,
        user_id=user_id,
      )

  except IntegrityError:
    # Another request may have created the row.
    settings = await get_user_settings(
      db=db,
      user_id=user_id,
    )

    if settings is None:
      raise

    return settings

  await db.commit()
  await db.refresh(settings)

  return settings


async def get_current_user_settings(
  db: AsyncSession,
  user_id: UUID,
) -> UserSettings:
  """Retrieve settings for the authenticated user."""

  return await get_or_create_user_settings(
    db=db,
    user_id=user_id,
  )


async def save_user_settings(
  db: AsyncSession,
  user_id: UUID,
  payload: UserSettingsUpdate,
) -> UserSettings:
  """Update account-wide preferences."""

  updates = payload.model_dump(
    exclude_unset=True,
  )

  invalid_null_fields = [
    field
    for field, value in updates.items()
    if value is None
    and field not in NULLABLE_FIELDS
  ]

  if invalid_null_fields:
    raise HTTPException(
      status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
      detail=(
        "Null is not allowed for: "
        + ", ".join(sorted(invalid_null_fields))
      ),
    )

  settings = await get_or_create_user_settings(
    db=db,
    user_id=user_id,
  )

  if not updates:
    return settings

  try:
    settings = await update_user_settings(
      db=db,
      settings=settings,
      updates=updates,
    )

    await db.commit()
    await db.refresh(settings)

    return settings

  except Exception:
    await db.rollback()
    raise