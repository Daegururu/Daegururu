from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.core.security import create_access_token, hash_password, verify_password
from app.models.user import NotificationSetting, User
from app.schemas.auth import LoginRequest, RegisterRequest, UserOut

router = APIRouter()

COOKIE_KWARGS = {
    "httponly": True,
    "samesite": "lax",
    "max_age": 60 * 60 * 24 * 7,
}


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(body: RegisterRequest, response: Response, db: Session = Depends(get_db)):
    exists = db.scalar(
        select(User).where(
            (User.login_id == body.login_id) | (User.business_reg_no == body.business_reg_no)
        )
    )
    if exists:
        raise HTTPException(status.HTTP_409_CONFLICT, "이미 등록된 계정 또는 사업자번호입니다.")

    user = User(
        business_reg_no=body.business_reg_no,
        business_name=body.business_name,
        representative_name=body.representative_name,
        industry_code=body.industry_code,
        region_code=body.region_code,
        open_date=body.open_date,
        login_id=body.login_id,
        password_hash=hash_password(body.password),
        phone=body.phone,
    )
    db.add(user)
    db.flush()
    db.add(NotificationSetting(user_id=user.user_id))
    db.commit()
    db.refresh(user)

    token = create_access_token(user.user_id)
    response.set_cookie("access_token", token, **COOKIE_KWARGS)
    return user


@router.post("/login", response_model=UserOut)
def login(body: LoginRequest, response: Response, db: Session = Depends(get_db)):
    user = db.scalar(select(User).where(User.login_id == body.login_id))
    if not user or not verify_password(body.password, user.password_hash):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "아이디 또는 비밀번호가 올바르지 않습니다.")

    token = create_access_token(user.user_id)
    response.set_cookie("access_token", token, **COOKIE_KWARGS)
    return user


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(response: Response):
    response.delete_cookie("access_token")


@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)):
    return current_user
