# 우리 가게 진단 API 명세서

대상 화면: `04 진단 리포트` (Figma `Screens_update` [8], 탭 4개 — 매출추이/고정비/현금흐름/정산은 같은 화면 내 탭이지만, API는 탭별로 분리하여 클릭 시점에만 호출)

---

### [GET] /diagnosis/report

로그인한 사용자의 최신 진단 리포트 기본 정보(종합 위험 점수, 원인 분석, 맞춤 처방)를 조회한다. 화면 진입 시 1회 호출하며, 탭 데이터는 포함하지 않는다.

### 처리 로직

1. 토큰 검증 후 `userId` 추출.
2. 해당 사용자의 최신 `DiagnosisReport`를 `diagnosisDate DESC` 기준으로 1건 조회. 없으면 `hasReport=false` 응답.
3. `sub_scores`(JSONB)에서 종합 점수·위험도 구간을 계산한다.
4. 연관된 `DiagnosisCause`(원인) 목록을 조회한다.
5. 연관된 `Prescription`(처방) 목록을 `rank ASC`로 조회한다.
6. 위 결과를 조합해 반환한다.

### 유효성 검증

| 필드 | 규칙 |
| --- | --- |
| (없음) | 별도 파라미터 없음 — 토큰의 `userId` 기준으로 최신 리포트 1건만 조회 |

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
| — hasReport | Boolean |  | 진단 이력 존재 여부. `false`면 아래 필드는 모두 null/빈 배열 |
| — reportId | Long |  | 리포트 id (탭 API 호출 시 화면 표시용으로만 사용, 조회 자체는 탭 API가 각자 최신 리포트 기준으로 수행) |
| — diagnosisDate | String |  | 진단 일자(YYYY-MM-DD) |
| — compositeScore | Integer |  | 종합 위험 점수(0~100) |
| — riskLevel | String |  | `안전`(0~40) \| `주의`(41~75) \| `위험`(76~100) |
| — causes | Array\<Object\> |  | "왜 위험한가요?" 원인 목록 |
| —— area | String |  | 해당 영역(sales/costStructure/cashflow/settlement/relativePosition) |
| —— summary | String |  | 원인 요약 문장 |
| —— evidence | Array\<String\> |  | 근거 문장 목록 |
| — prescriptions | Array\<Object\> |  | "맞춤 처방" 목록 |
| —— prescriptionId | Long |  | 처방 id (04e 이동 시 사용) |
| —— rank | Integer |  | 표시 순서 |
| —— title | String |  | 처방 제목 |
| —— description | String |  | 처방 한줄 설명 |
| error | Object | Optional |  |

### 응답 형식 (envelope)

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| isSuccess | Boolean | Required | 성공 여부 |
| code | String | Required | 응답 코드(예: DIAG2000) |
| message | String | Required | 응답 메시지 |
| result | Any | Optional | 성공 데이터(실패 시 null) |
| error | Object | Optional | 에러 정보(성공 시 null) |

✅ 성공 : Response 200 OK

```json
{
  "isSuccess": true,
  "code": "DIAG2000",
  "message": "진단 리포트를 조회하였습니다.",
  "result": {
    "hasReport": true,
    "reportId": 1042,
    "diagnosisDate": "2026-08-29",
    "compositeScore": 68,
    "riskLevel": "주의",
    "causes": [
      {
        "area": "costStructure",
        "summary": "최근 매출 감소보다 고정비 비중 증가가 자금 부족에 더 큰 영향을 주고 있습니다.",
        "evidence": [
          "고정비 비중 42.8% — 동일 업종 평균 34.1% 대비 8.7%p 높음",
          "인건비 7,880,000원 — 전월 대비 +18.0% (주휴수당 일시 반영)",
          "순현금흐름 2개월 연속 마이너스 — 8월 -1,240,000원"
        ]
      }
    ],
    "prescriptions": [
      { "prescriptionId": 301, "rank": 1, "title": "인건비 구조 점검", "description": "주휴수당 발생 구간을 피하도록 주간 근무 스케줄을 재배치하면 월 약 62만원 절감이 예상됩니다." },
      { "prescriptionId": 302, "rank": 2, "title": "소상공인 정책자금 신청", "description": "현재 조건으로 iM뱅크 특별운영자금 5,000만원 한도, 연 2.8% 금리 신청이 가능합니다." },
      { "prescriptionId": 303, "rank": 3, "title": "배달 수수료 재협상", "description": "배달 매출 비중 31%, 평균 수수료율 14.2%. 정액제 전환 시 월 약 38만원 절감이 가능합니다." }
    ]
  },
  "error": null
}
```

