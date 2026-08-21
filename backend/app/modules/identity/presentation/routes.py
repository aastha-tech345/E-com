from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import ProgrammingError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import Base, engine
from app.core.database import get_db_session
from app.core.rate_limit import build_rate_limiter
from app.core.security import decode_refresh_token
from app.modules.identity.application.schemas import (
    AuthTokenResponse,
    RefreshTokenRequest,
    UserLoginRequest,
    UserProfileResponse,
    UserRegisterRequest,
)
from app.modules.identity.application.service import authenticate_user, ensure_default_admin, register_user, build_auth_response
from app.modules.identity.presentation.dependencies import get_current_user
from app.shared.enums.roles import SystemRole

router = APIRouter(prefix="/auth", tags=["auth"])


@router.on_event("startup")
def bootstrap_admin() -> None:
    from app.core.database import SessionLocal

    session = SessionLocal()
    try:
        ensure_default_admin(session, settings.admin_email, settings.admin_password)
    except ProgrammingError:
        session.rollback()
        if not settings.auto_create_tables:
            raise
        Base.metadata.create_all(bind=engine)
        ensure_default_admin(session, settings.admin_email, settings.admin_password)
    finally:
        session.close()


@router.post("/register", response_model=AuthTokenResponse, status_code=status.HTTP_201_CREATED)
def register(
    payload: UserRegisterRequest,
    _: None = Depends(build_rate_limiter(scope="auth-register", limit=settings.auth_rate_limit)),
    db: Session = Depends(get_db_session),
) -> AuthTokenResponse:
    try:
        return register_user(db, payload)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc


@router.post("/login", response_model=AuthTokenResponse)
def login(
    payload: UserLoginRequest,
    _: None = Depends(build_rate_limiter(scope="auth-login", limit=settings.auth_rate_limit)),
    db: Session = Depends(get_db_session),
) -> AuthTokenResponse:
    try:
        return authenticate_user(db, payload)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(exc)) from exc


@router.post("/register-seller", response_model=AuthTokenResponse, status_code=status.HTTP_201_CREATED)
def register_seller(
    payload: UserRegisterRequest,
    _: None = Depends(build_rate_limiter(scope="auth-register-seller", limit=settings.auth_rate_limit)),
    db: Session = Depends(get_db_session),
) -> AuthTokenResponse:
    try:
        return register_user(db, payload, role=SystemRole.SELLER_OWNER)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc


@router.get("/me", response_model=UserProfileResponse)
def me(current_user: UserProfileResponse = Depends(get_current_user)) -> UserProfileResponse:
    return current_user


@router.post("/refresh", response_model=AuthTokenResponse)
def refresh(
    payload: RefreshTokenRequest,
    db: Session = Depends(get_db_session),
) -> AuthTokenResponse:
    try:
        token_data = decode_refresh_token(payload.refresh_token)
        user_id = token_data.get("sub")
        if not user_id:
            raise ValueError("Invalid refresh token")
        return build_auth_response(db, user_id)
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(exc)) from exc
