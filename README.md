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

## 시스템 구조도

```mermaid
flowchart TB
    User["사용자 (브라우저)"]

    subgraph FE["프론트엔드"]
        Vercel["Vercel\nReact SPA (Vite)\ndaegururu.cloud"]
    end

    subgraph BE["백엔드 (EC2, ap-northeast-2)"]
        Nginx["nginx\n리버스 프록시 + Let's Encrypt(certbot)\napi.daegururu.cloud"]
        API["FastAPI 컨테이너\n(uvicorn)"]
        Nginx --> API
    end

    subgraph AWS["AWS 관리형 서비스"]
        RDS[("RDS\nPostgreSQL")]
        S3[("S3\n업로드 파일 (인증서 PDF 등)")]
    end

    Claude["Anthropic Claude API\n(AI 진단/챗봇 — 연동 예정)"]
    Bench[("업종 평균 벤치마크\n대구 지역 카드매출 공공데이터 기반\n(정적 시드 데이터)")]

    User -->|HTTPS| Vercel
    Vercel -->|HTTPS REST\n/api/v1| Nginx
    API --> RDS
    API --> S3
    API -.-> Claude
    Bench -. 시드 적재 .-> RDS

    subgraph CICD["CI/CD"]
        GH["GitHub\n(main push)"]
        GA["GitHub Actions\n(deploy-backend.yml)"]
        ECR["ECR\n(Docker 이미지)"]
        GH --> GA --> ECR -->|SSH 배포| API
    end
```

- **프론트엔드**: Vercel에 정적 배포된 React SPA. `daegururu.cloud` 커스텀 도메인 연결.
- **백엔드**: EC2 위 Docker Compose로 `backend`(FastAPI) + `nginx`(리버스 프록시, Let's Encrypt 인증서) + `certbot` 컨테이너 구동. `api.daegururu.cloud`로 HTTPS 서빙.
- **데이터베이스**: AWS RDS PostgreSQL. Alembic으로 스키마 마이그레이션 관리.
- **스토리지**: AWS S3 — 사업자/소상공인 확인서 PDF 등 업로드 파일 저장.
- **AI**: Anthropic Claude API 연동을 위한 설정(`ANTHROPIC_API_KEY`)은 준비되어 있으나, 실제 진단/챗봇 로직(`app/ai/`)은 아직 구현 전 단계.
- **배포 파이프라인**: `main` 브랜치 push 시 GitHub Actions가 Docker 이미지를 빌드해 ECR에 push하고, SSH로 EC2에 접속해 최신 이미지를 pull·재기동.

## 기술 스택

| 영역 | 스택 |
|---|---|
| 프론트엔드 | React 19.2, TypeScript, Vite 8, Tailwind CSS v4, react-router 8(데이터 라우터), TanStack Query 5(서버 상태), zustand 5(클라이언트 상태), axios(공통 API 클라이언트), recharts(차트), lucide-react(아이콘), oxlint/prettier(린트·포맷) |
| 백엔드 | Python 3.13, FastAPI + uvicorn, SQLAlchemy 2.0, Alembic(마이그레이션), pydantic-settings(환경설정) |
| 인증 | JWT(pyjwt, python-jose), 비밀번호 해싱(pwdlib + argon2) |
| 파일 처리 | PyMuPDF + pytesseract + Pillow(사업자/소상공인 확인서 PDF OCR 파싱), python-multipart(업로드) |
| AI/데이터 | Anthropic Claude API(`anthropic` SDK, 연동 예정), pandas |
| 데이터베이스 | PostgreSQL (AWS RDS) |
| 스토리지 | AWS S3 (boto3) |
| 데이터셋 | 사용자 실거래 데이터(카드·배달·현금 매출 및 고정비 트랜잭션, PG/카드사 정산 내역) · 업종 평균 벤치마크(대구 지역 카드매출 공공데이터·소상공인시장진흥공단 상권정보 참고, 현재는 정적 시드 데이터) |
| 인프라/CI-CD | AWS EC2(배포 서버), ECR(이미지 레지스트리), nginx + Let's Encrypt(HTTPS), GitHub Actions(빌드·배포 자동화), Vercel(프론트 호스팅) |

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

### 환경변수

`backend/.env` 파일에 다음 키가 필요합니다 (git에 커밋되지 않으니 각자 로컬에 생성):

| 키 | 설명 | 예시 |
|---|---|---|
| `DATABASE_URL` | PostgreSQL 연결 문자열 (psycopg3 드라이버 사용) | `postgresql+psycopg://daegureure:daegureurepassward@localhost:5432/daegureure` |
| `ANTHROPIC_API_KEY` | Claude API 키 | `sk-ant-...` |
| `ENV` | 실행 환경 | `development` |
| `JWT_SECRET_KEY` | JWT 서명 키 (32바이트 이상 권장) | `dev-secret-change-me-please-32-bytes-min` |
| `JWT_ALGORITHM` | JWT 서명 알고리즘 | `HS256` |
| `JWT_EXPIRE_MINUTES` | 액세스 토큰 만료 시간(분) | `60` |

### 로컬 실행

```bash
cd backend
py -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt
# 위 표를 참고해 .env 파일을 직접 생성
uvicorn app.main:app --reload
```

PostgreSQL이 로컬에 떠 있어야 합니다. DB/계정 생성 예시:

```sql
CREATE ROLE daegureure LOGIN PASSWORD 'daegureurepassward';
CREATE DATABASE daegureure OWNER daegureure;
```

테이블은 Alembic으로 관리합니다. DB를 새로 만들었다면 마이그레이션을 적용하세요:

```bash
alembic upgrade head
```

모델을 추가/수정했다면 마이그레이션을 생성 후 커밋하세요:

```bash
alembic revision --autogenerate -m "설명"
alembic upgrade head
```

## 프론트엔드 (`frontend/`)

```
frontend/src/
├── main.tsx        # 진입점, RouterProvider 연결
├── App.tsx         # 기본 뼈대 페이지
├── index.css       # Tailwind import
├── pages/          # 라우트 엔트리 (조립만)
├── features/       # 기능(도메인)별 코드
├── components/     # common/ 공통 UI, layout/ 레이아웃
├── apis/           # axios 인스턴스 등 API 공통 설정
├── routes/         # 라우터 설정
└── assets/ constants/ hooks/ stores/ styles/ types/ utils/
```

`@/*` → `src/*` 경로 alias가 `vite.config.ts` / `tsconfig.app.json`에 설정되어 있습니다.

폴더 구조 규칙과 코드·Git 컨벤션은 [`frontend/README.md`](frontend/README.md)에 정리되어 있습니다.

### 로컬 실행

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

`.env`의 `VITE_API_BASE_URL`이 백엔드 주소를 가리킵니다 (기본값 `http://localhost:8000`).

## 다음 작업

- [ ] 화면/라우팅 구조 설계 (Figma 기준) 및 `frontend/src/routes`에 라우트 등록
- [ ] 프론트 API 클라이언트(axios 인스턴스) 및 QueryClientProvider 연결
- [ ] 도메인 모델 설계 (`backend/app/models/`)
- [ ] 인증 방식 결정 및 구현
- [ ] API 라우터 구현 (`backend/app/api/`)
- [ ] AI 진단 스코어링 로직 설계 (`backend/app/ai/scoring/`)
- [ ] AI 도우미(챗봇) 연동 (`backend/app/ai/chatbot/`)
