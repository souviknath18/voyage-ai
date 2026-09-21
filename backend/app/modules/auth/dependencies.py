import uuid

from fastapi import Depends, HTTPException, status
from fastapi.security import (
  HTTPAuthorizationCredentials,
  HTTPBearer,
)
from jose import JWTError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import decode_token
from app.db.dependencies import get_db
from app.modules.users.models import User
from app.modules.users.repository import get_user_by_id


bearer_scheme = HTTPBearer()


async def get_current_user(
  credentials: HTTPAuthorizationCredentials = Depends(
    bearer_scheme
  ),
  db: AsyncSession = Depends(get_db),
) -> User:
  credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={
      "WWW-Authenticate": "Bearer",
    },
  )

  token = credentials.credentials

  try:
    payload = decode_token(token)

    token_type = payload.get("type")
    subject = payload.get("sub")

    if token_type != "access":
      raise credentials_exception

    if subject is None:
      raise credentials_exception

    user_id = uuid.UUID(subject)

  except (
    JWTError,
    ValueError,
  ):
    raise credentials_exception

  user = await get_user_by_id(
    db=db,
    user_id=user_id,
  )

  if user is None:
    raise credentials_exception

  return user