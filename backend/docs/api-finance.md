# 금융지원 API 명세서

대상 화면: `금융지원 목록` / `금융지원 상세`

---

### 테스트 계정 / 목데이터

`backend/scripts/seed_dashboard_test_data.py` 실행 시 생성되는 로컬 DB 시드 데이터. 재실행해도 안전(reset-and-reseed)하며, DB가 초기화됐을 때는 아래 명령으로 다시 채울 수 있다.

```
venv/Scripts/python scripts/seed_dashboard_test_data.py
```

**로그인 계정**

| 용도 | business_reg_no | password | 비고 |
| --- | --- | --- | --- |
| 정상 응답 테스트 | 000-00-00002 | seedpass1234! | 대표자 "김영수", 가게 "영수네 국밥"(대구광역시 중구 동성로 12, 한식음식점업, 개업 3년 2개월 전) 등록됨 |
| 빈 상태 테스트 | 000-00-00001 | seedpass1234! | 가게 미등록 → `matchBanner: null`, 자격조건 중 업력/지역 항목 미충족 처리 |

로그인은 `/auth/login`으로 진행해 accessToken 발급받아 사용한다.

**금융 상품 목데이터** (`FinancialProduct`, id는 로컬 DB 상태에 따라 달라질 수 있음 — 현재 로컬 기준)

| productId | name | category | limit | rate |
| --- | --- | --- | --- | --- |
| 7 | 대구시 골목상권 활력자금 | policy | 2,000만원 | 연 1.50% |
| 8 | iM뱅크 소상공인 특별운영자금 | operating | 5,000만원 | 연 2.80% |
| 9 | 소상공인시장진흥공단 정책자금 | policy | 7,000만원 | 연 3.20% |

**외부 지원사업 공고 (기업마당 bizinfo 연동)**

`.env`에 `BIZINFO_API_KEY` 설정 후 아래 명령으로 동기화한다. 자격 매칭 없이 원문 그대로 저장되며, `/finance/products` 응답의 `externalPrograms`에 노출된다.

```
venv/Scripts/python scripts/sync_bizinfo_programs.py
```

운영 환경에서는 하루 1회 정도 cron으로 등록해두면 된다(공고가 자주 갱신되지 않음).

---

### [GET] /finance/products

로그인한 사용자의 사업 정보(업력·지역·연매출)를 기준으로 금융/지원사업 상품 목록과 자격 충족 여부를 조회한다.

### 처리 로직

1. 토큰 검증 후 `userId` 추출, 사용자의 `Store` 조회(없으면 매칭 조건에서 해당 항목은 통과 처리).
2. 최근 12개월 `Transaction(type=매출)`을 합산해 연매출을 추정한다.
3. `Store.open_date` 기준 업력(년)을 계산하고, `Store.business_address` 앞 2개 토큰(시/도 + 구/군)으로 지역을 추출한다.
4. `category` 쿼리 파라미터가 있으면 `FinancialProducts.category`로 필터링한다.
5. 각 상품의 `eligibility_rules`(최소 업력 / 최대 연매출 / 지역)와 위 값들을 비교해 자격 충족 여부(`status`)를 계산한다.
6. 자격 충족 상품이 앞에 오도록 정렬한다.
7. `Store`가 있으면 업력·월매출·업종 정보를 요약한 매칭 배너를 함께 구성해 반환한다.
8. `ExternalSupportProgram`(기업마당 bizinfo 동기화 데이터) 중 신청 마감이 지나지 않은 공고를 최신순 20건 조회해 `externalPrograms`로 함께 반환한다. 이 목록은 자격 매칭을 하지 않는다(공공데이터 자격조건이 자유서술 텍스트라 자동 판정 불가).

### 유효성 검증

| 필드 | 규칙 |
| --- | --- |
| category | 선택. `operating`(운영자금) \| `facility`(시설자금) \| `policy`(정책자금) 중 하나. 미지정 시 전체 조회 |

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
| category | String | Optional | `operating` \| `facility` \| `policy` |

### Response

