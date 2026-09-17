from sqlalchemy.orm import Session

from app.models.user import User
from app.models.store import Store
from app.models.transaction import Transaction
from app.models.settlement import Settlement
from app.models.diagnosis_report import DiagnosisReport
from app.models.prescription import Prescription
from app.models.diagnosis_cause import DiagnosisCause
from app.services.auth import password_hash

def get_mypage(
    db: Session,
    user_id: int,
):
    return (
        db.query(User, Store)
        .join(Store, User.user_id == Store.user_id)
        .filter(User.user_id == user_id)
        .first()
    )

def change_password(
    db: Session,
    user: User,
    current_password: str,
    new_password: str,
):
    # 현재 비밀번호 확인
    if not password_hash.verify(
        current_password,
        user.password_hash,
    ):
        raise ValueError("현재 비밀번호가 올바르지 않습니다.")

    # 새 비밀번호 해싱
    user.password_hash = password_hash.hash(new_password)

    db.commit()

def update_store(
    db: Session,
    user_id: int,
    business_name: str,
    industry_name: str,
    business_address: str,
    open_date,
):
    store = (
        db.query(Store)
        .filter(Store.user_id == user_id)
        .first()
    )

    if store is None:
        raise ValueError("가게 정보를 찾을 수 없습니다.")

    store.business_name = business_name
    store.industry_name = industry_name
    store.business_address = business_address
    store.open_date = open_date

    db.commit()
    db.refresh(store)

    return store

def delete_account(
    db: Session,
    user: User,
    password: str,
) -> None:
    # 비밀번호 확인
    if not password_hash.verify(password, user.password_hash):
        raise ValueError("비밀번호가 올바르지 않습니다.")

    # FK 제약상 자식 데이터부터 지운다: 진단서 하위(처방·원인) → 진단서/매출/정산 → 가게 → 회원 순.
    report_ids = [
        report_id
        for (report_id,) in db.query(DiagnosisReport.id)
        .filter(DiagnosisReport.user_id == user.user_id)
        .all()
    ]
    if report_ids:
        db.query(Prescription).filter(Prescription.report_id.in_(report_ids)).delete(synchronize_session=False)
        db.query(DiagnosisCause).filter(DiagnosisCause.report_id.in_(report_ids)).delete(synchronize_session=False)
        db.query(DiagnosisReport).filter(DiagnosisReport.user_id == user.user_id).delete(synchronize_session=False)

    db.query(Transaction).filter(Transaction.user_id == user.user_id).delete(synchronize_session=False)
    db.query(Settlement).filter(Settlement.user_id == user.user_id).delete(synchronize_session=False)
    db.query(Store).filter(Store.user_id == user.user_id).delete(synchronize_session=False)

    db.delete(user)
    db.commit()