from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.store import Store
from app.models.user import User
from app.schemas.store import StoreCreateRequest, StoreResponse, StoreDetailResponse
from app.services.store import calculate_business_period

router = APIRouter(
    prefix="/stores",
    tags=["Store"],
)


@router.post(
    "",
    response_model=StoreResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_store(
    request: StoreCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # 이미 가게를 등록한 경우
    existing_store = (
        db.query(Store)
        .filter(Store.user_id == current_user.user_id)
        .first()
    )

    if existing_store:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="이미 등록된 가게가 있습니다.",
        )

    store = Store(
        user_id=current_user.user_id,
        business_name=request.business_name,
        industry_name=request.industry_name,
        business_address=request.business_address,
        open_date=request.open_date,
    )

    db.add(store)
    db.commit()
    db.refresh(store)

    return store

#가게 정보 조회
@router.get(
    "/me",
    response_model=StoreDetailResponse,
)
def get_my_store(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    store = (
        db.query(Store)
        .filter(Store.user_id == current_user.user_id)
        .first()
    )

    if store is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="등록된 가게 정보가 없습니다.",
        )

    business_period = calculate_business_period(store.open_date)

    return {
        "business_name": store.business_name,
        "industry_name": store.industry_name,
        "business_address": store.business_address,
        "open_date": store.open_date,
        "business_period": business_period,
    }