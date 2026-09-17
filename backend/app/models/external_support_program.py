from datetime import date, datetime

from sqlalchemy import String, Text, DateTime, Date, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class ExternalSupportProgram(Base):
    """기업마당(bizinfo) 등 외부 공공데이터 API에서 동기화한 지원사업 공고 원본.

    자격조건이 자유서술 텍스트라 FinancialProduct.eligibility_rules처럼
    구조화 매칭에 쓰지 않는다 — 목록에 그대로 노출만 한다.
    """

    __tablename__ = "external_support_programs"

    id: Mapped[int] = mapped_column(primary_key=True)
    source: Mapped[str] = mapped_column(String(30), index=True)  # 예: "bizinfo"
    external_id: Mapped[str] = mapped_column(String(50), unique=True, index=True)  # 예: pblancId
    title: Mapped[str] = mapped_column(String(300))
    target: Mapped[str] = mapped_column(String(200))  # 지원대상 자유서술 (trgetNm)
    category: Mapped[str] = mapped_column(String(50))  # 지원분야 (pldirSportRealmLclasCodeNm)
    agency: Mapped[str] = mapped_column(String(100))  # 소관기관 (jrsdInsttNm)
    summary: Mapped[str] = mapped_column(Text)  # 사업개요 (bsnsSumryCn, HTML 포함 원문)
    apply_start_date: Mapped[date | None] = mapped_column(Date)
    apply_end_date: Mapped[date | None] = mapped_column(Date)
    detail_url: Mapped[str] = mapped_column(String(500))
    synced_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
