from datetime import datetime, date

from sqlalchemy import String, Date, DateTime, BigInteger, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Transaction(Base):
    __tablename__ = "transactions"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    type: Mapped[str] = mapped_column(String(10))  # 매출 | 고정비
    category: Mapped[str | None] = mapped_column(String(20), nullable=True)  # 고정비일 때만: 인건비/임대료/기타
    amount: Mapped[int] = mapped_column(BigInteger)
    transaction_date: Mapped[date] = mapped_column(Date, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
