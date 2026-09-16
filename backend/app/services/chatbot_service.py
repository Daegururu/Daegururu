"""AI 도우미(05) 채팅 응답. 실제 데이터를 컨텍스트로 만들어 LLM에 넘기고, LLM은 그 데이터 안에서만 답한다."""
from datetime import date

from google import genai
from google.genai import types
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models import User
from app.services.aggregations import (
    FIXED_COST_CATEGORIES,
    diff,
    fixed_cost_this_month,
    last_12_months,
    monthly_fixed_cost_series,
    monthly_sales_series,
)
from app.services.finance_matching import business_years, match_products
from app.services.sales_service import get_sales_summary

_MODEL = "gemini-3.6-flash"
_MAX_TOKENS = 500

_SYSTEM_PROMPT = (
    "당신은 소상공인 사장님을 돕는 '대구르르' 서비스의 AI 도우미입니다. "
    "아래 [사용자 데이터]에 있는 사실만 근거로 답변하고, 데이터에 없는 숫자나 정보는 절대 지어내지 마세요. "
    "사장님에게 말하듯 존댓말로, 2~4문장 내로 간결하게 답하세요. "
    "여러 항목을 나열할 때는 '· '로 시작하는 줄로 구분하세요. "
    "[사용자 데이터]에 근거가 없는 주제(예: 세금)를 물으면 아직 지원하지 않는 기능이라고 솔직히 답하세요."
)


def _format_won(amount: int) -> str:
    return f"{amount:,}원"


def _format_rate(rate: float) -> str:
    text = f"{float(rate):.2f}".rstrip("0").rstrip(".")
    return f"연 {text}%"


def _pct_text(pct: float | None) -> str:
    if pct is None:
        return "전월 데이터가 없어 비교하기 어렵습니다"
    if pct > 0:
        return f"전월 대비 {pct}% 늘었습니다"
    if pct < 0:
        return f"전월 대비 {abs(pct)}% 줄었습니다"
    return "전월과 변동이 없습니다"


def _build_context(db: Session, user: User, today: date) -> str:
    store = user.store
    months = last_12_months(today)
    sales_series = monthly_sales_series(db, user.user_id, months)
    fixed_cost_series = monthly_fixed_cost_series(db, user.user_id, months)

    this_sales, last_sales = sales_series[-1], sales_series[-2]
    sales_pct, _ = diff(this_sales, last_sales)

    this_cost, last_cost = fixed_cost_series[-1], fixed_cost_series[-2]
    cost_pct, _ = diff(this_cost, last_cost)
    cost_breakdown = fixed_cost_this_month(db, user.user_id, today)

    month_key = f"{today.year:04d}-{today.month:02d}"
    settlement_summary = get_sales_summary(db, user, month_key)

    matched = match_products(db, store, sales_series, top_n=3)
    years = business_years(store)
    monthly_revenue = round(sum(sales_series) / 12)
    industry = store.industry_name if store is not None else "정보 없음"

    lines = [
        f"- 이번 달 매출: {_format_won(this_sales)} (전월 {_format_won(last_sales)}, {_pct_text(sales_pct)})",
        f"- 이번 달 고정비: {_format_won(this_cost)} (전월 {_format_won(last_cost)}, {_pct_text(cost_pct)})",
    ]
    lines += [f"  · {cat}: {_format_won(cost_breakdown[cat])}" for cat in FIXED_COST_CATEGORIES]
    lines += [f"- {row['label']}: {row['value']} ({row['caption']})" for row in settlement_summary]
    lines.append(
        f"- 가게 정보: 사업기간 {years:.1f}년, {industry}, 최근 12개월 월평균 매출 {_format_won(monthly_revenue)}"
    )

    if matched:
        lines.append(f"- 매칭되는 지원금/대출 상품 {len(matched)}건:")
        lines += [
            f"  · {product.name} — 한도 {_format_won(product.limit_amount)} / {_format_rate(product.interest_rate)}"
            for product in matched
        ]
    else:
        lines.append("- 매칭되는 지원금/대출 상품: 없음")

    lines.append("- 세금(부가세·종합소득세) 관련 데이터: 시스템에 없음")

    return "\n".join(lines)


def _ask_llm(context: str, message: str) -> str:
    client = genai.Client(api_key=settings.GEMINI_API_KEY)
    response = client.models.generate_content(
        model=_MODEL,
        contents=f"[사용자 데이터]\n{context}\n\n[질문]\n{message}",
        config=types.GenerateContentConfig(
            system_instruction=_SYSTEM_PROMPT,
            max_output_tokens=_MAX_TOKENS,
            thinking_config=types.ThinkingConfig(thinking_budget=0),
        ),
    )
    return response.text


def get_chat_reply(db: Session, user: User, message: str) -> dict:
    today = date.today()
    context = _build_context(db, user, today)
    reply_text = _ask_llm(context, message)
    paragraphs = [line.strip() for line in reply_text.split("\n") if line.strip()]
    return {"paragraphs": paragraphs}
