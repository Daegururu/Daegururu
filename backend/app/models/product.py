from datetime import datetime
from decimal import Decimal

from sqlalchemy import JSON, DateTime, ForeignKey, Integer, Numeric, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class FinancialProduct(Base):
    """07 화면의 상품 카탈로그. eligibility_rules는 자격 매칭 근거 체크리스트를
    규칙 형태로 담아 08 화면의 매칭 로직에 그대로 사용한다."""

    __tablename__ = "financial_products"

    product_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100))
    provider: Mapped[str] = mapped_column(String(50))
    type: Mapped[str] = mapped_column(String(20))  # 운영자금 / 시설자금 / 정책자금
    limit_amount: Mapped[Decimal] = mapped_column(Numeric(14, 2))
    interest_rate: Mapped[Decimal] = mapped_column(Numeric(5, 2))
    period_years: Mapped[int] = mapped_column(Integer)
    grace_period_years: Mapped[int] = mapped_column(Integer, default=0)
    required_documents: Mapped[list] = mapped_column(JSON)
    eligibility_rules: Mapped[dict] = mapped_column(JSON)

    applications: Mapped[list["ProductApplication"]] = relationship(back_populates="product")


class ProductApplication(Base):
    """09 신청 플로우 — 09b 완료 화면까지의 상태를 status로 추적."""

    __tablename__ = "product_applications"

    application_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.user_id"), index=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("financial_products.product_id"), index=True)
    status: Mapped[str] = mapped_column(String(20), default="접수")  # 접수/심사중/승인/반려
    applied_amount: Mapped[Decimal] = mapped_column(Numeric(14, 2))
    documents: Mapped[list] = mapped_column(JSON, default=list)
    applied_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    user: Mapped["User"] = relationship(back_populates="product_applications")
    product: Mapped["FinancialProduct"] = relationship(back_populates="applications")
