# Daegururu Frontend

대구르르 프론트엔드입니다.

## 기술 스택

| 영역       | 스택                  | 역할                                 |
| ---------- | --------------------- | ------------------------------------ |
| 프레임워크 | React 19              | UI                                   |
| 빌드       | Vite                  | 개발 서버, 번들링                    |
| 언어       | TypeScript            | 타입                                 |
| 스타일     | Tailwind CSS v4       | 유틸리티 클래스 스타일링             |
| 라우팅     | react-router          | URL ↔ 화면 연결                      |
| 서버 상태  | @tanstack/react-query | API 데이터 캐싱, 로딩·에러 처리      |
| HTTP       | axios                 | 요청, 인터셉터로 토큰·에러 일괄 처리 |
| 린트       | oxlint                | 코드 검사                            |
| 포맷       | prettier              | 코드 포맷 자동 정렬                  |

## 실행

```bash
npm install
npm run dev      # http://localhost:3000
```

| 스크립트               | 설명                                  |
| ---------------------- | ------------------------------------- |
| `npm run dev`          | 개발 서버 (포트 3000)                 |
| `npm run build`        | 타입 체크(`tsc -b`) 후 프로덕션 빌드  |
| `npm run preview`      | 빌드 결과 로컬 미리보기               |
| `npm run lint`         | oxlint 검사                           |
| `npm run format`       | prettier로 코드 포맷 정렬             |
| `npm run format:check` | 포맷 어긋난 파일만 확인 (고치지 않음) |

### 환경변수

`.env.example`을 복사해 `.env`를 만들고 값을 채웁니다. `VITE_` 접두사가 없으면 클라이언트에서 읽히지 않습니다.

```bash
cp .env.example .env
```

```bash
VITE_API_BASE_URL=http://localhost:8000   # 백엔드 API 주소
```

`VITE_`가 붙은 값은 빌드 결과에 그대로 박혀 브라우저에서 보입니다. API 키·시크릿은 절대 넣지 말고 백엔드에 둡니다.

## 폴더 구조

```
frontend/
├── public/              # 정적 파일 (favicon, icons)
├── index.html
├── vite.config.ts       # @ → src alias, dev 서버 포트
└── src/
    ├── main.tsx         # 진입점
    ├── App.tsx          # 루트 컴포넌트
    ├── index.css        # Tailwind import + 전역 스타일
    ├── pages/           # 라우트 엔트리. 레이아웃 + feature 조립만, 로직 없음
    ├── features/        # 기능(도메인)별 코드. 아래 "기능 폴더" 참고
    ├── components/
    │   ├── common/      # 2곳 이상에서 쓰이는 공통 UI (Button, Modal, Input …)
    │   └── layout/      # Header, Footer, Sidebar 등 레이아웃
    ├── apis/            # axios 인스턴스, 인터셉터 등 API 공통 설정
    ├── assets/          # 이미지, 폰트 등 번들에 포함되는 리소스
    ├── constants/       # 전역 상수
    ├── hooks/           # 전역 커스텀 훅
    ├── routes/          # 라우터 설정, 경로 상수
    ├── stores/          # 전역 상태
    ├── styles/          # 공통 스타일, 테마 토큰
    ├── types/           # 공용 타입 정의
    └── utils/           # 순수 유틸 함수
```

빈 폴더는 `.gitkeep`으로 추적됩니다. 해당 폴더에 실제 파일이 생기면 `.gitkeep`은 지워주세요.

### 기능 폴더 (`features/`)

기능 하나에 필요한 코드는 `features/<도메인>/` 안에 모읍니다.

```
src/features/mypage/
├── components/   # 마이페이지에서만 쓰는 UI
├── hooks/        # 마이페이지 전용 훅
├── apis/         # 마이페이지 API 호출 함수
└── types/        # 마이페이지 전용 타입
```

라우트로 노출되는 페이지는 `src/pages/MyPage.tsx`에 두고, 그 안에서 `features/mypage`를 조립합니다.

```tsx
// src/pages/MyPage.tsx
import ProfileCard from '@/features/mypage/components/ProfileCard'
import SettingList from '@/features/mypage/components/SettingList'

export default function MyPage() {
  return (
    <>
      <ProfileCard />
      <SettingList />
    </>
  )
}
```

규칙:

- `features/a`에서 `features/b`를 직접 import하지 않습니다. 공유가 필요하면 `components/common`·`hooks`·`utils`로 올리거나 `pages`에서 조립합니다.
- 두 기능 이상에서 쓰이게 된 컴포넌트는 `components/common/`으로 옮깁니다.
- 전역 폴더(`hooks/`, `types/`, `constants/`)에는 여러 기능이 공유하는 것만 둡니다. 한 기능에서만 쓰면 해당 `features/` 안에 둡니다.

### 경로 alias

`@/*` → `src/*` 가 `vite.config.ts`와 `tsconfig.app.json`에 설정되어 있습니다.

```ts
import Button from '@/components/common/Button'
```

상대 경로(`../../components`) 대신 alias를 사용합니다. 단, 같은 폴더 내부 참조는 `./`를 씁니다.

## 컨벤션

### 네이밍

| 대상                 | 규칙                        | 예시                               |
| -------------------- | --------------------------- | ---------------------------------- |
| 컴포넌트 파일 / 폴더 | PascalCase                  | `Button.tsx`, `StoreCard.tsx`      |
| 그 외 `.ts` 파일     | camelCase                   | `formatCurrency.ts`, `useAuth.ts`  |
| 커스텀 훅            | `use` 접두사                | `useDiagnosis`                     |
| 상수                 | UPPER_SNAKE_CASE            | `MAX_UPLOAD_SIZE`                  |
| 타입 / 인터페이스    | PascalCase                  | `Store`, `DiagnosisResult`         |
| API 함수             | 동사 + 대상                 | `getStoreSummary`, `postDiagnosis` |
| 불리언 변수          | `is` / `has` / `can` 접두사 | `isLoading`, `hasError`            |

