from datetime import datetime

from sqlalchemy import String, Numeric, DateTime, BigInteger, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class IndustryBenchmark(Base):
    """업종·지역 평균 지표 — 공공데이터(소상공인시장진흥공단 상가정보 API 등)로 채워지는 참고값."""

    __tablename__ = "industry_benchmarks"

    id: Mapped[int] = mapped_column(primary_key=True)
    industry: Mapped[str] = mapped_column(String(50), index=True)
    region: Mapped[str] = mapped_column(String(100), index=True)
    avg_monthly_sales: Mapped[int] = mapped_column(BigInteger)  # 원 단위
    avg_labor_cost_pct: Mapped[float] = mapped_column(Numeric(5, 2))
    avg_rent_pct: Mapped[float] = mapped_column(Numeric(5, 2))
    avg_other_cost_pct: Mapped[float] = mapped_column(Numeric(5, 2))
    source: Mapped[str] = mapped_column(String(50))  # 예: daegu_carddata
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
