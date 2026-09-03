from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.ai.chatbot.assistant import generate_reply
from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.chat import ChatMessage
from app.models.user import User
from app.schemas.chat import ChatMessageCreate, ChatMessageOut

router = APIRouter()


@router.get("", response_model=list[ChatMessageOut])
def history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    stmt = (
        select(ChatMessage)
        .where(ChatMessage.user_id == current_user.user_id)
        .order_by(ChatMessage.created_at)
    )
    return db.scalars(stmt).all()


@router.post("", response_model=ChatMessageOut, status_code=201)
def send_message(
    body: ChatMessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    user_msg = ChatMessage(user_id=current_user.user_id, role="user", content=body.content)
    db.add(user_msg)
    db.commit()

    history_stmt = (
        select(ChatMessage)
        .where(ChatMessage.user_id == current_user.user_id)
        .order_by(ChatMessage.created_at)
    )
    history = db.scalars(history_stmt).all()

    reply_text = generate_reply(db, current_user, history)

    ai_msg = ChatMessage(user_id=current_user.user_id, role="ai", content=reply_text)
    db.add(ai_msg)
    db.commit()
    db.refresh(ai_msg)
    return ai_msg
