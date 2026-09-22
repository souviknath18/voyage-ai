import uuid
from fastapi import (
  APIRouter,
  Depends,
  HTTPException,
  Request,
  Response,
  status,
)
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.security import (
  create_access_token,
  create_refresh_token,
  decode_token,
)
from app.db.dependencies import get_db
from app.modules.auth.dependencies import get_current_user
from app.modules.users.repository import get_user_by_id
from app.modules.auth.schemas import (
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  UserResponse,
)
from app.modules.auth.service import (
  login_user,
  register_user,
)
from app.modules.users.models import User
from jose import JWTError


router = APIRouter()


@router.post(
  "/register",
  response_model=UserResponse,
  status_code=status.HTTP_201_CREATED,
)
async def register(
  data: RegisterRequest,
  db: AsyncSession = Depends(get_db),
):
  user = await register_user(
    db=db,
    data=data,
  )

  return user


@router.post(
  "/login",
  response_model=TokenResponse,
)
async def login(
  data: LoginRequest,
  response: Response,
  db: AsyncSession = Depends(get_db),
):
  access_token, user = await login_user(
    db=db,
    email=data.email,
    password=data.password,
  )

  refresh_token = create_refresh_token(
    subject=str(user.id),
  )

  response.set_cookie(
    key="refresh_token",
    value=refresh_token,
    httponly=True,
    secure=settings.environment == "production",
    samesite="lax",
    max_age=settings.refresh_token_expire_days * 24 * 60 * 60,
    path="/api/v1/auth",
  )

  return TokenResponse(
    access_token=access_token,
    token_type="bearer",
  )


@router.post(
  "/refresh",
  response_model=TokenResponse,
)
async def refresh_access_token(
  request: Request,
  db: AsyncSession = Depends(get_db),
):
  refresh_token = request.cookies.get(
    "refresh_token"
  )

  if not refresh_token:
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
      detail="Refresh token missing",
    )

  try:
    payload = decode_token(
      refresh_token
    )

    token_type = payload.get(
      "type"
    )

    subject = payload.get(
      "sub"
    )

    if (
      token_type != "refresh"
      or not subject
    ):
      raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid refresh token",
      )

    user_id = uuid.UUID(
      subject
    )

  except (
    JWTError,
    ValueError,
  ):
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
      detail="Invalid or expired refresh token",
    )

  user = await get_user_by_id(
    db=db,
    user_id=user_id,
  )

  if user is None:
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
      detail="User no longer exists",
    )

  access_token = create_access_token(
    subject=str(user.id)
  )

  return TokenResponse(
    access_token=access_token,
    token_type="bearer",
  )


@router.post(
  "/logout",
  status_code=status.HTTP_200_OK,
)
async def logout(
  response: Response,
):
  response.delete_cookie(
    key="refresh_token",
    path="/api/v1/auth",
    secure=settings.environment == "production",
    samesite="lax",
    httponly=True,
  )

  return {
    "message": "Logged out successfully"
  }


@router.get(
  "/me",
  response_model=UserResponse,
)
async def get_me(
  current_user: User = Depends(
    get_current_user
  ),
):
  return current_user