from sqlalchemy import String, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class DiagnosisCause(Base):
    __tablename__ = "diagnosis_causes"

    id: Mapped[int] = mapped_column(primary_key=True)
    report_id: Mapped[int] = mapped_column(ForeignKey("diagnosis_reports.id"), index=True)
    area: Mapped[str] = mapped_column(String(20))  # sales/costStructure/cashflow/settlement/relativePosition
    summary: Mapped[str] = mapped_column(String(300))
    evidence: Mapped[list] = mapped_column(JSONB)  # 근거 문장 목록(list[str])
    display_order: Mapped[int] = mapped_column(Integer, default=0)
