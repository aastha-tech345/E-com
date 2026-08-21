from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db_session
from app.modules.background_jobs.application.schemas import BackgroundJobResponse, JobRunSummaryResponse
from app.modules.background_jobs.application.service import list_jobs, process_pending_jobs
from app.modules.background_jobs.domain.models import BackgroundJob
from app.modules.identity.application.schemas import UserProfileResponse
from app.modules.identity.presentation.dependencies import require_roles
from app.shared.enums.roles import SystemRole

router = APIRouter(prefix="/admin/jobs", tags=["background-jobs"])


@router.get("", response_model=list[BackgroundJobResponse])
def jobs(
    _: UserProfileResponse = Depends(require_roles(SystemRole.ADMIN_CATALOG.value, SystemRole.SUPER_ADMIN.value)),
    db: Session = Depends(get_db_session),
) -> list[BackgroundJob]:
    return list_jobs(db)


@router.post("/run-pending", response_model=JobRunSummaryResponse)
def run_pending_jobs(
    _: UserProfileResponse = Depends(require_roles(SystemRole.ADMIN_CATALOG.value, SystemRole.SUPER_ADMIN.value)),
    db: Session = Depends(get_db_session),
) -> JobRunSummaryResponse:
    processed, completed, failed = process_pending_jobs(db)
    return JobRunSummaryResponse(processed=processed, completed=completed, failed=failed)
