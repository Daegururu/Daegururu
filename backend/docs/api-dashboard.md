# 홈 대시보드 API 명세서

대상 화면: `03 홈 대시보드` (Figma `Screens_update` [7])

---

### [GET] /dashboard/summary

로그인한 사용자의 홈 대시보드 데이터(위험도, 지표, 현금흐름/고정비 차트, 추천 지원사업)를 한 번에 조회한다.

### 처리 로직

1. 토큰 검증 후 `userId` 추출.
2. 해당 사용자의 최신 `DiagnosisReport`를 조회한다. 이력이 없으면 `hasReport=false`로 응답하고 이후 항목은 빈 값으로 채운다.
3. 이번 달 `Transaction`을 집계해 매출/고정비 비중/정산예정/현금흐름 지표를 계산한다.
4. 최근 12개월 `Transaction(type=매출)`을 월별로 집계해 현금흐름 차트 데이터를 만들고, `industry_benchmarks`에서 업종·지역 평균을 조회해 참고선 데이터를 함께 구성한다(없으면 `available=false`).
5. 이번 달 `Transaction(type=고정비)`을 `category`별로 집계해 고정비 구성 비율을 계산하고, 위와 같은 방식으로 업종 평균 비교값을 채운다.
6. 사용자 프로필·진단 데이터와 `financial_products.eligibility_rules`를 비교해 자격을 충족하는 상품 중 상위 3건을 뽑는다.
7. 위 결과를 조합해 반환한다.

### 유효성 검증

| 필드 | 규칙 |
| --- | --- |
| (없음) | 이 엔드포인트는 별도 파라미터를 받지 않음 — 항상 토큰의 `userId` 기준으로 조회 |

### Request

**Request Header**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| Authorization | String | Required | accessToken |

```
Authorization : Bearer accessToken
```

**Query Parameter**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| (없음) | - | - | - |

### Response

**Response Body**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| isSuccess | Boolean | Required |  |
| code | String | Required |  |
| message | String | Required |  |
| result | Object | Optional |  |
| — hasReport | Boolean |  | 진단 이력 존재 여부. `false`면 아래 risk/metrics/chart 값은 0 또는 빈 배열 |
| — risk | Object |  | RiskGauge + 상단 요약 카드 |
| —— compositeScore | Integer |  | 종합 위험 점수(0~100) |
| —— riskLevel | String |  | `안전` \| `주의` \| `위험` |
| —— updatedAt | String |  | 진단 갱신일(YYYY-MM-DD) |
| —— summary | String |  | 원인 요약 1~2문장 |
| — metrics | Object |  | 지표 타일 4개 |
| —— monthlySales | Object |  | 이번 달 매출 |
| ——— amount | Long |  | 금액(원) |
| ——— diffPct | Number |  | 전월 대비 증감률(%) |
| ——— diffDirection | String |  | `up` \| `down` \| `null` |
| —— fixedCostRatio | Object |  | 고정비 비중 |
| ——— valuePct | Number |  | 이번 달 고정비 비중(%) |
| ——— diffPct | Number |  | 전월 대비 증감(%p) |
| ——— diffDirection | String |  | `up` \| `down` \| `null` |
| —— settlementUpcoming | Object |  | 정산 예정 |
| ——— amount | Long |  | 금액(원) |
| ——— note | String |  | "9월 4일 입금 예정" 등 안내 문구 |
| —— cashflow | Object |  | 현금흐름 |
| ——— amount | Long |  | 금액(원), 음수 가능 |
| ——— note | String |  | "2개월 연속 마이너스" 등 안내 문구 |
| — cashflowChart | Object |  | 현금흐름 추이 라인차트 |
| —— unit | String |  | 단위(예: "만원") |
| —— months | Array\<String\> |  | 최근 12개월 라벨(YYYY-MM) |
| —— values | Array\<Number\> |  | 월별 매출 값(months와 순서 대응) |
| —— industryAvgReference | Object |  | 업종 평균 참고선(라디오 [표시]/[해제]용) |
| ——— available | Boolean |  | `false`면 프론트는 참고선 라디오를 비활성화 |
| ——— value | Number |  | 참고선 값(available=false면 null) |
| ——— source | String |  | 데이터 출처 식별자(예: `daegu_carddata`) |
| — fixedCostBreakdown | Object |  | 고정비 구성 도넛차트 |
| —— items | Array\<Object\> |  | 카테고리별 구성 |
| ——— category | String |  | `인건비` / `임대료` / `기타 고정비` |
| ——— pct | Number |  | 구성 비율(%) |
| ——— industryAvgPct | Number |  | 업종 평균 비율(%), 미제공 시 null |
| —— industryAvgAvailable | Boolean |  | `false`면 [업종 평균 비교] 라디오 비활성화 |
| — recommendedProducts | Array\<Object\> |  | 추천 지원사업 카드 (자격 매칭 완료된 상위 3건) |
| —— productId | Long |  | 상품 id |
| —— name | String |  | 상품명 |
| —— limitAmount | Long |  | 한도(원) |
| —— interestRate | Number |  | 금리(%) |
| error | Object | Optional |  |

