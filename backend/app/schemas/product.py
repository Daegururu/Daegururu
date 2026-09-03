from decimal import Decimal

from pydantic import BaseModel


class FinancialProductOut(BaseModel):
    product_id: int
    name: str
    provider: str
    type: str
    limit_amount: Decimal
    interest_rate: Decimal
    period_years: int
    grace_period_years: int
    required_documents: list[str]
    eligibility_rules: dict

    class Config:
        from_attributes = True


class ProductApplicationCreate(BaseModel):
    product_id: int
    applied_amount: Decimal
    documents: list[str] = []


class ProductApplicationOut(BaseModel):
    application_id: int
    product_id: int
    status: str
    applied_amount: Decimal
    documents: list[str]

    class Config:
        from_attributes = True
