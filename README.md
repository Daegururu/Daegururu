# Daegururu (대구르르)

소상공인의 매출·비용·현금흐름 데이터를 AI로 분석해 가게의 현재 상태를 진단하고,
위험의 원인을 설명하며, 상황에 맞는 처방과 금융상품을 제시하는 AI 금융 플랫폼입니다.

## 프로젝트 구조

```
Daegururu/
├── backend/    # FastAPI 서버 — API, DB 모델, AI 진단 엔진, 챗봇
└── frontend/   # Next.js 웹 클라이언트
```

## 화면 흐름

Figma 디자인(28개 화면) 기준 전체 사용자 흐름입니다.

```
로그인/가입 → 온보딩(가게정보 → 매출연동 → 진단시작) → 홈 대시보드
                                                            │
        ┌───────────────┬───────────────┼───────────────┬───────────────┐
        ▼               ▼               ▼               ▼               ▼
   진단 리포트       AI 도우미      매출·정산        금융상품 추천    마이페이지
  (매출/고정비/                                    → 상품 상세
   현금흐름/정산                                    → 신청 → 완료
   탭 + 맞춤 처방)
```

## 기술 스택

| 영역 | 스택 |
|---|---|
| 프론트엔드 | Next.js 16 (App Router), TypeScript, Tailwind CSS |
| 백엔드 | FastAPI, SQLAlchemy 2.0, Alembic, PostgreSQL |
| 인증 | JWT (httpOnly 쿠키) |
| AI | Claude API (`anthropic` SDK) — 진단 원인 설명 및 AI 도우미 대화 |
| 진단 엔진 | pandas 기반 규칙형 스코어링 (결정론적, 재현 가능) |

## 백엔드

### 도메인 모델 (`backend/app/models/`)

- **User / NotificationSetting** — 사업자 계정, 알림 설정
- **DataSourceConnection / Transaction** — 계좌·카드·배달 연동 및 거래내역(매출/고정비/변동비)
- **DiagnosisReport / DiagnosisCause / Prescription** — 진단 결과, 원인 분석, 맞춤 처방
- **FinancialProduct / ProductApplication** — 금융상품 카탈로그 및 신청
- **ChatMessage** — AI 도우미 대화 기록
- **IndustryBenchmark** — 업종×지역 평균 지표 (진단 엔진의 비교 기준선)

### API (`backend/app/api/`, prefix `/api/v1`)

| 라우터 | 엔드포인트 |
|---|---|
| `auth` | `POST /auth/register`, `POST /auth/login`, `POST /auth/logout`, `GET /auth/me` |
| `users` | `GET /users/me`, `GET·PATCH /users/me/notifications` |
| `diagnosis` | `GET /diagnosis`, `GET /diagnosis/latest`, `POST /diagnosis/run`, `PATCH /diagnosis/prescriptions/{id}` |
| `transactions` | `GET·POST /transactions`, `GET /transactions/summary`, `DELETE /transactions/{id}` |
| `products` | `GET /products`, `GET /products/{id}`, `POST /products/applications`, `GET /products/applications/mine` |
| `chat` | `GET·POST /chat` |

### AI 진단 엔진 (`backend/app/ai/scoring/`)

거래내역을 pandas로 집계해 업종 벤치마크와 비교, 5개 영역 점수(0~100)를 규칙 기반으로 산출합니다.

1. **매출(sales)** — 월평균 매출 수준 + 최근 3개월 증감률
2. **비용구조(cost_structure)** — 고정비·인건비 비중 (업종 평균 대비)
3. **현금흐름(cashflow)** — 평균 정산 소요일
4. **정산(settlement)** — 평균 결제 수수료율
5. **상대위치(relative_position)** — 매출·비용구조 종합 비교

가중 평균으로 종합점수를 내고 위험도(안전 ≥70 / 주의 ≥40 / 위험 <40)를 매깁니다.
가장 취약한 영역부터 원인(근거 문장 포함)과 처방(인건비 점검, 정책자금, 수수료 재협상 등)을
자동 생성합니다. 같은 데이터에는 항상 같은 결과가 나오는 결정론적 로직입니다.

### AI 도우미 (`backend/app/ai/chatbot/`)

사용자의 최신 진단 리포트를 컨텍스트로 넣어 Claude와 대화합니다.
`ANTHROPIC_API_KEY`가 없으면 데모 응답으로 폴백합니다.

### 로컬 실행

```bash
cd backend
py -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt
copy .env.example .env         # DATABASE_URL, ANTHROPIC_API_KEY, JWT_SECRET 채우기
uvicorn app.main:app --reload
```

PostgreSQL이 로컬에 떠 있어야 합니다 (`.env.example` 기본값: `postgresql://postgres:devpass@localhost:5432/daegureure`).
개발 중 빠르게 확인만 하려면 `DATABASE_URL=sqlite:///./dev.db`로 바꿔도 동작합니다.

## 프론트엔드

Next.js App Router 기반, 백엔드 CORS 설정에 맞춰 `http://localhost:3000`에서 실행됩니다.

```
src/app/
├── (auth)/login, register/          # 01, 01c
├── onboarding/                      # 02a, 02b, 02c
└── (dashboard)/                     # 공통 Sidebar/Topbar 레이아웃
    ├── home/                        # 03 홈 대시보드
    ├── diagnosis/                   # 04 (→ home으로 통합)
    ├── chat/                        # 05 AI 도우미
    ├── transactions/                # 06 매출·정산
    ├── products/, products/[id]/    # 07, 08
    │   └── apply/                   # 09
    └── mypage/                      # 10
```

### 로컬 실행

```bash
cd frontend
npm install
npm run dev
```

`.env.local`의 `NEXT_PUBLIC_API_URL`이 백엔드 주소를 가리킵니다 (기본값 `http://localhost:8000`).

## 다음 작업

- [ ] Alembic 마이그레이션 초기화
- [ ] `IndustryBenchmark` 실데이터 적재 (소진공 상권정보시스템 등)
- [ ] 나머지 온보딩 화면(02a/02b/02c) 실제 폼 구현
- [ ] 계좌·카드·배달 연동(iM뱅크 등) 실제 연결
