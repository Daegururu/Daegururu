from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.schemas.auth import UserOut
from app.schemas.user import NotificationSettingOut, NotificationSettingUpdate

router = APIRouter()


@router.get("/me/notifications", response_model=NotificationSettingOut)
def get_notifications(current_user: User = Depends(get_current_user)):
    return current_user.notification_setting


@router.patch("/me/notifications", response_model=NotificationSettingOut)
def update_notifications(
    body: NotificationSettingUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    setting = current_user.notification_setting
    setting.email = body.email
    setting.email_enabled = body.email_enabled
    db.commit()
    db.refresh(setting)
    return setting


@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
