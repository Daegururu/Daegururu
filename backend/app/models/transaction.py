from datetime import date, datetime
from decimal import Decimal

from sqlalchemy import Date, DateTime, ForeignKey, Numeric, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class DataSourceConnection(Base):
    """온보딩 02b — 계좌/카드/배달 연동 상태. iM뱅크 연동은 현재 설계안 단계라
    provider·status만 두고 실제 인증 토큰 저장은 나중에 붙인다."""

    __tablename__ = "data_source_connections"

    connection_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.user_id"), index=True)
    source_type: Mapped[str] = mapped_column(String(20))  # 계좌 / 카드 / 배달
    provider: Mapped[str] = mapped_column(String(50))  # iM뱅크, 신한, BC, 배민 등
    status: Mapped[str] = mapped_column(String(20), default="미연동")
    connected_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    user: Mapped["User"] = relationship(back_populates="data_sources")
    transactions: Mapped[list["Transaction"]] = relationship(back_populates="connection")


class Transaction(Base):
    """거래내역 — 연동 데이터(자동) + 06b 수동 입력이 함께 쌓인다.
    connection_id가 NULL이면 수동 입력을 의미한다."""

    __tablename__ = "transactions"

    transaction_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.user_id"), index=True)
    connection_id: Mapped[int | None] = mapped_column(
        ForeignKey("data_source_connections.connection_id"), nullable=True
    )
    date: Mapped[date] = mapped_column(Date, index=True)
    type: Mapped[str] = mapped_column(String(20))  # 매출 / 고정비 / 변동비
    category: Mapped[str | None] = mapped_column(String(30), nullable=True)  # 인건비/임대료/재료비 등
    amount: Mapped[Decimal] = mapped_column(Numeric(14, 2))
    settlement_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    fee_rate: Mapped[Decimal | None] = mapped_column(Numeric(5, 4), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    user: Mapped["User"] = relationship(back_populates="transactions")
    connection: Mapped["DataSourceConnection | None"] = relationship(back_populates="transactions")
