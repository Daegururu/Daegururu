import logging

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.envelope import ApiError, success
from app.core.security import get_current_user
from app.models import User
from app.services.finance_service import (
    get_external_program_detail,
    get_finance_product_detail,
    get_finance_products,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/finance", tags=["finance"])


@router.get("/products")
def read_finance_products(
    category: str | None = None,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        result = get_finance_products(db, user, category)
    except Exception:
        logger.exception("failed to build finance product list for user_id=%s", user.user_id)
        raise ApiError(status_code=500, code="FIN5000", message="금융 상품 목록을 불러오지 못했습니다.")

    return success("FIN2000", "금융 상품 추천 목록을 조회하였습니다.", result)


@router.get("/products/{product_id}")
def read_finance_product_detail(
    product_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        result = get_finance_product_detail(db, user, product_id)
    except Exception:
        logger.exception("failed to build finance product detail for user_id=%s product_id=%s", user.user_id, product_id)
        raise ApiError(status_code=500, code="FIN5001", message="금융 상품 상세 정보를 불러오지 못했습니다.")

    if result is None:
        raise ApiError(status_code=404, code="FIN4040", message="존재하지 않는 금융 상품입니다.")

    return success("FIN2001", "금융 상품 상세 정보를 조회하였습니다.", result)


@router.get("/external-programs/{program_id}")
def read_external_program_detail(
    program_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        result = get_external_program_detail(db, program_id)
    except Exception:
        logger.exception("failed to build external program detail for user_id=%s program_id=%s", user.user_id, program_id)
        raise ApiError(status_code=500, code="FIN5002", message="지원사업 공고 상세 정보를 불러오지 못했습니다.")

    if result is None:
        raise ApiError(status_code=404, code="FIN4041", message="존재하지 않는 지원사업 공고입니다.")

    return success("FIN2002", "지원사업 공고 상세 정보를 조회하였습니다.", result)
