from pydantic import BaseModel


class NotificationSettingOut(BaseModel):
    email: str | None
    email_enabled: bool

    class Config:
        from_attributes = True


class NotificationSettingUpdate(BaseModel):
    email: str | None = None
    email_enabled: bool
