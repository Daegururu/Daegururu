from datetime import date
from decimal import Decimal

from pydantic import BaseModel


class TransactionCreate(BaseModel):
    date: date
    type: str
    category: str | None = None
    amount: Decimal
    settlement_date: date | None = None
    fee_rate: Decimal | None = None


class TransactionOut(BaseModel):
    transaction_id: int
    date: date
    type: str
    category: str | None
    amount: Decimal
    settlement_date: date | None
    fee_rate: Decimal | None

    class Config:
        from_attributes = True


class TransactionSummary(BaseModel):
    total_sales: Decimal
    total_fees: Decimal
    net_settlement: Decimal
