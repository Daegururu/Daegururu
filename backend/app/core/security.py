from datetime import datetime, timedelta, timezone

from fastapi import Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.core.envelope import ApiError
from app.models.user import User

security = HTTPBearer()


def create_access_token(user_id: int) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.JWT_EXPIRE_MINUTES)

    payload = {
        "user_id": user_id,
        "exp": expire,
    }

    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> User:
    """Authorization: Bearer <accessToken>을 검증하고 User를 반환한다.

    실패 시 팀 공통 envelope(AUTH4010, 401)로 응답한다.
    """
    token = credentials.credentials

    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        user_id = payload.get("user_id")
        if user_id is None:
            raise ApiError(status_code=401, code="AUTH4010", message="유효하지 않은 토큰입니다.")
    except JWTError:
        raise ApiError(status_code=401, code="AUTH4010", message="유효하지 않은 토큰입니다.")

    user = db.query(User).filter(User.user_id == user_id).first()
    if user is None:
        raise ApiError(status_code=401, code="AUTH4010", message="사용자를 찾을 수 없습니다.")

    return user
