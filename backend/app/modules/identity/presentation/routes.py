from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError, OperationalError, ProgrammingError
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
    UserProfileUpdateRequest,
    CustomerAddressRequest,
    CustomerAddressResponse,
    UserRegisterRequest,
)
from app.modules.identity.application.service import authenticate_user, ensure_default_admin, register_user, build_auth_response
from app.modules.identity.presentation.dependencies import get_current_user
from app.modules.identity.domain.models import CustomerAddress, User
from app.shared.enums.roles import SystemRole

router = APIRouter(prefix="/auth", tags=["auth"])


@router.on_event("startup")
def bootstrap_admin() -> None:
    from app.core.database import SessionLocal

    # SQLite development databases can predate newly added modules. Create only
    # missing tables; SQLAlchemy leaves existing data untouched.
    if settings.auto_create_tables:
        Base.metadata.create_all(bind=engine)

    session = SessionLocal()
    try:
        ensure_default_admin(session, settings.admin_email, settings.admin_password)
    except (OperationalError, ProgrammingError):
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


@router.put("/me", response_model=UserProfileResponse)
def update_me(payload: UserProfileUpdateRequest, current_user: UserProfileResponse = Depends(get_current_user), db: Session = Depends(get_db_session)) -> UserProfileResponse:
    user = db.get(User, current_user.id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found.")
    user.full_name = payload.full_name.strip()
    user.email = str(payload.email).lower()
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=400, detail="This email address is already in use.") from exc
    return UserProfileResponse(id=user.id, full_name=user.full_name, email=user.email, roles=current_user.roles)


@router.get("/me/addresses", response_model=list[CustomerAddressResponse])
def my_addresses(current_user: UserProfileResponse = Depends(get_current_user), db: Session = Depends(get_db_session)) -> list[CustomerAddress]:
    return list(db.scalars(select(CustomerAddress).where(CustomerAddress.user_id == current_user.id).order_by(CustomerAddress.updated_at.desc())).all())


@router.post("/me/addresses", response_model=CustomerAddressResponse, status_code=status.HTTP_201_CREATED)
def create_my_address(payload: CustomerAddressRequest, current_user: UserProfileResponse = Depends(get_current_user), db: Session = Depends(get_db_session)) -> CustomerAddress:
    address = CustomerAddress(user_id=current_user.id, **payload.model_dump())
    db.add(address)
    db.commit()
    db.refresh(address)
    return address


@router.put("/me/addresses/{address_id}", response_model=CustomerAddressResponse)
def update_my_address(address_id: str, payload: CustomerAddressRequest, current_user: UserProfileResponse = Depends(get_current_user), db: Session = Depends(get_db_session)) -> CustomerAddress:
    address = db.scalar(select(CustomerAddress).where(CustomerAddress.id == address_id, CustomerAddress.user_id == current_user.id))
    if address is None:
        raise HTTPException(status_code=404, detail="Address not found.")
    for key, value in payload.model_dump().items():
        setattr(address, key, value)
    db.commit()
    db.refresh(address)
    return address


@router.delete("/me/addresses/{address_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_my_address(address_id: str, current_user: UserProfileResponse = Depends(get_current_user), db: Session = Depends(get_db_session)) -> None:
    address = db.scalar(select(CustomerAddress).where(CustomerAddress.id == address_id, CustomerAddress.user_id == current_user.id))
    if address is None:
        raise HTTPException(status_code=404, detail="Address not found.")
    db.delete(address)
    db.commit()


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
