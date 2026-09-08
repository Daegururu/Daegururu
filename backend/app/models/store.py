from datetime import date, datetime

from sqlalchemy import Date, DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

class Store(Base):
    __tablename__ = "stores"

    store_id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.user_id"),
        nullable=False
    )

    business_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    industry_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    business_address: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    open_date: Mapped[date] = mapped_column(
        Date,
        nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False
    )

    user = relationship("User", back_populates="store")