"""대시보드·진단 리포트가 공통으로 쓰는 거래내역 집계 헬퍼."""
from datetime import date

from dateutil.relativedelta import relativedelta
from sqlalchemy import func, extract
from sqlalchemy.orm import Session

from app.models import Transaction, IndustryBenchmark, User

FIXED_COST_CATEGORIES = ["인건비", "임대료", "기타"]
FIXED_COST_LABELS = {"인건비": "인건비", "임대료": "임대료", "기타": "기타 고정비"}


def month_key(d: date) -> str:
    return f"{d.year:04d}-{d.month:02d}"


def last_12_months(today: date) -> list[date]:
    first_of_this_month = today.replace(day=1)
    return [first_of_this_month - relativedelta(months=offset) for offset in range(11, -1, -1)]


def monthly_series(db: Session, user_id: int, type_: str, months: list[date]) -> list[int]:
    start = months[0]
    rows = (
        db.query(
            extract("year", Transaction.transaction_date).label("y"),
            extract("month", Transaction.transaction_date).label("m"),
            func.sum(Transaction.amount).label("total"),
        )
        .filter(Transaction.user_id == user_id, Transaction.type == type_, Transaction.transaction_date >= start)
        .group_by("y", "m")
        .all()
    )
    totals = {(int(r.y), int(r.m)): int(r.total) for r in rows}
    return [totals.get((m.year, m.month), 0) for m in months]


def monthly_sales_series(db: Session, user_id: int, months: list[date]) -> list[int]:
    return monthly_series(db, user_id, "매출", months)


def monthly_fixed_cost_series(db: Session, user_id: int, months: list[date]) -> list[int]:
    return monthly_series(db, user_id, "고정비", months)


def fixed_cost_this_month(db: Session, user_id: int, today: date) -> dict[str, int]:
    month_start = today.replace(day=1)
    rows = (
        db.query(Transaction.category, func.sum(Transaction.amount))
        .filter(
            Transaction.user_id == user_id,
            Transaction.type == "고정비",
            Transaction.transaction_date >= month_start,
        )
        .group_by(Transaction.category)
        .all()
    )
    totals = {category: int(total) for category, total in rows}
    return {cat: totals.get(cat, 0) for cat in FIXED_COST_CATEGORIES}


def industry_benchmark(db: Session, user: User) -> IndustryBenchmark | None:
    return (
        db.query(IndustryBenchmark)
        .filter(IndustryBenchmark.industry == user.industry, IndustryBenchmark.region == user.region)
        .first()
    )


def diff(current: float, previous: float) -> tuple[float | None, str | None]:
    if previous == 0:
        return None, None
    pct = round((current - previous) / previous * 100, 1)
    direction = "up" if pct > 0 else ("down" if pct < 0 else None)
    return pct, direction
