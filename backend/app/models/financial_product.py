from datetime import datetime

from sqlalchemy import String, DateTime, BigInteger, Numeric, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class FinancialProduct(Base):
    __tablename__ = "financial_products"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    limit_amount: Mapped[int] = mapped_column(BigInteger)
    interest_rate: Mapped[float] = mapped_column(Numeric(4, 2))
    # 자격 조건. 예: {"max_annual_revenue": 300000000, "regions": ["대구"], "min_business_years": 1}
    eligibility_rules: Mapped[dict] = mapped_column(JSONB)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
