import logging

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.envelope import ApiError, success
from app.core.security import get_current_user
from app.models import User
from app.services.dashboard_service import get_dashboard_summary

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/summary")
def read_dashboard_summary(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        result = get_dashboard_summary(db, user)
    except Exception:
        logger.exception("failed to build dashboard summary for user_id=%s", user.id)
        raise ApiError(status_code=500, code="DASH5000", message="대시보드 데이터를 불러오지 못했습니다.")

    if result["hasReport"]:
        return success("DASH2000", "홈 대시보드 데이터를 조회하였습니다.", result)
    return success("DASH2001", "진단 이력이 없습니다.", result)
