from datetime import date

from sqlalchemy.orm import Session

from app.models import DiagnosisReport, IndustryBenchmark, Store, User
from app.services.aggregations import (
    FIXED_COST_CATEGORIES,
    FIXED_COST_LABELS,
    diff,
    fixed_cost_this_month as _fixed_cost_this_month,
    last_12_months,
    month_key,
    monthly_sales_series as _monthly_sales_series,
)
from app.services.finance_matching import match_products as _match_products
from app.services.finance_matching import region_from_address as _region_from_address


def _industry_benchmark(db: Session, store: Store | None) -> IndustryBenchmark | None:
    if store is None:
        return None
    return (
        db.query(IndustryBenchmark)
        .filter(
            IndustryBenchmark.industry == store.industry_name,
            IndustryBenchmark.region == _region_from_address(store.business_address),
        )
        .first()
    )


def get_dashboard_summary(db: Session, user: User) -> dict:
    today = date.today()
    months = last_12_months(today)

    report = (
        db.query(DiagnosisReport)
        .filter(DiagnosisReport.user_id == user.user_id)
        .order_by(DiagnosisReport.diagnosis_date.desc())
        .first()
    )

    if report is None:
        return {
            "hasReport": False,
            "risk": None,
            "metrics": None,
            "cashflowChart": None,
            "fixedCostBreakdown": None,
            "recommendedProducts": [],
        }

    store = user.store

    sales_series = _monthly_sales_series(db, user.user_id, months)
    this_month_sales = sales_series[-1]
    prev_month_sales = sales_series[-2] if len(sales_series) > 1 else 0
    sales_diff_pct, sales_diff_dir = diff(this_month_sales, prev_month_sales)

    fixed_cost = _fixed_cost_this_month(db, user.user_id, today)
    this_month_fixed_cost_total = sum(fixed_cost.values())
    fixed_cost_ratio = round(this_month_fixed_cost_total / this_month_sales * 100, 1) if this_month_sales else 0.0

    net_cashflow = this_month_sales - this_month_fixed_cost_total

    benchmark = _industry_benchmark(db, store)

    fixed_cost_items = []
    for cat in FIXED_COST_CATEGORIES:
        pct = round(fixed_cost[cat] / this_month_fixed_cost_total * 100) if this_month_fixed_cost_total else 0
        industry_avg_pct = None
        if benchmark is not None:
            industry_avg_pct = {
                "인건비": float(benchmark.avg_labor_cost_pct),
                "임대료": float(benchmark.avg_rent_pct),
                "기타": float(benchmark.avg_other_cost_pct),
            }[cat]
        fixed_cost_items.append(
            {"category": FIXED_COST_LABELS[cat], "pct": pct, "industryAvgPct": industry_avg_pct}
        )

    recommended = _match_products(db, store, sales_series)

    return {
        "hasReport": True,
        "risk": {
            "compositeScore": report.composite_score,
            "riskLevel": report.risk_level,
            "updatedAt": report.diagnosis_date.isoformat(),
            "summary": report.summary,
        },
        "metrics": {
            "monthlySales": {"amount": this_month_sales, "diffPct": sales_diff_pct, "diffDirection": sales_diff_dir},
            "fixedCostRatio": {"valuePct": fixed_cost_ratio, "diffPct": None, "diffDirection": None},
            "settlementUpcoming": {"amount": 0, "note": "정산 예정 내역이 없습니다."},
            "cashflow": {
                "amount": net_cashflow,
                "note": "2개월 연속 마이너스" if net_cashflow < 0 else "안정적인 흐름입니다",
            },
        },
        "cashflowChart": {
            "unit": "원",
            "months": [month_key(m) for m in months],
            "values": sales_series,
            "industryAvgReference": (
                {"available": True, "value": benchmark.avg_monthly_sales, "source": benchmark.source}
                if benchmark is not None
                else {"available": False, "value": None, "source": None}
            ),
        },
        "fixedCostBreakdown": {
            "items": fixed_cost_items,
            "industryAvgAvailable": benchmark is not None,
        },
        "recommendedProducts": [
            {
                "productId": p.id,
                "name": p.name,
                "limitAmount": p.limit_amount,
                "interestRate": float(p.interest_rate),
            }
            for p in recommended
        ],
    }
