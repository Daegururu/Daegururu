# Daegururu (대구르르)

소상공인의 매출·비용·현금흐름 데이터를 AI로 분석해 가게의 현재 상태를 진단하고,
위험의 원인을 설명하며, 상황에 맞는 처방과 금융상품을 제시하는 AI 금융 플랫폼입니다.

## 프로젝트 구조

```
Daegururu/
├── backend/    # FastAPI 서버 뼈대
└── frontend/   # React(Vite) 클라이언트 뼈대
```

각 파트는 아래 뼈대 위에서 독립적으로 기능을 붙여나가면 됩니다.

## 기술 스택

| 영역 | 스택 |
|---|---|
| 프론트엔드 | React 19 (Vite), TypeScript, Tailwind CSS |
| 백엔드 | FastAPI, SQLAlchemy 2.0, Alembic, PostgreSQL |
| AI | Claude API (`anthropic` SDK), pandas |

## 백엔드 (`backend/`)

```
backend/app/
├── main.py            # FastAPI 앱 진입점, CORS, /health
├── core/
│   ├── config.py       # 환경변수 (DATABASE_URL, ANTHROPIC_API_KEY, ENV)
│   └── database.py     # SQLAlchemy engine / session / Base
├── api/                # 라우터 (빈 상태 — 도메인별로 추가)
├── models/              # SQLAlchemy 모델 (빈 상태)
├── schemas/             # Pydantic 스키마 (빈 상태)
└── ai/
    ├── chatbot/         # AI 도우미 로직 (빈 상태)
    └── scoring/         # 진단 스코어링 로직 (빈 상태)
```

라우터를 추가하면 `main.py`의 주석 처리된 `include_router` 예시를 참고해 등록하세요.

### 로컬 실행

```bash
cd backend
py -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt
copy .env.example .env         # DATABASE_URL, ANTHROPIC_API_KEY 채우기
uvicorn app.main:app --reload
```

PostgreSQL이 로컬에 떠 있어야 합니다 (`.env.example` 기본값: `postgresql://postgres:devpass@localhost:5432/daegureure`).
빠르게 확인만 하려면 `DATABASE_URL=sqlite:///./dev.db`로 바꿔도 동작합니다.

## 프론트엔드 (`frontend/`)

```
frontend/src/
├── main.tsx
├── App.tsx     # 기본 뼈대 페이지
└── index.css   # Tailwind import
```

`@/*` → `src/*` 경로 alias가 `vite.config.ts` / `tsconfig.app.json`에 설정되어 있습니다.

### 로컬 실행

```bash
cd frontend
npm install
npm run dev
```

`.env.local`의 `VITE_API_URL`이 백엔드 주소를 가리킵니다 (기본값 `http://localhost:8000`).

## 다음 작업

- [ ] 화면/라우팅 구조 설계 (Figma 기준) 및 라우터 라이브러리 도입
- [ ] 도메인 모델 설계 (`backend/app/models/`)
- [ ] 인증 방식 결정 및 구현
- [ ] API 라우터 구현 (`backend/app/api/`)
- [ ] AI 진단 스코어링 로직 설계 (`backend/app/ai/scoring/`)
- [ ] AI 도우미(챗봇) 연동 (`backend/app/ai/chatbot/`)
