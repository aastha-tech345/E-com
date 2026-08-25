"""Reset the configured development administrator in the active database."""

import sys
from pathlib import Path

# Running this file directly makes ``scripts`` the import root. Add the
# backend directory so the application package resolves consistently.
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.core.config import settings
from app.core.database import SessionLocal
from app.modules.identity.application.schemas import UserLoginRequest
from app.modules.identity.application.service import authenticate_user, ensure_default_admin


def main() -> None:
    session = SessionLocal()
    try:
        ensure_default_admin(session, settings.admin_email, settings.admin_password)
        authenticate_user(
            session,
            UserLoginRequest(email=settings.admin_email, password=settings.admin_password),
        )
        print(f"Admin account reset for {settings.admin_email.strip().lower()}")
        print("Admin login verification passed")
    finally:
        session.close()


if __name__ == "__main__":
    main()
