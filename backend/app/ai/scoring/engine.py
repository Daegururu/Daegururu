"""04 진단 리포트의 점수 산출 엔진.

거래내역(Transaction)과 업종 벤치마크(IndustryBenchmark)를 규칙 기반으로 비교해
5개 영역(매출/비용구조/현금흐름/정산/상대위치) 점수를 산출하고, 가장 취약한 영역부터
원인(DiagnosisCause)과 처방(Prescription)을 생성해 DiagnosisReport로 저장한다.

점수는 0~100 (높을수록 건강). 확률적 LLM 호출 없이 결정론적으로 계산해
같은 데이터에는 항상 같은 점수가 나오도록 한다 — 재현성이 필요한 금융 지표이기 때문.
"""

from datetime import date

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.ai.scoring.metrics import RawMetrics, compute_raw_metrics
from app.ai.scoring.rules import (
    AREA_LABELS,
    DEFAULT_BENCHMARK,
    PRESCRIPTIONS_BY_AREA,
    RISK_THRESHOLDS,
)
from app.models.benchmark import IndustryBenchmark
from app.models.diagnosis import DiagnosisCause, DiagnosisReport, Prescription
from app.models.transaction import Transaction
from app.models.user import User


def _clamp(value: float, lo: float = 0.0, hi: float = 100.0) -> float:
    return max(lo, min(hi, value))


def _ratio_score(actual: float, benchmark: float) -> float:
    """actual이 benchmark와 같으면 50점, 0이면 100점, 2배면 0점 (낮을수록 좋은 비율용)."""
    if benchmark <= 0:
        return 50.0
    return _clamp(100 - (actual / benchmark) * 50)


def _get_benchmark(db: Session, user: User) -> dict:
    row = db.scalar(
        select(IndustryBenchmark).where(
            IndustryBenchmark.industry_code == user.industry_code,
            IndustryBenchmark.region_code == user.region_code,
        )
    )
    if row is None:
        return DEFAULT_BENCHMARK
    return {
        "avg_fixed_cost_ratio": float(row.avg_fixed_cost_ratio),
        "avg_labor_cost_ratio": float(row.avg_labor_cost_ratio),
        "avg_monthly_sales": float(row.avg_monthly_sales),
    }


def score_metrics(metrics: RawMetrics, benchmark: dict) -> dict[str, float]:
    if not metrics.has_data:
        return {area: 0.0 for area in AREA_LABELS}

    level_ratio = metrics.monthly_sales_avg / benchmark["avg_monthly_sales"] if benchmark["avg_monthly_sales"] else 0
    level_score = _clamp(level_ratio * 60, 0, 60)
    growth_score = _clamp((metrics.sales_growth_rate + 0.1) / 0.3 * 40, 0, 40)
    sales_score = _clamp(level_score + growth_score)

    fixed_score = _ratio_score(metrics.fixed_cost_ratio, benchmark["avg_fixed_cost_ratio"])
    labor_score = _ratio_score(metrics.labor_cost_ratio, benchmark["avg_labor_cost_ratio"])
    cost_structure_score = _clamp((fixed_score + labor_score) / 2)

    lag = metrics.avg_settlement_lag_days
    cashflow_score = 100.0 if lag <= 3 else _clamp(100 - (lag - 3) / 27 * 100)

    fee = metrics.avg_fee_rate
    settlement_score = 100.0 if fee <= 0.015 else _clamp(100 - (fee - 0.015) / 0.03 * 100)

    relative_position_score = _clamp((sales_score + cost_structure_score) / 2)

    return {
        "sales": round(sales_score),
        "cost_structure": round(cost_structure_score),
        "cashflow": round(cashflow_score),
        "settlement": round(settlement_score),
        "relative_position": round(relative_position_score),
    }


def _composite(sub_scores: dict[str, float]) -> int:
    weights = {
        "sales": 0.25,
        "cost_structure": 0.25,
        "cashflow": 0.20,
        "settlement": 0.15,
        "relative_position": 0.15,
    }
    return round(sum(sub_scores[area] * w for area, w in weights.items()))


def _risk_level(composite_score: int) -> str:
    if composite_score >= RISK_THRESHOLDS["안전"]:
        return "안전"
    if composite_score >= RISK_THRESHOLDS["주의"]:
        return "주의"
    return "위험"


def _build_causes(sub_scores: dict[str, float], metrics: RawMetrics) -> list[DiagnosisCause]:
    weakest = sorted(sub_scores.items(), key=lambda kv: kv[1])[:2]
    causes = []
    for area, score in weakest:
        evidence = _evidence_for(area, metrics)
        causes.append(
            DiagnosisCause(
                area=area,
                summary=f"{AREA_LABELS[area]} 영역이 {round(score)}점으로 가장 취약합니다.",
                evidence=evidence,
            )
        )
    return causes


def _evidence_for(area: str, m: RawMetrics) -> list[str]:
    if area == "sales":
        return [
            f"최근 월평균 매출 {m.monthly_sales_avg:,.0f}원",
            f"직전 대비 매출 증감률 {m.sales_growth_rate * 100:.1f}%",
        ]
    if area == "cost_structure":
        return [
            f"고정비 비중 {m.fixed_cost_ratio * 100:.1f}%",
            f"인건비 비중 {m.labor_cost_ratio * 100:.1f}%",
        ]
    if area == "cashflow":
        return [f"평균 정산 소요일 {m.avg_settlement_lag_days:.1f}일"]
    if area == "settlement":
        return [f"평균 결제 수수료율 {m.avg_fee_rate * 100:.2f}%"]
    return ["업종 평균 대비 매출·비용구조 종합 비교 결과 하위권"]


def _build_prescriptions(sub_scores: dict[str, float]) -> list[Prescription]:
    weakest = sorted(sub_scores.items(), key=lambda kv: kv[1])[:3]
    prescriptions = []
    for rank, (area, _score) in enumerate(weakest, start=1):
        template = PRESCRIPTIONS_BY_AREA[area]
        prescriptions.append(
            Prescription(rank=rank, type=template["type"], title=template["title"])
        )
    return prescriptions


def run_diagnosis(db: Session, user: User) -> DiagnosisReport:
    transactions = db.scalars(
        select(Transaction).where(Transaction.user_id == user.user_id)
    ).all()

    benchmark = _get_benchmark(db, user)
    metrics = compute_raw_metrics(list(transactions))
    sub_scores = score_metrics(metrics, benchmark)
    composite_score = _composite(sub_scores)
    risk_level = _risk_level(composite_score)

    report = DiagnosisReport(
        user_id=user.user_id,
        diagnosis_date=date.today(),
        composite_score=composite_score,
        risk_level=risk_level,
        sub_scores=sub_scores,
        causes=_build_causes(sub_scores, metrics),
        prescriptions=_build_prescriptions(sub_scores),
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report
