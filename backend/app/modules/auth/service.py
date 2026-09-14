from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import hash_password
from app.modules.auth.schemas import RegisterRequest
from app.modules.users.models import User
from app.modules.users.repository import (
  create_user,
  get_user_by_email,
)

from app.core.security import (
  create_access_token,
  hash_password,
  verify_password,
)


async def register_user(
    db: AsyncSession,
    data: RegisterRequest,
) -> User:
  existing_user = await get_user_by_email(
    db=db,
    email=data.email,
  )

  if existing_user:
    raise HTTPException(
      status_code=status.HTTP_409_CONFLICT,
      detail="Email already registered",
    )

  hashed_password = hash_password(
    data.password
  )

  user = await create_user(
    db=db,
    email=data.email,
    hashed_password=hashed_password,
    full_name=data.full_name,
  )

  return user


async def login_user(
  db: AsyncSession,
  email: str,
  password: str,
) -> str:
    user = await get_user_by_email(
      db=db,
      email=email,
    )

    if not user:
      raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid email or password",
      )

    if not verify_password(
      password,
      user.hashed_password,
    ):
      raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid email or password",
      )

    access_token = create_access_token(
      subject=str(user.id)
    )

    return access_token