✅ 성공(진단 이력 없음) : Response 200 OK

```json
{
  "isSuccess": true,
  "code": "DIAG2001",
  "message": "진단 이력이 없습니다.",
  "result": {
    "hasReport": false,
    "reportId": null,
    "diagnosisDate": null,
    "compositeScore": null,
    "riskLevel": null,
    "causes": [],
    "prescriptions": []
  },
  "error": null
}
```

### 에러 응답

| code | HTTP | message | 발생 조건 |
| --- | --- | --- | --- |
| AUTH4010 | 401 | 인증 정보가 유효하지 않습니다. | 토큰 문제 |
| DIAG5000 | 500 | 진단 리포트를 불러오지 못했습니다. | 서버 내부 오류 |

### 연관 테이블

- `사용자(Users)` (본인 확인)
- `진단리포트(DiagnosisReports)` (종합 점수/위험도)
- `진단원인(DiagnosisCauses)` (원인 분석)
- `맞춤처방(Prescriptions)` (처방 목록)

---

### [GET] /diagnosis/report/sales

`04 진단 리포트` [매출 추이] 탭 클릭 시 호출. 최근 12개월 월별 매출 데이터를 조회한다.

### 처리 로직

1. 토큰 검증 후 `userId` 추출.
2. 최신 `DiagnosisReport` 존재 여부 확인. 없으면 `hasData=false` 응답.
3. 최근 12개월 `Transaction(type=매출)`을 월별로 집계한다.
4. 결과를 반환한다.

### 유효성 검증

| 필드 | 규칙 |
| --- | --- |
| (없음) | 별도 파라미터 없음 |

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
| — hasData | Boolean |  | 데이터 존재 여부 |
| — unit | String |  | 단위(예: "만원") |
| — months | Array\<String\> |  | 최근 12개월 라벨(YYYY-MM) |
| — values | Array\<Number\> |  | 월별 매출 값(months와 순서 대응) |
| error | Object | Optional |  |

### 응답 형식 (envelope)

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| isSuccess | Boolean | Required | 성공 여부 |
| code | String | Required | 응답 코드(예: DIAGSALES2000) |
| message | String | Required | 응답 메시지 |
| result | Any | Optional | 성공 데이터(실패 시 null) |
| error | Object | Optional | 에러 정보(성공 시 null) |

✅ 성공 : Response 200 OK

```json
{
  "isSuccess": true,
  "code": "DIAGSALES2000",
  "message": "매출 추이 데이터를 조회하였습니다.",
  "result": {
    "hasData": true,
    "unit": "만원",
    "months": ["2025-09", "2025-10", "2025-11", "2025-12", "2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06", "2026-07", "2026-08"],
    "values": [1650, 1720, 1590, 1810, 1790, 1680, 1640, 1600, 1690, 1580, 1520, 1842]
  },
  "error": null
}
```

### 에러 응답

| code | HTTP | message | 발생 조건 |
| --- | --- | --- | --- |
| AUTH4010 | 401 | 인증 정보가 유효하지 않습니다. | 토큰 문제 |
| DIAGSALES5000 | 500 | 매출 추이 데이터를 불러오지 못했습니다. | 서버 내부 오류(집계 쿼리 실패 등) |

