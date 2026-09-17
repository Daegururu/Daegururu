from datetime import date

from sqlalchemy.orm import Session

from app.models import ExternalSupportProgram, FinancialProduct, Store, User
from app.services.aggregations import last_12_months, monthly_sales_series
from app.services.finance_matching import (
    business_years as _business_years,
    passes_eligibility,
    region_from_address,
)
from app.services.store import calculate_business_period


def _format_won(amount: int) -> str:
    return f"{amount // 10_000:,}만원"


def _format_rate(rate: float) -> str:
    text = f"{float(rate):.2f}".rstrip("0").rstrip(".")
    return f"연 {text}%"


def _format_grace(months: int) -> str:
    if months <= 0:
        return "없음"
    if months % 12 == 0:
        return f"{months // 12}년"
    return f"{months}개월"


def _monthly_repayment(product: FinancialProduct) -> int:
    """거치기간 후 원리금균등분할 상환 기준 월 상환액 추정치."""
    repayment_months = product.term_years * 12 - product.grace_period_months
    if repayment_months <= 0:
        return 0

    monthly_rate = float(product.interest_rate) / 100 / 12
    if monthly_rate == 0:
        return round(product.limit_amount / repayment_months)

    growth = (1 + monthly_rate) ** repayment_months
    payment = product.limit_amount * monthly_rate * growth / (growth - 1)
    return round(payment)


def _annual_revenue(db: Session, user: User) -> int:
    months = last_12_months(date.today())
    return sum(monthly_sales_series(db, user.user_id, months))


def _eligibility_items(product: FinancialProduct, store: Store | None, years: float, region: str | None, annual_revenue: int) -> list[dict]:
    rules = product.eligibility_rules or {}
    items = []

    if "min_business_years" in rules:
        min_years = rules["min_business_years"]
        period_label = calculate_business_period(store.open_date) if store is not None else "정보 없음"
        evidence = f"{store.business_name} · {period_label}" if store is not None else "가게 정보 없음"
        items.append({
            "condition": f"사업기간 {min_years}년 이상",
            "evidence": evidence,
            "met": years >= min_years,
        })

    if "max_annual_revenue" in rules:
        items.append({
            "condition": f"연매출 {_format_won(rules['max_annual_revenue'])} 이하",
            "evidence": f"최근 12개월 {_format_won(annual_revenue)}",
            "met": annual_revenue <= rules["max_annual_revenue"],
        })

    if "regions" in rules:
        items.append({
            "condition": f"{rules['regions'][0]} 소재",
            "evidence": store.business_address if store is not None else "가게 정보 없음",
            "met": region in rules["regions"],
        })

    return items


def _list_item(product: FinancialProduct, eligible: bool) -> dict:
    return {
        "productId": product.id,
        "name": product.name,
        "logoText": product.logo_text,
        "provider": product.provider,
        "category": product.category,
        "target": product.target,
        "limit": _format_won(product.limit_amount),
        "rate": _format_rate(product.interest_rate),
        "term": f"{product.term_years}년",
        "status": "신청 가능" if eligible else "자격 미충족",
    }


def _detail(product: FinancialProduct, store: Store | None, years: float, region: str | None, annual_revenue: int) -> dict:
    eligibility = _eligibility_items(product, store, years, region, annual_revenue)
    eligible = all(item["met"] for item in eligibility)

    return {
        **_list_item(product, eligible),
        "overview": product.overview,
        "termDetail": f"{product.term_years}년 (거치 {_format_grace(product.grace_period_months)})",
        "eligibility": eligibility,
        "documents": product.documents,
        "summary": [
            {"label": "예상 한도", "value": _format_won(product.limit_amount)},
            {"label": "적용 금리", "value": _format_rate(product.interest_rate)},
            {"label": "월 상환액(추정)", "value": f"{_monthly_repayment(product):,}원"},
            {"label": "심사 기간", "value": f"영업일 {product.review_days}일"},
        ],
        "diagnosisNote": product.diagnosis_note,
    }


def _external_program_item(program: ExternalSupportProgram) -> dict:
    period = None
    if program.apply_start_date and program.apply_end_date:
        period = f"{program.apply_start_date.isoformat()} ~ {program.apply_end_date.isoformat()}"

    return {
        "title": program.title,
        "agency": program.agency,
        "target": program.target,
        "applyPeriod": period,
        "detailUrl": program.detail_url,
        "source": program.source,
    }


def _external_programs(db: Session) -> list[dict]:
    """bizinfo 등에서 동기화한 지원사업 공고. 자격 매칭은 하지 않고 마감 안 지난 공고만 노출한다."""
    today = date.today()
    programs = (
        db.query(ExternalSupportProgram)
        .filter(
            (ExternalSupportProgram.apply_end_date.is_(None))
            | (ExternalSupportProgram.apply_end_date >= today)
        )
        .order_by(ExternalSupportProgram.apply_start_date.desc().nullslast())
        .limit(20)
        .all()
    )
    return [_external_program_item(p) for p in programs]


def get_finance_products(db: Session, user: User, category: str | None = None) -> dict:
    store = user.store
    annual_revenue = _annual_revenue(db, user)
    years = _business_years(store)
    region = region_from_address(store.business_address) if store is not None else None

    query = db.query(FinancialProduct)
    if category is not None:
        query = query.filter(FinancialProduct.category == category)
    products = query.all()

    items = []
    eligible_count = 0
    for product in products:
        eligible = passes_eligibility(product, years, region, annual_revenue)
        if eligible:
            eligible_count += 1
        items.append(_list_item(product, eligible))

    items.sort(key=lambda item: item["status"] != "신청 가능")

    match_banner = None
    if store is not None:
        match_banner = {
            "title": f"사업기간 {calculate_business_period(store.open_date)} · 월매출 {_format_won(round(annual_revenue / 12))} · {store.industry_name} 기준",
            "description": f"신청 가능한 소상공인 지원사업 {eligible_count}건을 찾았습니다. 한도가 큰 순서로 정렬했습니다.",
        }

    return {"matchBanner": match_banner, "products": items, "externalPrograms": _external_programs(db)}


def get_finance_product_detail(db: Session, user: User, product_id: int) -> dict | None:
    product = db.query(FinancialProduct).filter(FinancialProduct.id == product_id).first()
    if product is None:
        return None

    store = user.store
    annual_revenue = _annual_revenue(db, user)
    years = _business_years(store)
    region = region_from_address(store.business_address) if store is not None else None

    return _detail(product, store, years, region, annual_revenue)
