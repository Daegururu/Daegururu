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

class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str


class PasswordChangeResponse(BaseModel):
    message: str

# 가게 정보 수정 요청
class StoreUpdateRequest(BaseModel):
    business_name: str
    industry_name: str
    business_address: str
    open_date: date


# 가게 정보 수정 응답
class StoreUpdateResponse(BaseModel):
    message: str
    store: StoreInfoResponse


# 회원 탈퇴 요청
class AccountDeleteRequest(BaseModel):
    password: str


# 회원 탈퇴 응답
class AccountDeleteResponse(BaseModel):
    message: str