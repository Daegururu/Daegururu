from pydantic import BaseModel, Field


class UserSignupRequest(BaseModel):
    business_reg_no: str = Field(min_length=1, max_length=20)
    representative_name: str = Field(min_length=1, max_length=100)
    password: str = Field(min_length=8, max_length=100)


class UserSignupResponse(BaseModel):
    user_id: int
    business_reg_no: str
    representative_name: str
    access_token: str
    token_type: str = "bearer"

    model_config = {
        "from_attributes": True
    }

class UserLoginRequest(BaseModel):
    business_reg_no: str
    password: str


class UserLoginResponse(BaseModel):
    user_id: int
    business_reg_no: str
    representative_name: str
    access_token: str
    token_type: str = "bearer"

    model_config = {
        "from_attributes": True
    }