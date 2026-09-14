from datetime import date

from pydantic import BaseModel


class StoreInfoResponse(BaseModel):
    business_name: str
    industry_name: str
    business_address: str
    open_date: date


class BusinessVerificationResponse(BaseModel):
    business_reg_no: str
    representative_name: str
    industry_name: str


class AccountInfoResponse(BaseModel):
    login_id: str
    phone_number: str


class MyPageResponse(BaseModel):
    store: StoreInfoResponse
    business_verification: BusinessVerificationResponse
    account: AccountInfoResponse