from app.core.config import settings
from app.core.database import SessionLocal
from app.modules.catalog.application.service import seed_catalog
from app.modules.identity.application.service import ensure_default_admin


def main() -> None:
    session = SessionLocal()
    try:
        ensure_default_admin(session, settings.admin_email, settings.admin_password)
        summary = seed_catalog(session)
        print("Catalog seed completed")
        print(f"categories_created={summary.categories_created}")
        print(f"brands_created={summary.brands_created}")
        print(f"products_created={summary.products_created}")
        print(f"products_skipped={summary.products_skipped}")
    finally:
        session.close()


if __name__ == "__main__":
    main()
