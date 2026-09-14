from datetime import date

from dateutil.relativedelta import relativedelta
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.envelope import ApiError
from app.models import Transaction, User
from app.schemas.sales import TransactionCreateRequest

PAGE_SIZE = 8

CATEGORY_TO_TYPE = {"sales": "매출", "expense": "고정비", "other": "기타"}
TYPE_TO_CATEGORY = {v: k for k, v in CATEGORY_TO_TYPE.items()}


def _parse_month(month: str) -> tuple[date, date]:
    try:
        start = date.fromisoformat(f"{month}-01")
    except ValueError:
        raise ApiError(status_code=400, code="SALES4000", message="month는 YYYY-MM 형식이어야 합니다.")
    return start, start + relativedelta(months=1)


def _won(amount: int) -> str:
    return f"{amount:,}원"


def _to_response_dict(row: Transaction) -> dict:
    # DB에는 항상 양수로 저장한다(dashboard/diagnosis 집계가 이 값을 그대로 합산하므로).
    # 프론트 매출·정산 표는 지출을 음수로 표시하는 관례라 응답에서만 부호를 붙인다.
    amount = -row.amount if row.type == "고정비" else row.amount
    return {
        "id": row.id,
        "date": row.transaction_date,
        "category": TYPE_TO_CATEGORY.get(row.type, row.type),
        "method": row.payment_method,
        "content": row.content,
        "amount": amount,
        "settlement": row.settlement_status,
    }


def list_transactions(
    db: Session,
    user: User,
    month: str,
    category: str | None,
    settlement: str | None,
    page: int,
) -> tuple[list[dict], int]:
    start, end = _parse_month(month)

    query = db.query(Transaction).filter(
        Transaction.user_id == user.user_id,
        Transaction.transaction_date >= start,
        Transaction.transaction_date < end,
    )
    if category and category != "all":
        query = query.filter(Transaction.type == CATEGORY_TO_TYPE.get(category, category))
    if settlement and settlement != "all":
        query = query.filter(Transaction.settlement_status == settlement)

    total_count = query.count()
    rows = (
        query.order_by(Transaction.transaction_date.desc(), Transaction.id.desc())
        .offset((page - 1) * PAGE_SIZE)
        .limit(PAGE_SIZE)
        .all()
    )
    return [_to_response_dict(row) for row in rows], total_count


def get_sales_summary(db: Session, user: User, month: str) -> list[dict]:
    start, end = _parse_month(month)

    sales_query = db.query(Transaction).filter(
        Transaction.user_id == user.user_id,
        Transaction.type == "매출",
        Transaction.transaction_date >= start,
        Transaction.transaction_date < end,
    )

    by_method = (
        sales_query.with_entities(Transaction.payment_method, func.sum(Transaction.amount))
        .group_by(Transaction.payment_method)
        .all()
    )
    total_sales = sum(int(total) for _, total in by_method)
    method_caption = " · ".join(
        f"{method or '기타'} {int(total):,}" for method, total in by_method if total
    ) or "매출 내역 없음"

    fee_total = int(sales_query.with_entities(func.sum(Transaction.fee_amount)).scalar() or 0)
    avg_fee_rate = round(fee_total / total_sales * 100, 2) if total_sales else 0.0
    unsettled_total = int(
        sales_query.filter(Transaction.settlement_status.in_(["scheduled", "unsettled"]))
        .with_entities(func.sum(Transaction.amount))
        .scalar()
        or 0
    )
    net_settlement = total_sales - fee_total

    return [
        {"label": "총매출", "value": _won(total_sales), "caption": method_caption},
        {"label": "수수료", "value": _won(fee_total), "caption": f"평균 수수료율 {avg_fee_rate}%"},
        {
            "label": "실정산액",
            "value": _won(net_settlement),
            "caption": f"미정산 {unsettled_total:,}원 포함" if unsettled_total else "미정산 0원",
        },
    ]


def create_transaction(db: Session, user: User, payload: TransactionCreateRequest) -> dict:
    if payload.category not in CATEGORY_TO_TYPE:
        raise ApiError(status_code=400, code="SALES4001", message="category는 sales/expense/other 중 하나여야 합니다.")

    transaction = Transaction(
        user_id=user.user_id,
        type=CATEGORY_TO_TYPE[payload.category],
        amount=payload.amount,
        transaction_date=payload.date,
        payment_method="고정비" if payload.category == "expense" else payload.method,
        content=payload.content,
        settlement_status="withdrawn" if payload.category == "expense" else "none",
    )
    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    return _to_response_dict(transaction)
