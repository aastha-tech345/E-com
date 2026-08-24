"""
Permission checking and authorization service.
"""

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modules.identity.domain.models import User, Role
from app.shared.models.permissions import Permission, PERMISSION_SETS


def get_user_permissions(db: Session, user_id: str) -> set[Permission]:
    """Get all permissions for a user based on their roles."""
    user = db.scalar(
        select(User)
        .join(User.roles)
        .where(User.id == user_id)
    )

    if not user:
        return set()

    permissions: set[Permission] = set()
    for role_link in user.roles:
        role_name = role_link.role.name.lower()
        if role_name in PERMISSION_SETS:
            permissions.update(PERMISSION_SETS[role_name])

    return permissions


def has_permission(db: Session, user_id: str, permission: Permission) -> bool:
    """Check if user has a specific permission."""
    permissions = get_user_permissions(db, user_id)
    return permission in permissions


def has_any_permission(db: Session, user_id: str, permissions: list[Permission]) -> bool:
    """Check if user has any of the specified permissions."""
    user_permissions = get_user_permissions(db, user_id)
    return any(perm in user_permissions for perm in permissions)


def has_all_permissions(db: Session, user_id: str, permissions: list[Permission]) -> bool:
    """Check if user has all of the specified permissions."""
    user_permissions = get_user_permissions(db, user_id)
    return all(perm in user_permissions for perm in permissions)


def require_permission(db: Session, user_id: str, permission: Permission) -> None:
    """
    Raise an exception if user doesn't have the permission.
    Use this in route handlers for permission enforcement.
    """
    if not has_permission(db, user_id, permission):
        raise PermissionError(f"User does not have permission: {permission.value}")


def require_any_permission(db: Session, user_id: str, permissions: list[Permission]) -> None:
    """Raise an exception if user doesn't have any of the permissions."""
    if not has_any_permission(db, user_id, permissions):
        raise PermissionError(f"User does not have any of the required permissions")


def require_all_permissions(db: Session, user_id: str, permissions: list[Permission]) -> None:
    """Raise an exception if user doesn't have all of the permissions."""
    if not has_all_permissions(db, user_id, permissions):
        raise PermissionError(f"User does not have all required permissions")
