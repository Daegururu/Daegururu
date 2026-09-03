"""점수 산출에 쓰는 기준값과 처방 템플릿.

실제 서비스에서는 이 값들을 소진공 상권정보시스템 등 외부 데이터로 캘리브레이션해야 한다.
지금은 프로토타입 단계의 합리적인 기본값으로 둔다.
"""

# 업종 벤치마크가 없을 때 쓰는 fallback 기준선
DEFAULT_BENCHMARK = {
    "avg_fixed_cost_ratio": 0.35,
    "avg_labor_cost_ratio": 0.28,
    "avg_monthly_sales": 15_000_000,
}

RISK_THRESHOLDS = {
    "안전": 70,
    "주의": 40,
    # 40 미만은 위험
}

# area -> (rank, type, title) 매핑에 쓰는 처방 카탈로그.
# 점수가 가장 낮은(=위험한) 영역부터 순서대로 매칭한다.
PRESCRIPTIONS_BY_AREA = {
    "cost_structure": {
        "type": "labor_cost",
        "title": "인건비 구조 점검",
    },
    "sales": {
        "type": "sales_growth",
        "title": "매출 채널 다각화 지원",
    },
    "cashflow": {
        "type": "policy_fund",
        "title": "운영자금 정책자금 신청",
    },
    "settlement": {
        "type": "fee_negotiation",
        "title": "결제 수수료 재협상",
    },
    "relative_position": {
        "type": "benchmark_coaching",
        "title": "업종 평균 대비 개선 컨설팅",
    },
}

AREA_LABELS = {
    "sales": "매출",
    "cost_structure": "비용구조",
    "cashflow": "현금흐름",
    "settlement": "정산",
    "relative_position": "상대위치",
}