### 연관 테이블

- `사용자(Users)` (본인 확인)
- `거래내역(Transactions)` (월별 매출 집계)

---

### [GET] /diagnosis/report/fixed-cost

`04 진단 리포트` [고정비] 탭 클릭 시 호출. 이번 달 고정비 카테고리별 구성을 조회한다.

### 처리 로직

1. 토큰 검증 후 `userId` 추출.
2. 최신 `DiagnosisReport` 존재 여부 확인. 없으면 `hasData=false` 응답.
3. 이번 달 `Transaction(type=고정비)`을 `category`별로 집계한다.
4. 결과를 반환한다.

### 유효성 검증

| 필드 | 규칙 |
| --- | --- |
| (없음) | 별도 파라미터 없음 |

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
| — hasData | Boolean |  | 데이터 존재 여부 |
| — items | Array\<Object\> |  | 카테고리별 구성 |
| —— category | String |  | 인건비/임대료/기타 |
| —— amount | Long |  | 금액(원) |
| —— pct | Number |  | 비중(%) |
| error | Object | Optional |  |

### 응답 형식 (envelope)

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| isSuccess | Boolean | Required | 성공 여부 |
| code | String | Required | 응답 코드(예: DIAGCOST2000) |
| message | String | Required | 응답 메시지 |
| result | Any | Optional | 성공 데이터(실패 시 null) |
| error | Object | Optional | 에러 정보(성공 시 null) |

✅ 성공 : Response 200 OK

```json
{
  "isSuccess": true,
  "code": "DIAGCOST2000",
  "message": "고정비 데이터를 조회하였습니다.",
  "result": {
    "hasData": true,
    "items": [
      { "category": "인건비", "amount": 7880000, "pct": 38 },
      { "category": "임대료", "amount": 7050000, "pct": 34 },
      { "category": "기타", "amount": 5800000, "pct": 28 }
    ]
  },
  "error": null
}
```

### 에러 응답

| code | HTTP | message | 발생 조건 |
| --- | --- | --- | --- |
| AUTH4010 | 401 | 인증 정보가 유효하지 않습니다. | 토큰 문제 |
| DIAGCOST5000 | 500 | 고정비 데이터를 불러오지 못했습니다. | 서버 내부 오류(집계 쿼리 실패 등) |

### 연관 테이블

- `사용자(Users)` (본인 확인)
- `거래내역(Transactions)` (카테고리별 고정비 집계)

---

### [GET] /diagnosis/report/cashflow

`04 진단 리포트` [현금흐름] 탭 클릭 시 호출. 최근 12개월 순현금흐름 추이를 조회한다.

### 처리 로직

1. 토큰 검증 후 `userId` 추출.
2. 최신 `DiagnosisReport` 존재 여부 확인. 없으면 `hasData=false` 응답.
3. 최근 12개월 `Transaction`을 월별로 집계해 순현금흐름(매출 − 고정비 등)을 계산한다.
4. 결과를 반환한다.

### 유효성 검증

| 필드 | 규칙 |
| --- | --- |
| (없음) | 별도 파라미터 없음 |

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
| — hasData | Boolean |  | 데이터 존재 여부 |
| — unit | String |  | 단위(예: "만원") |
| — months | Array\<String\> |  | 최근 12개월 라벨(YYYY-MM) |
| — values | Array\<Number\> |  | 월별 순현금흐름 값(음수 가능, months와 순서 대응) |
| error | Object | Optional |  |

### 응답 형식 (envelope)

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| isSuccess | Boolean | Required | 성공 여부 |
| code | String | Required | 응답 코드(예: DIAGCASH2000) |
| message | String | Required | 응답 메시지 |
| result | Any | Optional | 성공 데이터(실패 시 null) |
| error | Object | Optional | 에러 정보(성공 시 null) |

✅ 성공 : Response 200 OK

