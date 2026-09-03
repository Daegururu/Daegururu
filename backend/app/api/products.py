from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.product import FinancialProduct, ProductApplication
from app.models.user import User
from app.schemas.product import (
    FinancialProductOut,
    ProductApplicationCreate,
    ProductApplicationOut,
)

router = APIRouter()


@router.get("", response_model=list[FinancialProductOut])
def list_products(type: str | None = None, db: Session = Depends(get_db)):
    stmt = select(FinancialProduct)
    if type:
        stmt = stmt.where(FinancialProduct.type == type)
    return db.scalars(stmt).all()


@router.get("/{product_id}", response_model=FinancialProductOut)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.get(FinancialProduct, product_id)
    if not product:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "상품을 찾을 수 없습니다.")
    return product


@router.post("/applications", response_model=ProductApplicationOut, status_code=201)
def apply_product(
    body: ProductApplicationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    product = db.get(FinancialProduct, body.product_id)
    if not product:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "상품을 찾을 수 없습니다.")

    application = ProductApplication(
        user_id=current_user.user_id,
        product_id=body.product_id,
        applied_amount=body.applied_amount,
        documents=body.documents,
    )
    db.add(application)
    db.commit()
    db.refresh(application)
    return application


@router.get("/applications/mine", response_model=list[ProductApplicationOut])
def my_applications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    stmt = select(ProductApplication).where(ProductApplication.user_id == current_user.user_id)
    return db.scalars(stmt).all()
