from fastapi import APIRouter, UploadFile, File, HTTPException

from app.services.certificate_parser import (
    extract_text_from_pdf,
    parse_certificate_info
)
from app.schemas.certificate import CertificateInfo

router = APIRouter(
    prefix="/certificates",
    tags=["certificates"]
)


@router.post(
    "/upload",
    response_model=CertificateInfo
)
async def upload_certificate(
    file: UploadFile = File(...)
):
    # PDF 파일인지 확인
    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="PDF 파일만 업로드할 수 있습니다."
        )

    # 파일 읽기
    pdf_bytes = await file.read()

    if not pdf_bytes:
        raise HTTPException(
            status_code=400,
            detail="빈 PDF 파일입니다."
        )

    # PDF 텍스트 추출
    text = extract_text_from_pdf(
        pdf_bytes
    )

    if not text.strip():
        raise HTTPException(
            status_code=400,
            detail="PDF에서 텍스트를 추출할 수 없습니다."
        )

    # OCR 결과를 CertificateInfo로 변환
    certificate_info = parse_certificate_info(
        text
    )

    return certificate_info