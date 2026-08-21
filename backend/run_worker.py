from time import sleep

from app.core.database import SessionLocal
from app.modules.background_jobs.application.service import process_pending_jobs


def main() -> None:
    while True:
        session = SessionLocal()
        try:
            process_pending_jobs(session, limit=25)
        finally:
            session.close()
        sleep(2)


if __name__ == "__main__":
    main()
