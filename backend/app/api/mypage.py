from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.mypage import MyPageResponse
from app.services.mypage import get_mypage


router = APIRouter(
    prefix="/mypage",
    tags=["MyPage"],
)


@router.get(
    "",
    response_model=MyPageResponse,
)
def mypage(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    result = get_mypage(db, current_user.user_id)

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="마이페이지 정보를 찾을 수 없습니다.",
        )

    user, store = result

    return {
        "store": {
            "business_name": store.business_name,
            "industry_name": store.industry_name,
            "business_address": store.business_address,
            "open_date": store.open_date,
        },
        "business_verification": {
            "business_reg_no": user.business_reg_no,
            "representative_name": user.representative_name,
            "industry_name": store.industry_name,
        },
        "account": {
            "login_id": user.business_reg_no,
            "phone_number": user.phone_number,
        },
    }