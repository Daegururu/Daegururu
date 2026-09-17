from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import ACCESS_TOKEN_COOKIE_NAME, get_current_user
from app.models.user import User
from app.schemas.mypage import (
    AccountDeleteRequest,
    AccountDeleteResponse,
    MyPageResponse,
    PasswordChangeRequest,
    PasswordChangeResponse,
    StoreUpdateRequest,
    StoreUpdateResponse,
)
from app.services.mypage import get_mypage, change_password, update_store, delete_account


router = APIRouter(
    prefix="/mypage",
    tags=["MyPage"],
)

#마이페이지 조회
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

#비밀번호 변경
@router.patch(
    "/password",
    response_model=PasswordChangeResponse,
)
def update_password(
    request: PasswordChangeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        change_password(
            db=db,
            user=current_user,
            current_password=request.current_password,
            new_password=request.new_password,
        )

        return {
            "message": "비밀번호가 변경되었습니다."
        }

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )
        
# 가게 정보 수정
@router.patch(
    "/store",
    response_model=StoreUpdateResponse,
)
def update_store_info(
    request: StoreUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        store = update_store(
            db=db,
            user_id=current_user.user_id,
            business_name=request.business_name,
            industry_name=request.industry_name,
            business_address=request.business_address,
            open_date=request.open_date,
        )

        return {
            "message": "가게 정보가 수정되었습니다.",
            "store": {
                "business_name": store.business_name,
                "industry_name": store.industry_name,
                "business_address": store.business_address,
                "open_date": store.open_date,
            },
        }

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )

# 회원 탈퇴
@router.delete(
    "/account",
    response_model=AccountDeleteResponse,
)
def delete_my_account(
    request: AccountDeleteRequest,
    response: Response,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        delete_account(db, current_user, request.password)
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )

    # 탈퇴한 계정의 세션 쿠키도 지운다.
    response.delete_cookie(key=ACCESS_TOKEN_COOKIE_NAME, path="/")

    return {
        "message": "회원 탈퇴가 완료되었습니다."
    }