**Response Body**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| isSuccess | Boolean | Required |  |
| code | String | Required |  |
| message | String | Required |  |
| result | Object | Optional |  |
| — matchBanner | Object |  | `Store` 정보가 없으면 `null` |
| —— title | String |  | "사업기간 2년 3개월 · 월매출 1,540만원 · 한식음식점 기준" 형태 요약 |
| —— description | String |  | "신청 가능한 소상공인 지원사업 N건을 찾았습니다..." 안내 문구 |
| — products | Array\<Object\> |  | 자격 충족 상품이 앞에 오도록 정렬됨 |
| —— productId | Long |  | 상품 id |
| —— name | String |  | 상품명 |
| —— logoText | String |  | 카드 로고 자리 텍스트(예: "iM", "대구") |
| —— provider | String |  | 취급 기관명 |
| —— category | String |  | `operating` \| `facility` \| `policy` |
| —— target | String |  | 보조 문구 마지막 조각(예: "골목상권 점포 대상") |
| —— limit | String |  | 한도 금액 표시 문자열(예: "5,000만원") |
| —— rate | String |  | 금리 표시 문자열(예: "연 2.5%") |
| —— term | String |  | 대출 기간 표시 문자열(예: "5년") |
| —— status | String |  | `신청 가능` \| `자격 미충족` |
| — externalPrograms | Array\<Object\> |  | 기업마당(bizinfo) 공공데이터 연동 지원사업 공고. 자격 매칭 없이 원문 그대로 노출 |
| —— title | String |  | 공고명 |
| —— agency | String |  | 소관기관 |
| —— target | String |  | 지원대상 원문(자유서술, 자격 판정에 쓰지 않음) |
| —— applyPeriod | String |  | "YYYY-MM-DD ~ YYYY-MM-DD", 기간 정보 없으면 null |
| —— detailUrl | String |  | bizinfo 공고 상세 페이지 링크 |
| —— source | String |  | 데이터 출처(현재 `bizinfo` 고정) |
| error | Object | Optional |  |

### 응답 형식 (envelope)

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| isSuccess | Boolean | Required | 성공 여부 |
| code | String | Required | 응답 코드(예: FIN2000) |
| message | String | Required | 응답 메시지 |
| result | Any | Optional | 성공 데이터(실패 시 null) |
| error | Object | Optional | 에러 정보(성공 시 null) |

✅ 성공 : Response 200 OK

```json
{
  "isSuccess": true,
  "code": "FIN2000",
  "message": "금융 상품 추천 목록을 조회하였습니다.",
  "result": {
    "matchBanner": {
      "title": "사업기간 2년 3개월 · 월매출 1,540만원 · 한식음식점 기준",
      "description": "신청 가능한 소상공인 지원사업 3건을 찾았습니다. 한도가 큰 순서로 정렬했습니다."
    },
    "products": [
      {
        "productId": 12,
        "name": "대구시 골목상권 활력자금",
        "logoText": "대구",
        "provider": "대구광역시",
        "category": "policy",
        "target": "골목상권 점포 대상",
        "limit": "2,000만원",
        "rate": "연 1.50%",
        "term": "5년",
        "status": "신청 가능"
      },
      {
        "productId": 7,
        "name": "iM뱅크 소상공인 특별운영자금",
        "logoText": "iM",
        "provider": "iM뱅크",
        "category": "operating",
        "target": "소상공인 대상",
        "limit": "5,000만원",
        "rate": "연 2.80%",
        "term": "3년",
        "status": "자격 미충족"
      }
    ],
    "externalPrograms": [
      {
        "title": "[경남] 2026년 3분기 중소기업육성자금 특별자금 지원계획 공고",
        "agency": "경상남도",
        "target": "중소기업",
        "applyPeriod": "2026-10-13 ~ 2026-10-15",
        "detailUrl": "https://www.bizinfo.go.kr/sii/siia/selectSIIA200Detail.do?pblancId=PBLN_000000000126396",
        "source": "bizinfo"
      }
    ]
  },
  "error": null
}
```

### 에러 응답

| code | HTTP | message | 발생 조건 |
| --- | --- | --- | --- |
| AUTH4010 | 401 | 유효하지 않은 토큰입니다. / 사용자를 찾을 수 없습니다. | 토큰 문제 |
| FIN5000 | 500 | 금융 상품 목록을 불러오지 못했습니다. | 서버 내부 오류(집계·조회 실패 등) |

### 연관 테이블

- `사용자(Users)` (본인 확인)
- `가게(Stores)` (업력·지역·업종 조회)
- `거래내역(Transactions)` (연매출 추정)
- `금융상품(FinancialProducts)` (목록·자격 조건 매칭)
- `외부지원사업(ExternalSupportPrograms)` (기업마당 bizinfo 공공데이터 동기화, 자격 매칭 없이 노출)

---

### [GET] /finance/products/{productId}

특정 금융/지원사업 상품의 상세 정보(자격 조건 충족 여부, 필요 서류, 예상 상환액 등)를 조회한다.

### 처리 로직

1. 토큰 검증 후 `userId` 추출.
2. `productId`로 `FinancialProduct`를 조회한다. 존재하지 않으면 404를 반환한다.
3. `/finance/products`와 동일한 방식으로 사용자의 업력·지역·연매출을 계산한다.
4. `eligibility_rules`의 각 조건(업력/연매출/지역)마다 조건 문구·사용자 근거값(evidence)·충족 여부(met)를 구성한다.
5. 거치기간 이후 원리금균등분할 상환 기준으로 월 상환 예상액을 계산한다.
6. 상품 개요, 필요 서류 목록, 요약 정보(한도/금리/월 상환액/심사 기간), 진단 연동 안내 문구와 함께 반환한다.

