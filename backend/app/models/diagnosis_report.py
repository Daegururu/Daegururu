from datetime import datetime, date

from sqlalchemy import String, Date, DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class DiagnosisReport(Base):
    __tablename__ = "diagnosis_reports"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.user_id"), index=True)
    diagnosis_date: Mapped[date] = mapped_column(Date)
    composite_score: Mapped[int]
    risk_level: Mapped[str] = mapped_column(String(10))  # 안전 | 주의 | 위험
    summary: Mapped[str] = mapped_column(String(500))
    sub_scores: Mapped[dict] = mapped_column(JSONB)  # 매출/비용구조/현금흐름/정산/상대위치 5개 영역 점수
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
