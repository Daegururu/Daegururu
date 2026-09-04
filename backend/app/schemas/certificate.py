from pydantic import BaseModel
from typing import Optional


class CertificateInfo(BaseModel):
    company_name: Optional[str] = None
    business_number: Optional[str] = None
    representative_name: Optional[str] = None
    business_address: Optional[str] = None
    main_business: Optional[str] = None
    valid_from: Optional[str] = None
    valid_until: Optional[str] = None
    certificate_type: Optional[str] = None
    is_small_business: Optional[bool] = None