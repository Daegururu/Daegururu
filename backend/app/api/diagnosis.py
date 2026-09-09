import logging

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.envelope import ApiError, success
from app.core.security import get_current_user
from app.models import User
from app.services import diagnosis_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/diagnosis", tags=["diagnosis"])


@router.get("/report")
def read_diagnosis_report(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        result = diagnosis_service.get_diagnosis_report(db, user)
    except Exception:
        logger.exception("failed to build diagnosis report for user_id=%s", user.id)
        raise ApiError(status_code=500, code="DIAG5000", message="진단 리포트를 불러오지 못했습니다.")

    if result["hasReport"]:
        return success("DIAG2000", "진단 리포트를 조회하였습니다.", result)
    return success("DIAG2001", "진단 이력이 없습니다.", result)


@router.get("/report/sales")
def read_diagnosis_sales(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        result = diagnosis_service.get_sales_tab(db, user)
    except Exception:
        logger.exception("failed to build sales tab for user_id=%s", user.id)
        raise ApiError(status_code=500, code="DIAGSALES5000", message="매출 추이 데이터를 불러오지 못했습니다.")

    return success("DIAGSALES2000", "매출 추이 데이터를 조회하였습니다.", result)


@router.get("/report/fixed-cost")
def read_diagnosis_fixed_cost(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        result = diagnosis_service.get_fixed_cost_tab(db, user)
    except Exception:
        logger.exception("failed to build fixed-cost tab for user_id=%s", user.id)
        raise ApiError(status_code=500, code="DIAGCOST5000", message="고정비 데이터를 불러오지 못했습니다.")

    return success("DIAGCOST2000", "고정비 데이터를 조회하였습니다.", result)


@router.get("/report/cashflow")
def read_diagnosis_cashflow(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        result = diagnosis_service.get_cashflow_tab(db, user)
    except Exception:
        logger.exception("failed to build cashflow tab for user_id=%s", user.id)
        raise ApiError(status_code=500, code="DIAGCASH5000", message="현금흐름 데이터를 불러오지 못했습니다.")

    return success("DIAGCASH2000", "현금흐름 데이터를 조회하였습니다.", result)


@router.get("/report/settlement")
def read_diagnosis_settlement(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        result = diagnosis_service.get_settlement_tab(db, user)
    except Exception:
        logger.exception("failed to build settlement tab for user_id=%s", user.id)
        raise ApiError(status_code=500, code="DIAGSETL5000", message="정산 데이터를 불러오지 못했습니다.")

    return success("DIAGSETL2000", "정산 데이터를 조회하였습니다.", result)
