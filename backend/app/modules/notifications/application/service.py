from datetime import datetime, timezone

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.modules.notifications.domain.models import Notification


def create_notification(
    db: Session,
    *,
    user_id: str,
    title: str,
    message: str,
    channel: str = "in_app",
) -> Notification:
    notification = Notification(user_id=user_id, title=title, message=message, channel=channel, is_read=False)
    db.add(notification)
    return notification


def list_notifications(db: Session, *, user_id: str) -> list[Notification]:
    return list(
        db.scalars(
            select(Notification).where(Notification.user_id == user_id).order_by(Notification.created_at.desc())
        ).all()
    )


def unread_notification_count(db: Session, *, user_id: str) -> int:
    return db.scalar(
        select(func.count())
        .select_from(Notification)
        .where(Notification.user_id == user_id, Notification.is_read.is_(False))
    ) or 0


def mark_notification_read(db: Session, *, user_id: str, notification_id: str) -> Notification:
    notification = db.scalar(
        select(Notification).where(Notification.id == notification_id, Notification.user_id == user_id)
    )
    if notification is None:
        raise ValueError("Notification not found.")
    notification.is_read = True
    notification.read_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(notification)
    return notification


def mark_all_notifications_read(db: Session, *, user_id: str) -> list[Notification]:
    notifications = list_notifications(db, user_id=user_id)
    now = datetime.now(timezone.utc)
    for notification in notifications:
        notification.is_read = True
        notification.read_at = now
    db.commit()
    return notifications
