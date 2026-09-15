from datetime import datetime

from sqlalchemy import String, Text, DateTime, BigInteger, Integer, Numeric, func
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

    provider: Mapped[str] = mapped_column(String(100))
    # operating(운영자금) | facility(시설자금) | policy(정책자금)
    category: Mapped[str] = mapped_column(String(20))
    # 로고 자리에 넣을 짧은 글자. 예: "iM", "대구"
    logo_text: Mapped[str] = mapped_column(String(10))
    # 카드 보조 문구의 마지막 조각. 예: "골목상권 점포 대상"
    target: Mapped[str] = mapped_column(String(100))
    term_years: Mapped[int] = mapped_column(Integer)
    # 거치기간(개월). 월 상환액 계산 시 원금 상환이 시작되는 시점을 늦추는 데 쓴다.
    grace_period_months: Mapped[int] = mapped_column(Integer, default=0, server_default="0")
    overview: Mapped[str] = mapped_column(Text)
    # 제출 서류 목록. 예: ["사업자등록증 사본", "부가세 과세표준증명원 (최근 1년)"]
    documents: Mapped[list] = mapped_column(JSONB)
    review_days: Mapped[int] = mapped_column(Integer)
    # 상세 화면 우측 하단 "진단 결과 연동" 안내 문구
    diagnosis_note: Mapped[str] = mapped_column(Text)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
