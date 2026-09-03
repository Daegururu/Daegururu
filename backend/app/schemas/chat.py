from datetime import datetime

from pydantic import BaseModel


class ChatMessageCreate(BaseModel):
    content: str


class ChatMessageOut(BaseModel):
    message_id: int
    role: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True
