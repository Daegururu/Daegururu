"""기업마당(bizinfo) 지원사업 정보를 external_support_programs 테이블에 동기화한다.

실행: venv/Scripts/python scripts/sync_bizinfo_programs.py
cron 등록 시 하루 1회 정도면 충분하다 (공고는 자주 갱신되지 않음).
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.core.database import SessionLocal
from app.services.bizinfo_sync import sync_bizinfo_programs


def main():
    db = SessionLocal()
    try:
        count = sync_bizinfo_programs(db)
        print(f"synced: {count}건")
    finally:
        db.close()


if __name__ == "__main__":
    main()
