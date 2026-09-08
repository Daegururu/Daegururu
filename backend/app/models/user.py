from datetime import datetime, date

from sqlalchemy import String, Date, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50))
    business_name: Mapped[str] = mapped_column(String(100))
    region: Mapped[str] = mapped_column(String(100))
    industry: Mapped[str] = mapped_column(String(50))
    business_start_date: Mapped[date] = mapped_column(Date)
    annual_revenue: Mapped[int] = mapped_column(default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
