from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.user import UserSignupRequest, UserSignupResponse
from app.services.auth import signup_user


router = APIRouter(
    prefix="/auth",
    tags=["Auth"],
)


@router.post(
    "/signup",
    response_model=UserSignupResponse,
    status_code=status.HTTP_201_CREATED,
)
def signup(
    request: UserSignupRequest,
    db: Session = Depends(get_db),
):
    try:
        user = signup_user(db, request)
        return user

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(e),
        )