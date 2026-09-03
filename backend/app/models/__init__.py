"""ERD의 11개 엔티티를 한곳에서 import — Base.metadata에 전부 등록되도록 해서
Alembic autogenerate와 create_all()이 빠짐없이 테이블을 인식하게 한다."""

from app.models.benchmark import IndustryBenchmark
from app.models.chat import ChatMessage
from app.models.diagnosis import DiagnosisCause, DiagnosisReport, Prescription
from app.models.product import FinancialProduct, ProductApplication
from app.models.transaction import DataSourceConnection, Transaction
from app.models.user import NotificationSetting, User

__all__ = [
    "User",
    "NotificationSetting",
    "DataSourceConnection",
    "Transaction",
    "DiagnosisReport",
    "DiagnosisCause",
    "Prescription",
    "FinancialProduct",
    "ProductApplication",
    "IndustryBenchmark",
    "ChatMessage",
]
