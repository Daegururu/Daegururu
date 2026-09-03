from datetime import datetime
from decimal import Decimal

from sqlalchemy import DateTime, Numeric, String, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class IndustryBenchmark(Base):
    """업종×지역 평균 지표 — 진단 엔진의 '업종 평균 대비' 계산 기준선.
    소진공 상권정보시스템, 국세청 경비율, 통계청 소상공인실태조사 등으로 채운다."""

    __tablename__ = "industry_benchmarks"
    __table_args__ = (UniqueConstraint("industry_code", "region_code", name="uq_industry_region"),)

    benchmark_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    industry_code: Mapped[str] = mapped_column(String(20), index=True)
    region_code: Mapped[str] = mapped_column(String(20), index=True)
    avg_fixed_cost_ratio: Mapped[Decimal] = mapped_column(Numeric(5, 4))
    avg_labor_cost_ratio: Mapped[Decimal] = mapped_column(Numeric(5, 4))
    avg_monthly_sales: Mapped[Decimal] = mapped_column(Numeric(14, 2))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
