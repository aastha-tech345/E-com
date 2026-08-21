from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db_session
from app.modules.identity.application.schemas import UserProfileResponse
from app.modules.identity.presentation.dependencies import get_current_user
from app.modules.notifications.application.schemas import NotificationResponse, NotificationUnreadCountResponse
from app.modules.notifications.application.service import (
    list_notifications,
    mark_all_notifications_read,
    mark_notification_read,
    unread_notification_count,
)
from app.modules.notifications.domain.models import Notification

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.get("", response_model=list[NotificationResponse])
def notifications(
    current_user: UserProfileResponse = Depends(get_current_user),
    db: Session = Depends(get_db_session),
) -> list[Notification]:
    return list_notifications(db, user_id=current_user.id)


@router.post("/{notification_id}/read", response_model=NotificationResponse)
def mark_read(
    notification_id: str,
    current_user: UserProfileResponse = Depends(get_current_user),
    db: Session = Depends(get_db_session),
) -> Notification:
    try:
        return mark_notification_read(db, user_id=current_user.id, notification_id=notification_id)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/read-all", response_model=list[NotificationResponse])
def mark_all_read(
    current_user: UserProfileResponse = Depends(get_current_user),
    db: Session = Depends(get_db_session),
) -> list[Notification]:
    return mark_all_notifications_read(db, user_id=current_user.id)


@router.get("/unread-count", response_model=NotificationUnreadCountResponse)
def unread_count(
    current_user: UserProfileResponse = Depends(get_current_user),
    db: Session = Depends(get_db_session),
) -> NotificationUnreadCountResponse:
    return NotificationUnreadCountResponse(unread_count=unread_notification_count(db, user_id=current_user.id))
