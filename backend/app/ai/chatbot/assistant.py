"""05 AI 도우미 — 사용자의 최신 진단 리포트를 컨텍스트로 넣어 Claude와 대화한다."""

import anthropic
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.chat import ChatMessage
from app.models.diagnosis import DiagnosisReport
from app.models.user import User

SYSTEM_PROMPT = """당신은 '대구르르'의 AI 재무 도우미입니다. 소상공인 사장님에게
매출·비용·현금흐름 진단 결과를 바탕으로 이해하기 쉽고 실행 가능한 조언을 한국어로 제공합니다.
전문 용어를 풀어서 설명하고, 숫자 근거를 함께 제시하며, 너무 길지 않게 답하세요."""

_client: anthropic.Anthropic | None = None


def _get_client() -> anthropic.Anthropic | None:
    global _client
    if not settings.ANTHROPIC_API_KEY:
        return None
    if _client is None:
        _client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
    return _client


def _diagnosis_context(db: Session, user: User) -> str:
    report = db.scalars(
        select(DiagnosisReport)
        .where(DiagnosisReport.user_id == user.user_id)
        .order_by(DiagnosisReport.diagnosis_date.desc())
    ).first()
    if not report:
        return "아직 진단 리포트가 없습니다."

    return (
        f"최신 진단({report.diagnosis_date}): 종합점수 {report.composite_score}점, "
        f"위험도 {report.risk_level}. 영역별 점수: {report.sub_scores}."
    )


def generate_reply(db: Session, user: User, history: list[ChatMessage]) -> str:
    client = _get_client()
    context = _diagnosis_context(db, user)

    if client is None:
        return (
            "(AI 연결 미설정) 현재 데모 응답입니다. "
            f"참고용 진단 요약 — {context} "
            "ANTHROPIC_API_KEY를 설정하면 실제 AI 답변으로 전환됩니다."
        )

    messages = [
        {"role": "user" if m.role == "user" else "assistant", "content": m.content}
        for m in history[-20:]
    ]

    response = client.messages.create(
        model="claude-sonnet-5",
        max_tokens=1024,
        system=f"{SYSTEM_PROMPT}\n\n[사장님 진단 컨텍스트]\n{context}",
        messages=messages,
    )
    return "".join(block.text for block in response.content if block.type == "text")
