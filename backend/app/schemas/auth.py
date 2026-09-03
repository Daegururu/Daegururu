from datetime import date

from pydantic import BaseModel


class RegisterRequest(BaseModel):
    business_reg_no: str
    business_name: str
    representative_name: str
    industry_code: str
    region_code: str
    open_date: date
    login_id: str
    password: str
    phone: str


class LoginRequest(BaseModel):
    login_id: str
    password: str


class UserOut(BaseModel):
    user_id: int
    business_reg_no: str
    business_name: str
    representative_name: str
    industry_code: str
    region_code: str
    open_date: date
    phone: str

    class Config:
        from_attributes = True
