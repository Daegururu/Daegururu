from datetime import date

from pydantic import BaseModel, Field


class StoreCreateRequest(BaseModel):
    business_name: str = Field(min_length=1, max_length=100)
    industry_name: str = Field(min_length=1, max_length=100)
    business_address: str = Field(min_length=1, max_length=255)
    open_date: date


class StoreResponse(BaseModel):
    store_id: int
    business_name: str
    industry_name: str
    business_address: str
    open_date: date

    model_config = {
        "from_attributes": True
    }

class StoreDetailResponse(BaseModel):
    business_name: str
    industry_name: str
    business_address: str
    open_date: date
    business_period: str