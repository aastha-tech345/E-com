from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserRegisterRequest(BaseModel):
    email: EmailStr
    full_name: str = Field(min_length=2, max_length=120)
    password: str = Field(min_length=8, max_length=128)


class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class UserProfileResponse(BaseModel):
    id: str
    email: EmailStr
    full_name: str
    roles: list[str]


class AuthTokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserProfileResponse


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class UserProfileUpdateRequest(BaseModel):
    full_name: str = Field(min_length=2, max_length=120)
    email: EmailStr


class CustomerAddressRequest(BaseModel):
    recipient_name: str = Field(min_length=2, max_length=120)
    line1: str = Field(min_length=5, max_length=255)
    city: str = Field(min_length=2, max_length=120)
    state: str = Field(min_length=2, max_length=120)
    postal_code: str = Field(min_length=4, max_length=20)


class CustomerAddressResponse(CustomerAddressRequest):
    model_config = ConfigDict(from_attributes=True)

    id: str
    created_at: datetime
    updated_at: datetime
