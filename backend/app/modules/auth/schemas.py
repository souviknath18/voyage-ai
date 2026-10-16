import uuid

from pydantic import (
  BaseModel,
  EmailStr,
  Field,
  field_validator,
)

class RegisterRequest(BaseModel):
  email: EmailStr
  password: str = Field(
    min_length=8,
    max_length=128,
  )
  full_name: str | None = Field(
    default=None,
    max_length=255,
  )


class UserResponse(BaseModel):
  id: uuid.UUID
  email: EmailStr
  full_name: str | None

  model_config = {
    "from_attributes": True,
  }

class LoginRequest(BaseModel):
  email: EmailStr
  password: str

class UserProfileUpdate(BaseModel):
  full_name: str | None = Field(
    default=None,
    max_length=255,
  )

  @field_validator("full_name")
  @classmethod
  def validate_full_name(
    cls,
    value: str | None,
  ) -> str | None:
    if value is None:
      return None

    value = value.strip()

    if not value:
      raise ValueError(
        "Full name cannot be empty"
      )

    return value

class TokenResponse(BaseModel):
  access_token: str
  token_type: str = "bearer"