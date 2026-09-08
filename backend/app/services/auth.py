from pwdlib import PasswordHash
from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import UserSignupRequest, UserLoginRequest


password_hash = PasswordHash.recommended()

#회원가입
def signup_user(db: Session, request: UserSignupRequest) -> User:
    # 사업자등록번호 중복 확인
    existing_user = (
        db.query(User)
        .filter(User.business_reg_no == request.business_reg_no)
        .first()
    )

    if existing_user:
        raise ValueError("이미 가입된 사업자등록번호입니다.")

    # 비밀번호 해싱
    hashed_password = password_hash.hash(request.password)

    user = User(
        business_reg_no=request.business_reg_no,
        representative_name=request.representative_name,
        password_hash=hashed_password,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user

    
#로그인
def login_user(db: Session, request: UserLoginRequest) -> User:
    user = (
        db.query(User)
        .filter(User.business_reg_no == request.business_reg_no)
        .first()
    )

    if not user:
        raise ValueError("사업자등록번호 또는 비밀번호가 올바르지 않습니다.")

    if not password_hash.verify(request.password, user.password_hash):
        raise ValueError("사업자등록번호 또는 비밀번호가 올바르지 않습니다.")

    return user