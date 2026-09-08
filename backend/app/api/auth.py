from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.user import UserSignupRequest, UserSignupResponse, UserLoginRequest, UserLoginResponse
from app.services.auth import signup_user, login_user
from app.core.security import create_access_token

router = APIRouter(
    prefix="/auth",
    tags=["Auth"],
)

#회원가입
@router.post(
    "/signup",
    response_model=UserSignupResponse,
    status_code=status.HTTP_201_CREATED,
)
def signup(
    request: UserSignupRequest,
    db: Session = Depends(get_db),
):
    try:
        user = signup_user(db, request)

        access_token = create_access_token(user.user_id)

        return {
            "user_id": user.user_id,
            "business_reg_no": user.business_reg_no,
            "representative_name": user.representative_name,
            "access_token": access_token,
            "token_type": "bearer",
        }

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(e),
        )


#로그인
@router.post(
    "/login",
    response_model=UserLoginResponse,
)
def login(
    request: UserLoginRequest,
    db: Session = Depends(get_db),
):
    try:
        user = login_user(db, request)

        access_token = create_access_token(user.user_id)

        return {
            "user_id": user.user_id,
            "business_reg_no": user.business_reg_no,
            "representative_name": user.representative_name,
            "access_token": access_token,
            "token_type": "bearer",
        }

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
        )