### 컴포넌트

- 함수 선언형 + `export default` 한 파일 한 컴포넌트.
- props 타입은 컴포넌트 바로 위에 `type XxxProps`로 정의합니다.
- 페이지 컴포넌트는 `pages/`, 두 곳 이상에서 쓰이면 `components/common/`으로 승격합니다.

```tsx
type ButtonProps = {
  label: string
  onClick: () => void
}

export default function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>
}
```

### import 순서

1. 외부 라이브러리 (`react`, `axios` …)
2. 내부 alias (`@/apis`, `@/components` …)
3. 상대 경로 (`./`)
4. 스타일 / 애셋

그룹 사이는 한 줄 띄웁니다.

### 스타일

- Tailwind 유틸리티 클래스를 기본으로 씁니다. 인라인 `style`은 동적 계산 값에만 사용합니다.
- 반복되는 클래스 조합은 컴포넌트로 추출합니다.
- 색상·간격은 임의값(`text-[#123456]`) 대신 `index.css`에 정의한 테마 토큰을 사용합니다.

### 타입

- `any` 금지. 모르면 `unknown` 후 좁힙니다.
- API 응답 타입은 `types/`에 정의하고 `apis/`에서 가져다 씁니다.
- `interface` 대신 `type`으로 통일합니다.

### Git

**브랜치**

```
main    # 배포되는 브랜치. 작업 브랜치는 여기서 따고 여기로 머지
```

작업 브랜치는 `<타입>/#<이슈번호>-<요약>` 형식으로 만듭니다.

```
feat/#12-login
fix/#31-diagnosis-score
refactor/#44-api-client
```

- 타입은 커밋 타입을 소문자로 쓴 것과 같습니다: `feat` `fix` `hotfix` `style` `refactor` `comment` `docs` `test` `chore` `rename` `remove`
- 이슈 번호는 이슈 템플릿으로 등록한 번호를 씁니다. PR 본문의 "관련 이슈 번호"와 같아야 합니다.
- 요약은 영어 소문자 + 하이픈(kebab-case)으로 짧게 씁니다.
- 머지된 작업 브랜치는 삭제합니다.
- 세팅·문서처럼 이슈로 추적할 논의가 없는 작업은 번호를 생략합니다. 예: `chore/frontend-setup`

```bash
git switch main
git pull
git switch -c feat/#12-login
```

**커밋 메시지**

```
[타입] 작업 내용

본문 (왜 바꿨는지, 필요할 때만)
```

```
[Feat] 로그인 api 개발
```

| 타입       | 설명                                                                      |
| ---------- | ------------------------------------------------------------------------- |
| `Feat`     | 새로운 기능을 추가할 경우                                                 |
| `Fix`      | 버그를 고친 경우                                                          |
| `!HOTFIX`  | 급하게 치명적인 버그를 고쳐야하는 경우                                    |
| `Style`    | 코드 포맷 변경, 세미 콜론 누락, 코드 수정이 없는 경우                     |
| `Refactor` | 프로덕션 코드 리팩토링                                                    |
| `Comment`  | 필요한 주석 추가 및 변경                                                  |
| `Docs`     | 문서를 수정한 경우                                                        |
| `Test`     | 테스트 추가, 테스트 리팩토링(프로덕션 코드 변경 X)                        |
| `Chore`    | 빌드 태스크 업데이트, 패키지 매니저를 설정하는 경우(프로덕션 코드 변경 X) |
| `Rename`   | 파일 혹은 폴더명을 수정하거나 옮기는 작업만인 경우                        |
| `Remove`   | 파일을 삭제하는 작업만 수행한 경우                                        |

- 타입은 대괄호로 감싸고 첫 글자만 대문자입니다 (`!HOTFIX`만 전체 대문자).
- 대괄호 뒤에 한 칸 띄고 작업 내용을 씁니다.
- 제목은 50자 이내, 마침표 없이 씁니다.
- 커밋 하나에 관심사 하나만 담습니다.

**PR**

- 제목은 커밋 메시지와 같은 형식을 씁니다. 예: `[Feat] 로그인 api 개발`
- 본문은 저장소 루트의 [`.github/PULL_REQUEST_TEMPLATE.md`](../.github/PULL_REQUEST_TEMPLATE.md)가 자동으로 채워집니다. 항목을 지우지 말고 체크·작성해주세요.
  - PR 사유 체크
  - 세부 내용 (왜 필요한지 + 작업 내용)
  - 작업 화면 스크린샷
  - PR 전 확인사항 체크 (로컬테스트 / 머지할 브랜치 / label)
  - 관련 이슈 번호
- 올리기 전 `npm run lint`와 `npm run build`가 통과해야 합니다.

**이슈**

- 작업 시작 전 이슈를 먼저 등록합니다. [`.github/ISSUE_TEMPLATE.md`](../.github/ISSUE_TEMPLATE.md)가 자동으로 채워집니다.
  - 어떤 기능인가요? / 상세 내용 / 체크 리스트 / 로컬 테스트 완료 / 기타
- 브랜치는 이슈 번호를 붙여 만들고(`feat/#12-login`), PR 본문의 "관련 이슈 번호"에 같은 번호를 적습니다.

### 코드 푸시 전

```bash
npm run format
npm run lint
npm run build
```

둘 다 통과한 상태로 올립니다.
