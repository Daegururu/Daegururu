from datetime import date

from pydantic import BaseModel, Field


class TransactionResponse(BaseModel):
    id: int
    date: date
    category: str
    method: str | None
    content: str | None
    amount: int
    settlement: str


class TransactionListResponse(BaseModel):
    items: list[TransactionResponse]
    page: int
    totalPages: int
    totalCount: int


class SalesSummaryItem(BaseModel):
    label: str
    value: str
    caption: str


class SalesSummaryResponse(BaseModel):
    items: list[SalesSummaryItem]


class TransactionCreateRequest(BaseModel):
    category: str = Field(description="sales | expense | other")
    date: date
    amount: int = Field(gt=0, description="항상 양수. 지출 여부는 category로 판단해 부호를 붙인다.")
    content: str = Field(min_length=1, max_length=255)
    method: str = Field(min_length=1, max_length=20)
    reflectInDiagnosis: bool = False


class SalesExportRequest(BaseModel):
    month: str = Field(description="YYYY-MM")
    includeSales: bool = True
    includeExpense: bool = True
    includeScheduled: bool = True
