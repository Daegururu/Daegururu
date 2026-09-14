from datetime import datetime, date

from sqlalchemy import String, Date, DateTime, BigInteger, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Transaction(Base):
    __tablename__ = "transactions"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.user_id"), index=True)
    type: Mapped[str] = mapped_column(String(10))  # 매출 | 고정비 | 기타
    category: Mapped[str | None] = mapped_column(String(20), nullable=True)  # 고정비일 때만: 인건비/임대료/기타
    amount: Mapped[int] = mapped_column(BigInteger)
    transaction_date: Mapped[date] = mapped_column(Date, index=True)
    payment_method: Mapped[str | None] = mapped_column(String(20), nullable=True)  # 카드/현금/배달/계좌이체 등. 매출·정산 표의 [구분] 열
    content: Mapped[str | None] = mapped_column(String(255), nullable=True)  # 매출·정산 표의 [내용] 열
    settlement_status: Mapped[str] = mapped_column(String(20), default="none", server_default="none")  # completed/scheduled/unsettled/none/withdrawn
    fee_amount: Mapped[int] = mapped_column(BigInteger, default=0, server_default="0")  # 매출 건의 카드/배달 수수료. 매출이 아니면 0
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