### 응답 형식 (envelope)

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| isSuccess | Boolean | Required | 성공 여부 |
| code | String | Required | 응답 코드(예: DASH2000) |
| message | String | Required | 응답 메시지 |
| result | Any | Optional | 성공 데이터(실패 시 null) |
| error | Object | Optional | 에러 정보(성공 시 null) |

✅ 성공 : Response 200 OK

```json
{
  "isSuccess": true,
  "code": "DASH2000",
  "message": "홈 대시보드 데이터를 조회하였습니다.",
  "result": {
    "hasReport": true,
    "risk": {
      "compositeScore": 68,
      "riskLevel": "주의",
      "updatedAt": "2026-08-29",
      "summary": "최근 매출 감소보다 고정비 비중 증가가 자금 부족에 더 큰 영향을 주고 있습니다. 인건비가 전월 대비 18% 늘었고, 8월 주휴수당 정산분이 일시에 반영된 영향입니다."
    },
    "metrics": {
      "monthlySales": { "amount": 18420000, "diffPct": 6.2, "diffDirection": "up" },
      "fixedCostRatio": { "valuePct": 42.8, "diffPct": 5.1, "diffDirection": "up" },
      "settlementUpcoming": { "amount": 3180000, "note": "9월 4일 입금 예정" },
      "cashflow": { "amount": -1240000, "note": "2개월 연속 마이너스" }
    },
    "cashflowChart": {
      "unit": "만원",
      "months": ["2025-09", "2025-10", "2025-11", "2025-12", "2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06", "2026-07", "2026-08"],
      "values": [1650, 1720, 1590, 1810, 1790, 1680, 1640, 1600, 1690, 1580, 1520, 1440],
      "industryAvgReference": { "available": true, "value": 1650, "source": "daegu_carddata" }
    },
    "fixedCostBreakdown": {
      "items": [
        { "category": "인건비", "pct": 38, "industryAvgPct": 32 },
        { "category": "임대료", "pct": 34, "industryAvgPct": 29 },
        { "category": "기타 고정비", "pct": 28, "industryAvgPct": 39 }
      ],
      "industryAvgAvailable": true
    },
    "recommendedProducts": [
      { "productId": 12, "name": "대구시 골목상권 활력자금", "limitAmount": 20000000, "interestRate": 1.5 },
      { "productId": 7, "name": "iM뱅크 소상공인 특별운영자금", "limitAmount": 50000000, "interestRate": 2.8 },
      { "productId": 3, "name": "소상공인시장진흥공단 정책자금", "limitAmount": 70000000, "interestRate": 3.2 }
    ]
  },
  "error": null
}
```

✅ 성공(진단 이력 없음) : Response 200 OK

```json
{
  "isSuccess": true,
  "code": "DASH2001",
  "message": "진단 이력이 없습니다.",
  "result": {
    "hasReport": false,
    "risk": null,
    "metrics": null,
    "cashflowChart": null,
    "fixedCostBreakdown": null,
    "recommendedProducts": []
  },
  "error": null
}
```

### 에러 응답

| code | HTTP | message | 발생 조건 |
| --- | --- | --- | --- |
| AUTH4010 | 401 | 인증 정보가 유효하지 않습니다. | 토큰 문제 |
| DASH5000 | 500 | 대시보드 데이터를 불러오지 못했습니다. | 서버 내부 오류(집계 쿼리 실패 등) |

### 연관 테이블

- `사용자(Users)` (본인 확인)
- `진단리포트(DiagnosisReports)` (위험도/원인 조회)
- `거래내역(Transactions)` (지표·차트 집계)
- `업종벤치마크(IndustryBenchmarks)` (업종 평균 참고선/비교)
- `금융상품(FinancialProducts)` (추천 지원사업 매칭)
