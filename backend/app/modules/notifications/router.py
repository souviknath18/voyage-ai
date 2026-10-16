
import uuid

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.dependencies import get_db
from app.modules.auth.dependencies import get_current_user
from app.modules.users.models import User

from app.modules.notifications.schemas import (
  NotificationListResponse,
  NotificationMarkAllReadResponse,
  NotificationResponse,
  NotificationUnreadCountResponse,
)

from app.modules.notifications.service import (
  get_user_unread_count,
  list_user_notifications,
  mark_all_user_notifications_read,
  mark_user_notification_read,
)


router = APIRouter()


@router.get(
  "",
  response_model=NotificationListResponse,
)
async def get_notifications(
  limit: int = Query(default=20, ge=1, le=100),
  offset: int = Query(default=0, ge=0),
  unread_only: bool = Query(default=False),
  db: AsyncSession = Depends(get_db),
  current_user: User = Depends(get_current_user),
):
  return await list_user_notifications(
    db=db,
    user_id=current_user.id,
    limit=limit,
    offset=offset,
    unread_only=unread_only,
  )


@router.get(
  "/unread-count",
  response_model=NotificationUnreadCountResponse,
)
async def get_unread_count(
  db: AsyncSession = Depends(get_db),
  current_user: User = Depends(get_current_user),
):
  return await get_user_unread_count(
    db=db,
    user_id=current_user.id,
  )


@router.patch(
  "/read-all",
  response_model=NotificationMarkAllReadResponse,
)
async def mark_all_read(
  db: AsyncSession = Depends(get_db),
  current_user: User = Depends(get_current_user),
):
  return await mark_all_user_notifications_read(
    db=db,
    user_id=current_user.id,
  )


@router.patch(
  "/{notification_id}/read",
  response_model=NotificationResponse,
)
async def mark_read(
  notification_id: uuid.UUID,
  db: AsyncSession = Depends(get_db),
  current_user: User = Depends(get_current_user),
):
  return await mark_user_notification_read(
    db=db,
    notification_id=notification_id,
    user_id=current_user.id,
  )