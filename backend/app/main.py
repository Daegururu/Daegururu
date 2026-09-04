from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api import certificates

# 모델을 import해야 Base.metadata에 테이블이 등록된다 (Alembic autogenerate 대비).
from app import models  # noqa: F401

app = FastAPI(title="대구르르 API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "ok", "env": settings.ENV}


# 라우터는 기능 구현되는 대로 여기에 등록:
# from app.api import auth, diagnosis, products, chat
# app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
# app.include_router(diagnosis.router, prefix="/api/v1/diagnosis", tags=["diagnosis"])
# app.include_router(products.router, prefix="/api/v1/products", tags=["products"])
# app.include_router(chat.router, prefix="/api/v1/chat", tags=["chat"])

#pdf 텍스트 추출 라우터
app.include_router(
    certificates.router,
    prefix="/api/v1"
)