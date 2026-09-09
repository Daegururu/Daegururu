from datetime import date, datetime

from sqlalchemy import Date, DateTime, Numeric, BigInteger, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Settlement(Base):
    """카드/배달 등 결제 정산 내역 — [정산] 탭, 대시보드 정산 예정 지표의 원천 데이터."""

    __tablename__ = "settlements"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    amount: Mapped[int] = mapped_column(BigInteger)
    fee_rate_pct: Mapped[float] = mapped_column(Numeric(4, 2))
    requested_date: Mapped[date] = mapped_column(Date)  # 매출 발생일(정산 요청 시점)
    settled_date: Mapped[date | None] = mapped_column(Date, nullable=True)  # 실제 입금일, 미정산 시 null
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