```json
{
  "isSuccess": true,
  "code": "DIAGCASH2000",
  "message": "현금흐름 데이터를 조회하였습니다.",
  "result": {
    "hasData": true,
    "unit": "만원",
    "months": ["2025-09", "2025-10", "2025-11", "2025-12", "2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06", "2026-07", "2026-08"],
    "values": [120, 95, 140, -30, 60, 40, -80, -50, 30, -20, -90, -124]
  },
  "error": null
}
```

### 에러 응답

| code | HTTP | message | 발생 조건 |
| --- | --- | --- | --- |
| AUTH4010 | 401 | 인증 정보가 유효하지 않습니다. | 토큰 문제 |
| DIAGCASH5000 | 500 | 현금흐름 데이터를 불러오지 못했습니다. | 서버 내부 오류(집계 쿼리 실패 등) |

### 연관 테이블

- `사용자(Users)` (본인 확인)
- `거래내역(Transactions)` (월별 순현금흐름 집계)

---

### [GET] /diagnosis/report/settlement

`04 진단 리포트` [정산] 탭 클릭 시 호출. 평균 수수료율·정산 소요일을 조회한다.

### 처리 로직

1. 토큰 검증 후 `userId` 추출.
2. 최신 `DiagnosisReport` 존재 여부 확인. 없으면 `hasData=false` 응답.
3. 최근 정산 내역에서 평균 수수료율, 평균 정산 소요일을 계산한다.
4. 결과를 반환한다.

### 유효성 검증

| 필드 | 규칙 |
| --- | --- |
| (없음) | 별도 파라미터 없음 |

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
| — hasData | Boolean |  | 데이터 존재 여부 |
| — avgFeeRatePct | Number |  | 평균 수수료율(%) |
| — avgSettlementLagDays | Number |  | 평균 정산 소요일 |
| error | Object | Optional |  |

### 응답 형식 (envelope)

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| isSuccess | Boolean | Required | 성공 여부 |
| code | String | Required | 응답 코드(예: DIAGSETL2000) |
| message | String | Required | 응답 메시지 |
| result | Any | Optional | 성공 데이터(실패 시 null) |
| error | Object | Optional | 에러 정보(성공 시 null) |

✅ 성공 : Response 200 OK

```json
{
  "isSuccess": true,
  "code": "DIAGSETL2000",
  "message": "정산 데이터를 조회하였습니다.",
  "result": {
    "hasData": true,
    "avgFeeRatePct": 2.3,
    "avgSettlementLagDays": 2.1
  },
  "error": null
}
```

### 에러 응답

| code | HTTP | message | 발생 조건 |
| --- | --- | --- | --- |
| AUTH4010 | 401 | 인증 정보가 유효하지 않습니다. | 토큰 문제 |
| DIAGSETL5000 | 500 | 정산 데이터를 불러오지 못했습니다. | 서버 내부 오류(집계 쿼리 실패 등) |

### 연관 테이블

- `사용자(Users)` (본인 확인)
- `정산내역(Settlements)` (수수료율/정산 소요일 집계)

### 참고

- 화면 진입 시 `/diagnosis/report`만 호출하고, 4개 탭 데이터는 사용자가 해당 탭을 클릭하는 시점에 각각 호출(지연 로딩)한다. 프론트에서 한 번 불러온 탭은 캐싱해 재클릭 시 재요청하지 않는다.
- 4개 탭 API는 모두 "최신 리포트" 기준으로 각자 조회하므로 `reportId`를 파라미터로 넘기지 않는다. 진단 시점과 탭 조회 시점 사이에 새 진단이 생성되는 경우는 사실상 발생하지 않는다고 가정한다(진단은 온보딩/재진단 액션에서만 실행됨).
- "맞춤 처방" [실행하기] 클릭 시 이동하는 `04e 처방 실행` 화면의 상세 조회·상태 변경 API는 별도 문서(`api-prescription.md`, 미작성)에서 다룰 것.
