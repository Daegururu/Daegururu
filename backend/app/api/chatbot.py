import logging

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.envelope import ApiError, success
from app.core.security import get_current_user
from app.models import User
from app.schemas.chatbot import ChatMessageRequest
from app.services.chatbot_service import get_chat_reply

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/chatbot", tags=["chatbot"])


@router.post("/messages")
def send_chat_message(
    body: ChatMessageRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        result = get_chat_reply(db, user, body.message)
    except Exception:
        logger.exception("failed to build chatbot reply for user_id=%s", user.user_id)
        raise ApiError(status_code=500, code="CHAT5000", message="답변을 생성하지 못했습니다.")

    return success("CHAT2000", "답변을 생성하였습니다.", result)
