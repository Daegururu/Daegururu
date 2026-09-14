import logging

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.envelope import ApiError, success
from app.core.security import get_current_user
from app.models import User
from app.schemas.sales import TransactionCreateRequest
from app.services.sales_service import PAGE_SIZE, create_transaction, get_sales_summary, list_transactions

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/sales", tags=["Sales"])


@router.get("/transactions")
def read_transactions(
    month: str = Query(..., description="YYYY-MM"),
    category: str = Query("all", description="all | sales | expense | other"),
    settlement: str = Query("all", description="all | completed | scheduled | unsettled | none | withdrawn"),
    page: int = Query(1, ge=1),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        rows, total_count = list_transactions(db, user, month, category, settlement, page)
    except ApiError:
        raise
    except Exception:
        logger.exception("failed to list transactions for user_id=%s", user.user_id)
        raise ApiError(status_code=500, code="SALES5000", message="거래 내역을 불러오지 못했습니다.")

    total_pages = max(1, -(-total_count // PAGE_SIZE))
    result = {"items": rows, "page": page, "totalPages": total_pages, "totalCount": total_count}
    return success("SALES2000", "거래 내역을 조회하였습니다.", result)


@router.get("/summary")
def read_summary(
    month: str = Query(..., description="YYYY-MM"),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        items = get_sales_summary(db, user, month)
    except ApiError:
        raise
    except Exception:
        logger.exception("failed to build sales summary for user_id=%s", user.user_id)
        raise ApiError(status_code=500, code="SALES5001", message="매출 요약을 불러오지 못했습니다.")

    return success("SALES2001", "매출 요약을 조회하였습니다.", {"items": items})


@router.post("/transactions")
def add_transaction(
    payload: TransactionCreateRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        result = create_transaction(db, user, payload)
    except ApiError:
        raise
    except Exception:
        logger.exception("failed to create transaction for user_id=%s", user.user_id)
        raise ApiError(status_code=500, code="SALES5002", message="거래를 추가하지 못했습니다.")

    return success("SALES2002", "거래를 추가하였습니다.", result)
