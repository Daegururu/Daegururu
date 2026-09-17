"""기업마당(bizinfo) 지원사업정보 API 동기화.

자격조건이 자유서술 텍스트(trgetNm)라 FinancialProduct.eligibility_rules 같은
구조화 매칭에는 쓰지 않는다 — ExternalSupportProgram에 원본 그대로 저장해
목록에 노출만 한다.
"""
import logging
from datetime import date, datetime

import httpx
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models import ExternalSupportProgram

logger = logging.getLogger(__name__)

BIZINFO_API_URL = "https://www.bizinfo.go.kr/uss/rss/bizinfoApi.do"


def _parse_date(value: str | None) -> date | None:
    if not value:
        return None
    try:
        return datetime.strptime(value.strip(), "%Y-%m-%d").date()
    except ValueError:
        return None


def _split_period(period: str | None) -> tuple[date | None, date | None]:
    if not period or "~" not in period:
        return None, None
    start, end = period.split("~", 1)
    return _parse_date(start), _parse_date(end)


def fetch_bizinfo_programs(hashtags: str = "금융", page_unit: int = 100) -> list[dict]:
    """hashtags로 필터링한 공고 목록을 페이지네이션으로 끝까지 가져온다."""
    if not settings.BIZINFO_API_KEY:
        raise RuntimeError("BIZINFO_API_KEY가 설정되지 않았습니다.")

    items: list[dict] = []
    page_index = 1
    with httpx.Client(timeout=10.0) as client:
        while True:
            response = client.get(
                BIZINFO_API_URL,
                params={
                    "crtfcKey": settings.BIZINFO_API_KEY,
                    "dataType": "json",
                    "hashtags": hashtags,
                    "pageUnit": page_unit,
                    "pageIndex": page_index,
                },
            )
            response.raise_for_status()
            body = response.json()

            if "reqErr" in body:
                raise RuntimeError(f"bizinfo API 오류: {body['reqErr']}")

            page_items = body.get("jsonArray", [])
            if not page_items:
                break

            items.extend(page_items)
            if len(page_items) < page_unit:
                break
            page_index += 1

    return items


def sync_bizinfo_programs(db: Session, hashtags: str = "금융") -> int:
    """bizinfo 공고를 가져와 external_id 기준으로 upsert한다. 반영된 건수를 반환한다."""
    items = fetch_bizinfo_programs(hashtags)

    synced = 0
    for item in items:
        external_id = item.get("pblancId")
        if not external_id:
            continue

        start_date, end_date = _split_period(item.get("reqstBeginEndDe"))

        program = (
            db.query(ExternalSupportProgram)
            .filter(ExternalSupportProgram.external_id == external_id)
            .first()
        )
        if program is None:
            program = ExternalSupportProgram(source="bizinfo", external_id=external_id)
            db.add(program)

        program.title = item.get("pblancNm", "")
        program.target = item.get("trgetNm", "")
        program.category = item.get("pldirSportRealmLclasCodeNm", "")
        program.agency = item.get("jrsdInsttNm", "")
        program.summary = item.get("bsnsSumryCn", "")
        program.apply_start_date = start_date
        program.apply_end_date = end_date
        program.detail_url = item.get("pblancUrl", "")
        synced += 1

    db.commit()
    logger.info("bizinfo 지원사업 %d건 동기화 완료", synced)
    return synced
