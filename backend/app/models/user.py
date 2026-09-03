from datetime import date, datetime

from sqlalchemy import Boolean, Date, DateTime, ForeignKey, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class User(Base):
    """사업자 계정 — 온보딩 01c/02a에서 입력받는 정보."""

    __tablename__ = "users"

    user_id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    business_reg_no: Mapped[str] = mapped_column(String(20), unique=True, index=True)
    business_name: Mapped[str] = mapped_column(String(100))
    representative_name: Mapped[str] = mapped_column(String(50))
    industry_code: Mapped[str] = mapped_column(String(20), index=True)
    region_code: Mapped[str] = mapped_column(String(20), index=True)
    open_date: Mapped[date] = mapped_column(Date)
    login_id: Mapped[str] = mapped_column(String(20), unique=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    phone: Mapped[str] = mapped_column(String(20))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    notification_setting: Mapped["NotificationSetting"] = relationship(
        back_populates="user", uselist=False, cascade="all, delete-orphan"
    )
    data_sources: Mapped[list["DataSourceConnection"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    transactions: Mapped[list["Transaction"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    diagnosis_reports: Mapped[list["DiagnosisReport"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    product_applications: Mapped[list["ProductApplication"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    chat_messages: Mapped[list["ChatMessage"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )


class NotificationSetting(Base):
    """마이페이지(10c) 알림 설정 — User와 1:1."""

    __tablename__ = "notification_settings"

    user_id: Mapped[int] = mapped_column(ForeignKey("users.user_id"), primary_key=True)
    email: Mapped[str | None] = mapped_column(String(100), nullable=True)
    email_enabled: Mapped[bool] = mapped_column(Boolean, default=False)

    user: Mapped["User"] = relationship(back_populates="notification_setting")
