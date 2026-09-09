"""로컬 테스트용 시드 스크립트 — 홈 대시보드·우리 가게 진단 API 수동 검증에 사용.

실행: venv/Scripts/python scripts/seed_dashboard_test_data.py

재실행해도 안전하다 — 매번 이전에 이 스크립트가 만든 시드 데이터를
전부 지우고 새로 넣는다(reset-and-reseed). business_reg_no로 이전 실행분을 식별한다.

실제 회원가입 플로우(비밀번호 해싱 등)를 그대로 타고 유저를 만든다 —
User/Store 스키마는 앱 코드가 실제로 쓰는 것과 동일해야 하므로 목데이터도 그 경로를 그대로 써야 한다.
"""
import sys
from datetime import date, timedelta
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.core.database import SessionLocal
from app.core.security import create_access_token
from app.models import User, Store, DiagnosisReport, Transaction, IndustryBenchmark, FinancialProduct
from app.services.auth import signup_user
from app.schemas.user import UserSignupRequest

SEED_BUSINESS_REG_NOS = ["000-00-00001", "000-00-00002"]
SEED_PRODUCT_NAMES = ["대구시 골목상권 활력자금", "iM뱅크 소상공인 특별운영자금", "소상공인시장진흥공단 정책자금"]
SEED_BENCHMARK = ("한식음식점업", "대구광역시 중구")


def _clear_previous_seed(db):
    old_user_ids = [u.user_id for u in db.query(User).filter(User.business_reg_no.in_(SEED_BUSINESS_REG_NOS)).all()]
    if old_user_ids:
        db.query(Transaction).filter(Transaction.user_id.in_(old_user_ids)).delete(synchronize_session=False)
        db.query(DiagnosisReport).filter(DiagnosisReport.user_id.in_(old_user_ids)).delete(synchronize_session=False)
        db.query(Store).filter(Store.user_id.in_(old_user_ids)).delete(synchronize_session=False)
        db.query(User).filter(User.user_id.in_(old_user_ids)).delete(synchronize_session=False)
    db.query(FinancialProduct).filter(FinancialProduct.name.in_(SEED_PRODUCT_NAMES)).delete(synchronize_session=False)
    db.query(IndustryBenchmark).filter(
        IndustryBenchmark.industry == SEED_BENCHMARK[0], IndustryBenchmark.region == SEED_BENCHMARK[1]
    ).delete(synchronize_session=False)
    db.commit()


def _months_ago(d: date, n: int) -> date:
    year = d.year
    month = d.month - n
    while month <= 0:
        month += 12
        year -= 1
    return date(year, month, 1)


def main():
    db = SessionLocal()
    _clear_previous_seed(db)

    # 1) 진단 이력 없는 신규 유저 (빈 상태 테스트용) — 회원가입만, 가게 등록 X
    empty_user = signup_user(
        db,
        UserSignupRequest(
            business_reg_no=SEED_BUSINESS_REG_NOS[0],
            representative_name="김신규",
            password="seedpass1234!",
        ),
    )

    # 2) 데이터가 채워진 유저 (정상 응답 테스트용)
    user = signup_user(
        db,
        UserSignupRequest(
            business_reg_no=SEED_BUSINESS_REG_NOS[1],
            representative_name="김영수",
            password="seedpass1234!",
        ),
    )

    db.add(
        Store(
            user_id=user.user_id,
            business_name="영수네 국밥",
            industry_name="한식음식점업",
            business_address="대구광역시 중구 동성로 12",
            open_date=date.today() - timedelta(days=365 * 3 + 60),
        )
    )

    report = DiagnosisReport(
        user_id=user.user_id,
        diagnosis_date=date.today(),
        composite_score=68,
        risk_level="주의",
        summary="최근 매출 감소보다 고정비 비중 증가가 자금 부족에 더 큰 영향을 주고 있습니다.",
        sub_scores={"sales": 60, "costStructure": 40, "cashflow": 55, "settlement": 80, "relativePosition": 65},
    )
    db.add(report)

    today = date.today()
    for m in range(12):
        month_date = today.replace(day=15) if m == 0 else _months_ago(today, m).replace(day=15)
        db.add(Transaction(user_id=user.user_id, type="매출", amount=15_000_000 + m * 300_000, transaction_date=month_date))

    for category, amount in [("인건비", 7_880_000), ("임대료", 7_050_000), ("기타", 5_800_000)]:
        db.add(
            Transaction(
                user_id=user.user_id,
                type="고정비",
                category=category,
                amount=amount,
                transaction_date=today.replace(day=5),
            )
        )

    db.add(
        IndustryBenchmark(
            industry="한식음식점업",
            region="대구광역시 중구",
            avg_monthly_sales=16_500_000,
            avg_labor_cost_pct=32,
            avg_rent_pct=29,
            avg_other_cost_pct=39,
            source="daegu_carddata",
        )
    )

    db.add_all(
        [
            FinancialProduct(
                name="대구시 골목상권 활력자금",
                limit_amount=20_000_000,
                interest_rate=1.5,
                eligibility_rules={"regions": ["대구광역시 중구"], "max_annual_revenue": 300_000_000},
            ),
            FinancialProduct(
                name="iM뱅크 소상공인 특별운영자금",
                limit_amount=50_000_000,
                interest_rate=2.8,
                eligibility_rules={"min_business_years": 1},
            ),
            FinancialProduct(
                name="소상공인시장진흥공단 정책자금",
                limit_amount=70_000_000,
                interest_rate=3.2,
                eligibility_rules={"min_business_years": 1, "max_annual_revenue": 300_000_000},
            ),
        ]
    )

    db.commit()

    print("empty_user_id:", empty_user.user_id, "token:", create_access_token(empty_user.user_id))
    print("user_id:", user.user_id, "token:", create_access_token(user.user_id))


if __name__ == "__main__":
    main()
