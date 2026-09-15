"""대시보드 추천과 금융 상품 API가 공통으로 쓰는 자격 매칭 로직."""
from datetime import date

from sqlalchemy.orm import Session

from app.models import FinancialProduct, Store


def region_from_address(address: str) -> str:
    """'대구광역시 중구 동성로 12' 같은 주소에서 앞 2개 토큰(시/도 + 구/군)만 뽑아 지역 매칭에 쓴다."""
    parts = address.split()
    return " ".join(parts[:2]) if len(parts) >= 2 else address


def business_years(store: Store | None) -> float:
    if store is None:
        return 0
    return (date.today() - store.open_date).days / 365


def passes_eligibility(product: FinancialProduct, business_years_: float, region: str | None, annual_revenue: int) -> bool:
    rules = product.eligibility_rules or {}
    if "max_annual_revenue" in rules and annual_revenue > rules["max_annual_revenue"]:
        return False
    if "regions" in rules and region not in rules["regions"]:
        return False
    if "min_business_years" in rules and business_years_ < rules["min_business_years"]:
        return False
    return True


def match_products(db: Session, store: Store | None, sales_series: list[int], top_n: int = 3) -> list[FinancialProduct]:
    years = business_years(store)
    region = region_from_address(store.business_address) if store is not None else None
    annual_revenue = sum(sales_series)  # 최근 12개월 매출 합계로 연매출 추정

    candidates = db.query(FinancialProduct).all()
    matched = [p for p in candidates if passes_eligibility(p, years, region, annual_revenue)]
    matched.sort(key=lambda p: p.limit_amount, reverse=True)
    return matched[:top_n]
