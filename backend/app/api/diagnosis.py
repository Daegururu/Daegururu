from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.ai.scoring.engine import run_diagnosis
from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.diagnosis import DiagnosisReport
from app.models.user import User
from app.schemas.diagnosis import DiagnosisReportOut, PrescriptionStatusUpdate
from app.models.diagnosis import Prescription

router = APIRouter()


def _report_query():
    return select(DiagnosisReport).options(
        joinedload(DiagnosisReport.causes), joinedload(DiagnosisReport.prescriptions)
    )


@router.get("/latest", response_model=DiagnosisReportOut)
def latest_report(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    stmt = (
        _report_query()
        .where(DiagnosisReport.user_id == current_user.user_id)
        .order_by(DiagnosisReport.diagnosis_date.desc())
    )
    report = db.scalars(stmt).unique().first()
    if not report:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "진단 이력이 없습니다. 먼저 진단을 실행하세요.")
    return report


@router.get("", response_model=list[DiagnosisReportOut])
def list_reports(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    stmt = (
        _report_query()
        .where(DiagnosisReport.user_id == current_user.user_id)
        .order_by(DiagnosisReport.diagnosis_date.desc())
    )
    return db.scalars(stmt).unique().all()


@router.post("/run", response_model=DiagnosisReportOut, status_code=201)
def run(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    report = run_diagnosis(db, current_user)
    return report


@router.patch("/prescriptions/{prescription_id}", response_model=DiagnosisReportOut)
def update_prescription_status(
    prescription_id: int,
    body: PrescriptionStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    prescription = db.get(Prescription, prescription_id)
    if not prescription or prescription.report.user_id != current_user.user_id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "처방을 찾을 수 없습니다.")

    prescription.status = body.status
    if body.status == "실행중" and prescription.executed_at is None:
        from datetime import datetime, timezone

        prescription.executed_at = datetime.now(timezone.utc)
    db.commit()

    report = db.scalars(
        _report_query().where(DiagnosisReport.report_id == prescription.report_id)
    ).unique().first()
    return report
