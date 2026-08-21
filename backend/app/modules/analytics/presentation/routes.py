from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db_session
from app.modules.analytics.application.schemas import AnalyticsSummaryResponse
from app.modules.analytics.application.service import analytics_summary_cached
from app.modules.identity.application.schemas import UserProfileResponse
from app.modules.identity.presentation.dependencies import require_roles
from app.shared.enums.roles import SystemRole

router = APIRouter(prefix="/admin/analytics", tags=["analytics"])


@router.get("/summary", response_model=AnalyticsSummaryResponse)
def summary(
    _: UserProfileResponse = Depends(require_roles(SystemRole.ADMIN_CATALOG.value, SystemRole.SUPER_ADMIN.value)),
    db: Session = Depends(get_db_session),
) -> AnalyticsSummaryResponse:
    return analytics_summary_cached(db)
