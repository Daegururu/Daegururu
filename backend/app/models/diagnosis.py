from datetime import date, datetime

from sqlalchemy import JSON, Date, DateTime, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class DiagnosisReport(Base):
    """04 화면의 종합 진단 결과. sub_scores는 매출/비용구조/현금흐름/정산/상대위치
    5개 영역 점수를 담은 JSON — 지난 설계의 모델 출력 스키마와 1:1로 매핑된다."""

    __tablename__ = "diagnosis_reports"

    report_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.user_id"), index=True)
    diagnosis_date: Mapped[date] = mapped_column(Date, index=True)
    composite_score: Mapped[int] = mapped_column(Integer)
    risk_level: Mapped[str] = mapped_column(String(10))  # 안전 / 주의 / 위험
    sub_scores: Mapped[dict] = mapped_column(JSON)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    user: Mapped["User"] = relationship(back_populates="diagnosis_reports")
    causes: Mapped[list["DiagnosisCause"]] = relationship(
        back_populates="report", cascade="all, delete-orphan"
    )
    prescriptions: Mapped[list["Prescription"]] = relationship(
        back_populates="report", cascade="all, delete-orphan"
    )


class DiagnosisCause(Base):
    """'왜 위험한가요?' 섹션 — 기여도가 가장 큰 영역과 근거 문장."""

    __tablename__ = "diagnosis_causes"

    cause_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    report_id: Mapped[int] = mapped_column(ForeignKey("diagnosis_reports.report_id"), index=True)
    area: Mapped[str] = mapped_column(String(30))  # cost_structure, cashflow 등
    summary: Mapped[str] = mapped_column(String(300))
    evidence: Mapped[list] = mapped_column(JSON)  # ["고정비 비중 42.8% ...", ...]

    report: Mapped["DiagnosisReport"] = relationship(back_populates="causes")


class Prescription(Base):
    """맞춤 처방 카드. status로 04e '실행 계획 저장' 이후 상태를
    마이페이지 '실행 중인 처방' 탭에서 추적한다."""

    __tablename__ = "prescriptions"

    prescription_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    report_id: Mapped[int] = mapped_column(ForeignKey("diagnosis_reports.report_id"), index=True)
    rank: Mapped[int] = mapped_column(Integer)
    type: Mapped[str] = mapped_column(String(30))  # labor_cost / policy_fund / fee_negotiation 등
    title: Mapped[str] = mapped_column(String(100))
    status: Mapped[str] = mapped_column(String(20), default="제안됨")  # 제안됨/실행중/완료
    executed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    report: Mapped["DiagnosisReport"] = relationship(back_populates="prescriptions")
