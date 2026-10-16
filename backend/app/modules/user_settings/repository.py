
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.user_settings.models import UserSettings


async def get_user_settings(
  db: AsyncSession,
  user_id: UUID,
) -> UserSettings | None:
  """Retrieve settings belonging to a user."""

  result = await db.execute(
    select(UserSettings).where(
      UserSettings.user_id == user_id
    )
  )

  return result.scalar_one_or_none()


async def create_user_settings(
  db: AsyncSession,
  user_id: UUID,
) -> UserSettings:
  """Create settings with model defaults."""

  settings = UserSettings(user_id=user_id)

  db.add(settings)

  await db.flush()
  await db.refresh(settings)

  return settings


async def update_user_settings(
  db: AsyncSession,
  settings: UserSettings,
  updates: dict,
) -> UserSettings:
  """Apply validated settings updates."""

  for field, value in updates.items():
    setattr(settings, field, value)

  await db.flush()
  await db.refresh(settings)

  return settings