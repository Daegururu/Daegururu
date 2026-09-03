import io
import re

import pymupdf
import pytesseract

from PIL import Image, ImageEnhance, ImageFilter, ImageOps
from app.schemas.certificate import CertificateInfo

def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    """
    PDF에서 텍스트를 추출한다.

    1. 텍스트 기반 PDF
       -> PyMuPDF로 직접 텍스트 추출

    2. 이미지 기반 PDF
       -> PDF 페이지를 고해상도 이미지로 변환
       -> 이미지 전처리
       -> Tesseract OCR
    """

    document = pymupdf.open(
        stream=pdf_bytes,
        filetype="pdf"
    )

    extracted_text = []

    for page in document:

        # --------------------------------------------------
        # 1. 일반 PDF인지 먼저 확인
        # --------------------------------------------------

        page_text = page.get_text("text").strip()

        if page_text:
            extracted_text.append(page_text)
            continue

        # --------------------------------------------------
        # 2. 이미지 기반 PDF라면 OCR 수행
        # --------------------------------------------------

        # 기존 2배 → 3배로 확대
        matrix = pymupdf.Matrix(3, 3)

        pix = page.get_pixmap(
            matrix=matrix,
            alpha=False
        )

        image_bytes = pix.tobytes("png")

        image = Image.open(
            io.BytesIO(image_bytes)
        )

        # --------------------------------------------------
        # 3. 이미지 전처리
        # --------------------------------------------------

        image = preprocess_image(image)

        # --------------------------------------------------
        # 4. OCR
        # --------------------------------------------------

        ocr_text = pytesseract.image_to_string(
            image,
            lang="kor+eng",
            config="--oem 3 --psm 6"
        )

        if ocr_text.strip():
            extracted_text.append(
                ocr_text.strip()
            )

    document.close()

    return "\n\n".join(extracted_text).strip()


def preprocess_image(image: Image.Image) -> Image.Image:
    """
    OCR 정확도를 높이기 위한 이미지 전처리
    """

    # 1. RGB → grayscale
    image = image.convert("L")

    # 2. 대비 강화
    image = ImageEnhance.Contrast(image).enhance(2.0)

    # 3. 선명도 강화
    image = ImageEnhance.Sharpness(image).enhance(2.0)

    # 4. 작은 노이즈 제거
    image = image.filter(
        ImageFilter.MedianFilter(size=3)
    )

    # 5. 자동 명암 보정
    image = ImageOps.autocontrast(image)

    # 6. 이진화
    #    밝은 배경 / 어두운 글자 형태로 변환
    threshold = 180

    image = image.point(
        lambda pixel: 255 if pixel > threshold else 0
    )

    return image

def parse_certificate_info(text: str) -> CertificateInfo:
    """
    OCR로 추출한 텍스트에서
    중소기업 확인서 정보를 추출한다.
    """

    return CertificateInfo(
        company_name=extract_value(
            text,
            r"기업명\s*[:：]?\s*(.+)"
        ),

        business_number=extract_value(
            text,
            r"(?:사업자등록번호|샤업자등록번호)\s*[:：]?\s*([\d-]+)"
        ),

        representative_name=extract_value(
            text,
            r"대표자명\s*[:：]?\s*(.+)"
        ),

        business_address=extract_value(
            text,
            r"(?:주\s*소|주소)\s*[:：]?\s*(.+)"
        ),

        main_business=extract_value(
            text,
            r"주업종\s*[:：]?\s*(.+)"
        ),

        valid_from=extract_valid_date(
            text,
            "from"
        ),

        valid_until=extract_valid_date(
            text,
            "until"
        ),

        certificate_type="중소기업 확인서",

        is_small_business=detect_small_business(text)
    )


def extract_value(text: str, pattern: str) -> str | None:
    """
    정규식을 이용해 특정 필드의 값을 추출한다.
    """

    match = re.search(
        pattern,
        text,
        re.MULTILINE
    )

    if not match:
        return None

    value = match.group(1).strip()

    # 줄바꿈으로 인한 불필요한 공백 제거
    value = re.sub(
        r"\s+",
        " ",
        value
    )

    return value


def extract_valid_date(
    text: str,
    target: str
) -> str | None:
    """
    유효기간을 추출한다.

    예:
    2020-04-01~2021-03-31
    """

    match = re.search(
        r"유효기간\s*[:：]?\s*"
        r"(\d{4}[-./]\d{1,2}[-./]\d{1,2})"
        r"\s*[~\-]\s*"
        r"(\d{4}[-./]\d{1,2}[-./]\d{1,2})",
        text
    )

    if not match:
        return None

    date = match.group(
        1 if target == "from" else 2
    )

    # 날짜 형식 통일
    date = date.replace(".", "-")
    date = date.replace("/", "-")

    return date


def detect_small_business(text: str) -> bool | None:
    """
    문서에 소기업/소상공인 관련 문구가 있는지 확인한다.
    """

    if "소기업(소상공인)" in text:
        return True

    if "소기업" in text or "소상공인" in text:
        return True

    return None