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
from app.models import (
    User,
    Store,
    DiagnosisReport,
    DiagnosisCause,
    Prescription,
    Transaction,
    Settlement,
    IndustryBenchmark,
    FinancialProduct,
)
from app.services.auth import signup_user
from app.schemas.user import UserSignupRequest

SEED_BUSINESS_REG_NOS = ["000-00-00001", "000-00-00002"]
SEED_PRODUCT_NAMES = ["대구시 골목상권 활력자금", "iM뱅크 소상공인 특별운영자금", "소상공인시장진흥공단 정책자금"]
SEED_BENCHMARK = ("한식음식점업", "대구광역시 중구")


def _clear_previous_seed(db):
    old_user_ids = [u.user_id for u in db.query(User).filter(User.business_reg_no.in_(SEED_BUSINESS_REG_NOS)).all()]
    if old_user_ids:
        old_report_ids = [
            r.id for r in db.query(DiagnosisReport).filter(DiagnosisReport.user_id.in_(old_user_ids)).all()
        ]
        if old_report_ids:
            db.query(DiagnosisCause).filter(DiagnosisCause.report_id.in_(old_report_ids)).delete(synchronize_session=False)
            db.query(Prescription).filter(Prescription.report_id.in_(old_report_ids)).delete(synchronize_session=False)
        db.query(Settlement).filter(Settlement.user_id.in_(old_user_ids)).delete(synchronize_session=False)
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
            phone_number="010-0000-0001",
            password="seedpass1234!",
        ),
    )

    # 2) 데이터가 채워진 유저 (정상 응답 테스트용)
    user = signup_user(
        db,
        UserSignupRequest(
            business_reg_no=SEED_BUSINESS_REG_NOS[1],
            representative_name="김영수",
            phone_number="010-0000-0002",
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
    db.flush()

    db.add(
        DiagnosisCause(
            report_id=report.id,
            area="costStructure",
            summary="최근 매출 감소보다 고정비 비중 증가가 자금 부족에 더 큰 영향을 주고 있습니다.",
            evidence=[
                "고정비 비중 42.8% — 동일 업종 평균 34.1% 대비 8.7%p 높음",
                "인건비 7,880,000원 — 전월 대비 +18.0% (주휴수당 일시 반영)",
                "순현금흐름 2개월 연속 마이너스 — 8월 -1,240,000원",
            ],
            display_order=0,
        )
    )

    db.add_all(
        [
            Prescription(
                report_id=report.id,
                rank=1,
                title="인건비 구조 점검",
                description="주휴수당 발생 구간을 피하도록 주간 근무 스케줄을 재배치하면 월 약 62만원 절감이 예상됩니다.",
            ),
            Prescription(
                report_id=report.id,
                rank=2,
                title="소상공인 정책자금 신청",
                description="현재 조건으로 iM뱅크 특별운영자금 5,000만원 한도, 연 2.8% 금리 신청이 가능합니다.",
            ),
            Prescription(
                report_id=report.id,
                rank=3,
                title="배달 수수료 재협상",
                description="배달 매출 비중 31%, 평균 수수료율 14.2%. 정액제 전환 시 월 약 38만원 절감이 가능합니다.",
            ),
        ]
    )

    today = date.today()

    # 이번 달·저번 달은 매출·정산(06) 화면의 필터·페이지네이션 검증을 위해 결제수단/정산상태/수수료까지 채운
    # 상세 거래로 넣는다. 그 이전 달은 대시보드 매출 추이 차트에만 쓰이므로 월별 합계 한 건으로 충분하다.
    def _sales_row(days_ago: int, method: str, amount: int, settlement: str, fee_amount: int, content: str):
        return Transaction(
            user_id=user.user_id,
            type="매출",
            amount=amount,
            transaction_date=today - timedelta(days=days_ago),
            payment_method=method,
            content=content,
            settlement_status=settlement,
            fee_amount=fee_amount,
        )

    db.add_all(
        [
            _sales_row(0, "카드", 612_000, "completed", 17_000, "저녁 매출 정산분"),
            _sales_row(0, "배달", 384_000, "completed", 54_500, "배달앱 정산 (수수료 14.2%)"),
            _sales_row(1, "카드", 412_000, "completed", 11_500, "점심 매출 정산분"),
            _sales_row(1, "현금", 198_000, "none", 0, "현금 매출"),
            _sales_row(2, "카드", 704_000, "scheduled", 19_600, "저녁 매출 정산분"),
            _sales_row(2, "배달", 341_000, "scheduled", 48_400, "배달앱 정산 (수수료 14.2%)"),
            _sales_row(3, "카드", 856_000, "scheduled", 23_800, "주말 매출 정산분"),
            _sales_row(3, "배달", 402_000, "unsettled", 57_100, "배달앱 정산 (수수료 14.2%)"),
            Transaction(
                user_id=user.user_id,
                type="기타",
                amount=300_000,
                transaction_date=today - timedelta(days=4),
                payment_method="기타",
                content="단체 예약금 입금",
                settlement_status="none",
                fee_amount=0,
            ),
        ]
    )

    for category, amount in [("인건비", 7_880_000), ("임대료", 7_050_000), ("기타", 5_800_000)]:
        db.add(
            Transaction(
                user_id=user.user_id,
                type="고정비",
                category=category,
                amount=amount,
                transaction_date=today.replace(day=5),
                payment_method="고정비",
                content=f"이번 달 {category}",
                settlement_status="withdrawn",
                fee_amount=0,
            )
        )

    for m in range(1, 12):
        month_date = _months_ago(today, m).replace(day=15)
        db.add(Transaction(user_id=user.user_id, type="매출", amount=15_000_000 + m * 300_000, transaction_date=month_date))

    for days_ago, lag_days, fee_rate in [(2, 2, 2.1), (5, 2, 2.3), (9, 3, 2.4), (14, 1, 1.9)]:
        requested = today - timedelta(days=days_ago)
        db.add(
            Settlement(
                user_id=user.user_id,
                amount=1_200_000,
                fee_rate_pct=fee_rate,
                requested_date=requested,
                settled_date=requested + timedelta(days=lag_days),
            )
        )
    # 아직 입금 안 된 정산 예정 건
    db.add(
        Settlement(
            user_id=user.user_id,
            amount=3_180_000,
            fee_rate_pct=2.3,
            requested_date=today - timedelta(days=1),
            settled_date=None,
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
