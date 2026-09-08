import jwt
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.core.envelope import ApiError
from app.models import User

_bearer_scheme = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    """Authorization: Bearer <accessToken>을 검증하고 User를 반환한다.

    실패 시 팀 공통 envelope(AUTH4010, 401)로 응답한다.
    """
    if credentials is None:
        raise ApiError(status_code=401, code="AUTH4010", message="인증 정보가 유효하지 않습니다.")

    try:
        payload = jwt.decode(credentials.credentials, settings.SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        user_id = int(payload["sub"])
    except (jwt.PyJWTError, KeyError, ValueError):
        raise ApiError(status_code=401, code="AUTH4010", message="인증 정보가 유효하지 않습니다.")

    user = db.get(User, user_id)
    if user is None:
        raise ApiError(status_code=401, code="AUTH4010", message="인증 정보가 유효하지 않습니다.")

    return user
