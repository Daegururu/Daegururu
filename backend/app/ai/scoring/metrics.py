"""거래내역(Transaction)에서 점수 산출용 원시 지표를 뽑아낸다."""

from dataclasses import dataclass
from datetime import date

import pandas as pd

from app.models.transaction import Transaction


@dataclass
class RawMetrics:
    monthly_sales_avg: float
    sales_growth_rate: float  # 최근 3개월 vs 이전 3개월
    fixed_cost_ratio: float  # 고정비 / 매출
    labor_cost_ratio: float  # 인건비 / 매출
    avg_settlement_lag_days: float
    avg_fee_rate: float
    has_data: bool


def compute_raw_metrics(transactions: list[Transaction]) -> RawMetrics:
    if not transactions:
        return RawMetrics(0, 0, 0, 0, 0, 0, has_data=False)

    df = pd.DataFrame(
        [
            {
                "date": t.date,
                "type": t.type,
                "category": t.category,
                "amount": float(t.amount),
                "settlement_date": t.settlement_date,
                "fee_rate": float(t.fee_rate) if t.fee_rate is not None else None,
            }
            for t in transactions
        ]
    )
    df["month"] = pd.to_datetime(df["date"]).dt.to_period("M")

    sales_df = df[df["type"] == "매출"]
    fixed_df = df[df["type"] == "고정비"]
    labor_df = fixed_df[fixed_df["category"] == "인건비"]

    monthly_sales = sales_df.groupby("month")["amount"].sum().sort_index()
    monthly_fixed = fixed_df.groupby("month")["amount"].sum()
    monthly_labor = labor_df.groupby("month")["amount"].sum()

    monthly_sales_avg = float(monthly_sales.mean()) if not monthly_sales.empty else 0.0

    if len(monthly_sales) >= 2:
        recent = monthly_sales.tail(3).mean()
        prior_window = monthly_sales.iloc[:-3].tail(3)
        prior = prior_window.mean() if not prior_window.empty else monthly_sales.iloc[0]
        sales_growth_rate = float((recent - prior) / prior) if prior else 0.0
    else:
        sales_growth_rate = 0.0

    total_sales = float(sales_df["amount"].sum())
    total_fixed = float(fixed_df["amount"].sum())
    total_labor = float(labor_df["amount"].sum())

    fixed_cost_ratio = (total_fixed / total_sales) if total_sales else 0.0
    labor_cost_ratio = (total_labor / total_sales) if total_sales else 0.0

    settled = sales_df.dropna(subset=["settlement_date"])
    if not settled.empty:
        lag_days = (pd.to_datetime(settled["settlement_date"]) - pd.to_datetime(settled["date"])).dt.days
        avg_settlement_lag_days = float(lag_days.mean())
    else:
        avg_settlement_lag_days = 0.0

    fee_rows = sales_df.dropna(subset=["fee_rate"])
    avg_fee_rate = float(fee_rows["fee_rate"].mean()) if not fee_rows.empty else 0.0

    return RawMetrics(
        monthly_sales_avg=monthly_sales_avg,
        sales_growth_rate=sales_growth_rate,
        fixed_cost_ratio=fixed_cost_ratio,
        labor_cost_ratio=labor_cost_ratio,
        avg_settlement_lag_days=avg_settlement_lag_days,
        avg_fee_rate=avg_fee_rate,
        has_data=True,
    )