### 유효성 검증

| 필드 | 규칙 |
| --- | --- |
| productId | Path 파라미터. 정수. 존재하지 않는 id면 404(FIN4040) |

### Request

**Request Header**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| Authorization | String | Required | accessToken |

```
Authorization : Bearer accessToken
```

**Path Parameter**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| productId | Long | Required | 금융 상품 id |

### Response

**Response Body**

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| isSuccess | Boolean | Required |  |
| code | String | Required |  |
| message | String | Required |  |
| result | Object | Optional |  |
| — productId | Long |  | 상품 id |
| — name | String |  | 상품명 |
| — logoText | String |  | 카드 로고 자리 텍스트 |
| — provider | String |  | 취급 기관명 |
| — category | String |  | `operating` \| `facility` \| `policy` |
| — target | String |  | 보조 문구 마지막 조각 |
| — limit | String |  | 한도 금액 표시 문자열 |
| — rate | String |  | 금리 표시 문자열 |
| — term | String |  | 대출 기간 표시 문자열(년 단위) |
| — status | String |  | `신청 가능` \| `자격 미충족` |
| — overview | String |  | 상품 개요 |
| — termDetail | String |  | 기간 상세(거치기간 포함) 표시 문자열(예: "5년 (거치 1년)") |
| — eligibility | Array\<Object\> |  | 자격 조건별 충족 여부 |
| —— condition | String |  | 조건 문구(예: "사업기간 1년 이상") |
| —— evidence | String |  | 사용자 근거값(예: "OO분식 · 2년 3개월") |
| —— met | Boolean |  | 해당 조건 충족 여부 |
| — documents | Array\<String\> |  | 제출 서류 목록 |
| — summary | Array\<Object\> |  | 상세 화면 요약 카드 |
| —— label | String |  | `예상 한도` \| `적용 금리` \| `월 상환액(추정)` \| `심사 기간` |
| —— value | String |  | 값 표시 문자열 |
| — diagnosisNote | String |  | 진단 결과 연동 안내 문구 |
| error | Object | Optional |  |

### 응답 형식 (envelope)

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| isSuccess | Boolean | Required | 성공 여부 |
| code | String | Required | 응답 코드(예: FIN2001) |
| message | String | Required | 응답 메시지 |
| result | Any | Optional | 성공 데이터(실패 시 null) |
| error | Object | Optional | 에러 정보(성공 시 null) |

✅ 성공 : Response 200 OK

```json
{
  "isSuccess": true,
  "code": "FIN2001",
  "message": "금융 상품 상세 정보를 조회하였습니다.",
  "result": {
    "productId": 12,
    "name": "대구시 골목상권 활력자금",
    "logoText": "대구",
    "provider": "대구광역시",
    "category": "policy",
    "target": "골목상권 점포 대상",
    "limit": "2,000만원",
    "rate": "연 1.50%",
    "term": "5년",
    "status": "신청 가능",
    "overview": "대구광역시 소재 골목상권 점포를 대상으로 하는 저금리 운영자금 지원 상품입니다.",
    "termDetail": "5년 (거치 1년)",
    "eligibility": [
      { "condition": "사업기간 1년 이상", "evidence": "OO분식 · 2년 3개월", "met": true },
      { "condition": "연매출 3억원 이하", "evidence": "최근 12개월 1억 8,480만원", "met": true },
      { "condition": "대구광역시 소재", "evidence": "대구광역시 중구 동성로 12", "met": true }
    ],
    "documents": ["사업자등록증 사본", "부가세 과세표준증명원 (최근 1년)"],
    "summary": [
      { "label": "예상 한도", "value": "2,000만원" },
      { "label": "적용 금리", "value": "연 1.50%" },
      { "label": "월 상환액(추정)", "value": "352,140원" },
      { "label": "심사 기간", "value": "영업일 10일" }
    ],
    "diagnosisNote": "진단 결과를 기반으로 신청 서류 작성을 도와드릴 수 있습니다."
  },
  "error": null
}
```

### 에러 응답

| code | HTTP | message | 발생 조건 |
| --- | --- | --- | --- |
| AUTH4010 | 401 | 유효하지 않은 토큰입니다. / 사용자를 찾을 수 없습니다. | 토큰 문제 |
| FIN4040 | 404 | 존재하지 않는 금융 상품입니다. | `productId`에 해당하는 상품이 없음 |
| FIN5001 | 500 | 금융 상품 상세 정보를 불러오지 못했습니다. | 서버 내부 오류(집계·조회 실패 등) |

### 연관 테이블

- `사용자(Users)` (본인 확인)
- `가게(Stores)` (업력·지역·업종 조회)
- `거래내역(Transactions)` (연매출 추정)
- `금융상품(FinancialProducts)` (상세 정보·자격 조건)
