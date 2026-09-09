from datetime import date

from sqlalchemy.orm import Session

from app.models import DiagnosisReport, DiagnosisCause, Prescription, Settlement, User
from app.services.aggregations import (
    FIXED_COST_CATEGORIES,
    fixed_cost_this_month,
    last_12_months,
    month_key,
    monthly_fixed_cost_series,
    monthly_sales_series,
)


def _latest_report(db: Session, user_id: int) -> DiagnosisReport | None:
    return (
        db.query(DiagnosisReport)
        .filter(DiagnosisReport.user_id == user_id)
        .order_by(DiagnosisReport.diagnosis_date.desc())
        .first()
    )


def get_diagnosis_report(db: Session, user: User) -> dict:
    report = _latest_report(db, user.id)
    if report is None:
        return {
            "hasReport": False,
            "reportId": None,
            "diagnosisDate": None,
            "compositeScore": None,
            "riskLevel": None,
            "causes": [],
            "prescriptions": [],
        }

    causes = (
        db.query(DiagnosisCause)
        .filter(DiagnosisCause.report_id == report.id)
        .order_by(DiagnosisCause.display_order)
        .all()
    )
    prescriptions = (
        db.query(Prescription)
        .filter(Prescription.report_id == report.id)
        .order_by(Prescription.rank)
        .all()
    )

    return {
        "hasReport": True,
        "reportId": report.id,
        "diagnosisDate": report.diagnosis_date.isoformat(),
        "compositeScore": report.composite_score,
        "riskLevel": report.risk_level,
        "causes": [{"area": c.area, "summary": c.summary, "evidence": c.evidence} for c in causes],
        "prescriptions": [
            {"prescriptionId": p.id, "rank": p.rank, "title": p.title, "description": p.description}
            for p in prescriptions
        ],
    }


def get_sales_tab(db: Session, user: User) -> dict:
    if _latest_report(db, user.id) is None:
        return {"hasData": False, "unit": None, "months": [], "values": []}

    today = date.today()
    months = last_12_months(today)
    values = monthly_sales_series(db, user.id, months)
    return {"hasData": True, "unit": "원", "months": [month_key(m) for m in months], "values": values}


def get_fixed_cost_tab(db: Session, user: User) -> dict:
    if _latest_report(db, user.id) is None:
        return {"hasData": False, "items": []}

    today = date.today()
    fixed_cost = fixed_cost_this_month(db, user.id, today)
    total = sum(fixed_cost.values())

    items = []
    for cat in FIXED_COST_CATEGORIES:
        pct = round(fixed_cost[cat] / total * 100) if total else 0
        items.append({"category": cat, "amount": fixed_cost[cat], "pct": pct})

    return {"hasData": True, "items": items}


def get_cashflow_tab(db: Session, user: User) -> dict:
    if _latest_report(db, user.id) is None:
        return {"hasData": False, "unit": None, "months": [], "values": []}

    today = date.today()
    months = last_12_months(today)
    sales = monthly_sales_series(db, user.id, months)
    fixed_cost = monthly_fixed_cost_series(db, user.id, months)
    net = [s - c for s, c in zip(sales, fixed_cost)]
    return {"hasData": True, "unit": "원", "months": [month_key(m) for m in months], "values": net}


def get_settlement_tab(db: Session, user: User) -> dict:
    if _latest_report(db, user.id) is None:
        return {"hasData": False, "avgFeeRatePct": None, "avgSettlementLagDays": None}

    settlements = db.query(Settlement).filter(Settlement.user_id == user.id).all()
    if not settlements:
        return {"hasData": True, "avgFeeRatePct": 0.0, "avgSettlementLagDays": 0.0}

    avg_fee_rate = sum(float(s.fee_rate_pct) for s in settlements) / len(settlements)

    settled = [s for s in settlements if s.settled_date is not None]
    if settled:
        avg_lag_days = sum((s.settled_date - s.requested_date).days for s in settled) / len(settled)
    else:
        avg_lag_days = 0.0

    return {
        "hasData": True,
        "avgFeeRatePct": round(avg_fee_rate, 1),
        "avgSettlementLagDays": round(avg_lag_days, 1),
    }
