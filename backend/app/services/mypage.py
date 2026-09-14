from sqlalchemy.orm import Session

from app.models.user import User
from app.models.store import Store


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