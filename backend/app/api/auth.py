from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.user import UserSignupRequest, UserSignupResponse, UserLoginRequest, UserLoginResponse
from app.services.auth import signup_user, login_user
from app.core.config import settings
from app.core.security import ACCESS_TOKEN_COOKIE_NAME, create_access_token

router = APIRouter(
    prefix="/auth",
    tags=["Auth"],
)


def _set_auth_cookie(response: Response, access_token: str) -> None:
    response.set_cookie(
        key=ACCESS_TOKEN_COOKIE_NAME,
        value=access_token,
        max_age=settings.JWT_EXPIRE_MINUTES * 60,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite=settings.COOKIE_SAMESITE,
        path="/",
    )


#회원가입
@router.post(
    "/signup",
    response_model=UserSignupResponse,
    status_code=status.HTTP_201_CREATED,
)
def signup(
    request: UserSignupRequest,
    response: Response,
    db: Session = Depends(get_db),
):
    try:
        user = signup_user(db, request)

        access_token = create_access_token(user.user_id)
        _set_auth_cookie(response, access_token)

        return {
            "user_id": user.user_id,
            "business_reg_no": user.business_reg_no,
            "representative_name": user.representative_name,
            "phone_number": user.phone_number,
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
    response: Response,
    db: Session = Depends(get_db),
):
    try:
        user = login_user(db, request)

        access_token = create_access_token(user.user_id)
        _set_auth_cookie(response, access_token)

        return {
            "user_id": user.user_id,
            "business_reg_no": user.business_reg_no,
            "representative_name": user.representative_name,
        }

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
        )


#로그아웃
@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(response: Response):
    response.delete_cookie(key=ACCESS_TOKEN_COOKIE_NAME, path="/")
