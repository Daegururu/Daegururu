import os
from datetime import date

import pymupdf
from dateutil.relativedelta import relativedelta
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.envelope import ApiError
from app.models import Transaction, User
from app.schemas.sales import TransactionCreateRequest

PDF_LEFT_MARGIN = 50
PDF_TOP_MARGIN = 60
PDF_BOTTOM_MARGIN = 780

# 한글이 뷰어 시스템 폰트 없이도 보이도록 실제 폰트를 PDF에 임베드한다(서브셋해서 용량은 작게 유지).
# 이 경로가 없는 환경(예: 리눅스 서버)에서는 PyMuPDF 내장 CJK 폰트로 낮춰 쓴다 — 텍스트 추출은 되지만
# 뷰어에 한글 폰트가 없으면 화면에 안 보일 수 있다.
_KOREAN_FONT_PATHS = [r"C:\Windows\Fonts\malgun.ttf", r"C:\Windows\Fonts\NGULIM.TTF"]
_UNSET = object()
_korean_font_bytes: bytes | None = _UNSET


def _get_korean_font_bytes() -> bytes | None:
    global _korean_font_bytes
    if _korean_font_bytes is _UNSET:
        _korean_font_bytes = None
        for path in _KOREAN_FONT_PATHS:
            if os.path.exists(path):
                with open(path, "rb") as f:
                    _korean_font_bytes = f.read()
                break
    return _korean_font_bytes

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


class _PdfWriter:
    """새 페이지가 필요하면 자동으로 추가해주는 얇은 줄 단위 PDF 작성기."""

    def __init__(self, doc: "pymupdf.Document"):
        self._doc = doc
        self._font_bytes = _get_korean_font_bytes()
        self._page = self._new_page()
        self._y = PDF_TOP_MARGIN

    def _new_page(self):
        page = self._doc.new_page()
        if self._font_bytes:
            page.insert_font(fontname="korfont", fontbuffer=self._font_bytes)
            self._fontname = "korfont"
        else:
            self._fontname = "korea-s"  # 임베드 폰트가 없는 환경(예: 리눅스)의 대체
        return page

    def line(self, text: str, size: float = 11, gap: float = 20) -> None:
        if self._y > PDF_BOTTOM_MARGIN:
            self._page = self._new_page()
            self._y = PDF_TOP_MARGIN
        self._page.insert_text((PDF_LEFT_MARGIN, self._y), text, fontname=self._fontname, fontsize=size)
        self._y += gap

    def gap(self, height: float = 12) -> None:
        self._y += height


def generate_sales_export_pdf(
    db: Session,
    user: User,
    month: str,
    include_sales: bool,
    include_expense: bool,
    include_scheduled: bool,
) -> bytes:
    start, end = _parse_month(month)
    store = user.store
    business_name = store.business_name if store is not None else "우리 가게"

    doc = pymupdf.open()
    writer = _PdfWriter(doc)

    writer.line(f"{business_name} 매출·정산 요약본", size=16, gap=26)
    writer.line(f"기간: {month} 1일 ~ {end - relativedelta(days=1):%m월 %d일}", size=11, gap=24)

    for item in get_sales_summary(db, user, month):
        writer.line(f"{item['label']}  {item['value']}   ({item['caption']})", size=11, gap=18)
    writer.gap()

    if include_sales:
        _write_transaction_section(db, user, writer, start, end, "매출 내역", types=["매출"])

    if include_expense:
        _write_transaction_section(db, user, writer, start, end, "고정비·지출 내역", types=["고정비", "기타"])

    if include_scheduled:
        _write_transaction_section(
            db,
            user,
            writer,
            start,
            end,
            "정산 예정 내역",
            types=["매출"],
            settlement_statuses=["scheduled", "unsettled"],
        )

    doc.subset_fonts()
    return doc.tobytes(garbage=4, deflate=True)


def _write_transaction_section(
    db: Session,
    user: User,
    writer: "_PdfWriter",
    start: date,
    end: date,
    title: str,
    types: list[str],
    settlement_statuses: list[str] | None = None,
) -> None:
    query = db.query(Transaction).filter(
        Transaction.user_id == user.user_id,
        Transaction.type.in_(types),
        Transaction.transaction_date >= start,
        Transaction.transaction_date < end,
    )
    if settlement_statuses:
        query = query.filter(Transaction.settlement_status.in_(settlement_statuses))
    rows = query.order_by(Transaction.transaction_date).all()

    writer.line(f"■ {title}", size=13, gap=22)
    if not rows:
        writer.line("- 내역 없음", size=10, gap=18)
    for row in rows:
        method = row.payment_method or "-"
        content = row.content or "-"
        writer.line(
            f"{row.transaction_date.isoformat()}  {method}  {content}  {row.amount:,}원  [{row.settlement_status}]",
            size=10,
            gap=17,
        )
    total = sum(row.amount for row in rows)
    writer.line(f"소계: {total:,}원", size=10, gap=20)
    writer.gap()
