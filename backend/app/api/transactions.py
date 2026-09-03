from datetime import date
from decimal import Decimal

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.transaction import Transaction
from app.models.user import User
from app.schemas.transaction import TransactionCreate, TransactionOut, TransactionSummary

router = APIRouter()


@router.get("", response_model=list[TransactionOut])
def list_transactions(
    date_from: date | None = None,
    date_to: date | None = None,
    type: str | None = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    stmt = select(Transaction).where(Transaction.user_id == current_user.user_id)
    if date_from:
        stmt = stmt.where(Transaction.date >= date_from)
    if date_to:
        stmt = stmt.where(Transaction.date <= date_to)
    if type:
        stmt = stmt.where(Transaction.type == type)
    stmt = stmt.order_by(Transaction.date.desc())
    return db.scalars(stmt).all()


@router.get("/summary", response_model=TransactionSummary)
def summary(
    date_from: date | None = None,
    date_to: date | None = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    stmt = select(Transaction).where(Transaction.user_id == current_user.user_id)
    if date_from:
        stmt = stmt.where(Transaction.date >= date_from)
    if date_to:
        stmt = stmt.where(Transaction.date <= date_to)
    rows = db.scalars(stmt).all()

    total_sales = sum((t.amount for t in rows if t.type == "매출"), Decimal(0))
    total_fees = sum(
        (t.amount * (t.fee_rate or Decimal(0)) for t in rows if t.type == "매출"), Decimal(0)
    )
    return TransactionSummary(
        total_sales=total_sales,
        total_fees=total_fees,
        net_settlement=total_sales - total_fees,
    )


@router.post("", response_model=TransactionOut, status_code=201)
def create_transaction(
    body: TransactionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    transaction = Transaction(user_id=current_user.user_id, **body.model_dump())
    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    return transaction


@router.delete("/{transaction_id}", status_code=204)
def delete_transaction(
    transaction_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    stmt = select(Transaction).where(
        Transaction.transaction_id == transaction_id,
        Transaction.user_id == current_user.user_id,
    )
    transaction = db.scalar(stmt)
    if transaction:
        db.delete(transaction)
        db.commit()
