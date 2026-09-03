from datetime import date, datetime

from pydantic import BaseModel


class DiagnosisCauseOut(BaseModel):
    cause_id: int
    area: str
    summary: str
    evidence: list[str]

    class Config:
        from_attributes = True


class PrescriptionOut(BaseModel):
    prescription_id: int
    rank: int
    type: str
    title: str
    status: str
    executed_at: datetime | None

    class Config:
        from_attributes = True


class DiagnosisReportOut(BaseModel):
    report_id: int
    diagnosis_date: date
    composite_score: int
    risk_level: str
    sub_scores: dict
    causes: list[DiagnosisCauseOut]
    prescriptions: list[PrescriptionOut]

    class Config:
        from_attributes = True


class PrescriptionStatusUpdate(BaseModel):
    status: str
