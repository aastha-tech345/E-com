from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.core.security import create_access_token, create_refresh_token, hash_password, verify_password
from app.modules.identity.application.schemas import (
    AuthTokenResponse,
    UserLoginRequest,
    UserProfileResponse,
    UserRegisterRequest,
)
from app.modules.identity.domain.models import Role, User, UserRole
from app.shared.enums.roles import SystemRole


def normalize_email(email: str) -> str:
    return email.strip().lower()


def ensure_system_roles(db: Session) -> None:
    existing = {role.name for role in db.scalars(select(Role)).all()}
    for role_name in SystemRole:
        if role_name.value not in existing:
            db.add(Role(name=role_name.value, description=f"System role: {role_name.value}"))
    db.commit()


def ensure_default_admin(db: Session, admin_email: str, admin_password: str) -> None:
    ensure_system_roles(db)
    normalized_email = normalize_email(admin_email)
    existing_admin = db.scalar(select(User).where(User.email == normalized_email))
    if existing_admin is None:
        user = User(email=normalized_email, full_name="Platform Admin", hashed_password=hash_password(admin_password))
        db.add(user)
        db.flush()
    else:
        user = existing_admin
        user.email = normalized_email
        user.full_name = "Platform Admin"
        user.hashed_password = hash_password(admin_password)
        user.is_active = True

    admin_role = db.scalar(select(Role).where(Role.name == SystemRole.SUPER_ADMIN.value))
    has_admin_role = any(link.role_id == admin_role.id for link in user.roles) if admin_role is not None else False
    if admin_role is not None and not has_admin_role:
        db.add(UserRole(user_id=user.id, role_id=admin_role.id))
    db.commit()


def register_user(
    db: Session,
    payload: UserRegisterRequest,
    *,
    role: SystemRole = SystemRole.CUSTOMER,
) -> AuthTokenResponse:
    ensure_system_roles(db)
    normalized_email = normalize_email(str(payload.email))
    if db.scalar(select(User).where(User.email == normalized_email)):
        raise ValueError("A user with this email already exists.")

    user = User(
        email=normalized_email,
        full_name=payload.full_name.strip(),
        hashed_password=hash_password(payload.password),
    )
    db.add(user)
    db.flush()

    assigned_role = db.scalar(select(Role).where(Role.name == role.value))
    if assigned_role is None:
        raise ValueError(f"{role.value} role is not configured.")
    db.add(UserRole(user_id=user.id, role_id=assigned_role.id))
    db.commit()
    db.refresh(user)
    return build_auth_response(db, user.id)


def authenticate_user(db: Session, payload: UserLoginRequest) -> AuthTokenResponse:
    normalized_email = normalize_email(str(payload.email))
    user = db.scalar(select(User).where(User.email == normalized_email))
    if user is None or not verify_password(payload.password, user.hashed_password):
        raise ValueError("Invalid credentials.")
    if not user.is_active:
        raise ValueError("User is inactive.")
    return build_auth_response(db, user.id)


def get_user_profile(db: Session, user_id: str) -> UserProfileResponse:
    user = db.scalar(
        select(User)
        .options(joinedload(User.roles).joinedload(UserRole.role))
        .where(User.id == user_id)
    )
    if user is None:
        raise ValueError("User not found.")
    return UserProfileResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        roles=[link.role.name for link in user.roles],
    )


def build_auth_response(db: Session, user_id: str) -> AuthTokenResponse:
    profile = get_user_profile(db, user_id)
    access_token = create_access_token(subject=profile.id, extra={"roles": profile.roles, "email": profile.email})
    refresh_token = create_refresh_token(subject=profile.id)
    return AuthTokenResponse(access_token=access_token, refresh_token=refresh_token, user=profile)
