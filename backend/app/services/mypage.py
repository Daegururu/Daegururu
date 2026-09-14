from sqlalchemy.orm import Session

from app.models.user import User
from app.models.store import Store
from app.services.auth import password_hash

def get_mypage(
    db: Session,
    user_id: int,
):
    return (
        db.query(User, Store)
        .join(Store, User.user_id == Store.user_id)
        .filter(User.user_id == user_id)
        .first()
    )

def change_password(
    db: Session,
    user: User,
    current_password: str,
    new_password: str,
):
    # 현재 비밀번호 확인
    if not password_hash.verify(
        current_password,
        user.password_hash,
    ):
        raise ValueError("현재 비밀번호가 올바르지 않습니다.")

    # 새 비밀번호 해싱
    user.password_hash = password_hash.hash(new_password)

    db.commit()