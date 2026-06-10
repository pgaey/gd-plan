# spec-13-01: gd-plan 패키지 코어 (상류 기획 문서 시스템 + /gd-chat 주입)

## 📋 메타

| 항목 | 값 |
|---|---|
| **Spec ID** | `spec-13-01` |
| **Phase** | `phase-13` |
| **Branch** | `spec-13-01-gd-plan-package` |
| **상태** | Planning — 설계 정련 완료(`drafts/`), Plan Accept 대기 (새 세션) |
| **타입** | 신규 패키지 + 기존 패키지 통합 + create-gd-react 스캐폴드 갱신 |
| **Integration Test Required** | yes |
| **작성일** | 2026-05-29 |
| **소유자** | dennis |
| **관련 후속 spec** | spec-13-02 (paper.design MCP 통합), spec-13-03 (paper -> chat.md resync) |

## 📋 배경 및 문제 정의

### 현재 상태 — 하류 파이프라인 완비

`gen-design` 은 scene 단위 작업을 위한 **하류(downstream)** 파이프라인이 잘 갖춰져 있다.

- `chat.md` (Narrative/Structure/History 3-layer) → React TSX 자동 컴파일
- `TOKEN.md` / `DESIGN.md` / `FRONT.md` 가 `tokens.json` + `studio/src/lib/vocabulary` 에서 auto-gen
- 기존 스킬 4 개: `/gd-start`, `/gd-chat`, `/gd-design`, `/gd-token`

### 빈 자리 — 상류 기획 레이어 부재

scene 단위는 강하지만, 프로젝트 전체 틀이 매번 사용자 머릿속에만 존재하다가 `/gd-chat` 입력으로 흘러간다. 다음 5 영역이 정형화되지 않음:

1. **PRD** — 클라이언트 의도, 타깃, 성공 기준, 비범위
2. **page hierarchy / structure** — sitemap, sticky / LNB / modal 동작
3. **flows** — auth / booking / admin 등 cross-scene 사용자 여정
4. **ui-rules** — section gap 120/72px, hover 180ms, modal 위치 등 enforce-가능한 수치 규칙
5. **design system 선택** — 톤, 컬러, 타이포 등 visual language

### 핵심 통찰

- `design-md-collection/` 66 회사 파일은 단순 참고가 아니라 **선택 카드 라이브러리** 다. 디자이너 없이 검증된 디자인 시스템 위에서 생성하는 USP 의 핵심.
- v0 / Lovable / Bolt 와의 차별점: 디자인이 들쭉날쭉하지 않고, 66 검증된 대기업 디자인 시스템 위에서만 생성하므로 일관성이 강제됨.
- **gd-plan = 통제 레이어**: harness-kit 가 개발 *프로세스*를 통제하듯, gd-plan 은 *디자인 산출*을 통제한다. 모델이 발전해도 "잘 만든다 ≠ 정해진 시스템·구조 위에서 일관되게 만든다"는 별개라, 통제 레이어의 가치는 모델 발전과 무관하게 남는다. (= 본 spec 의 존재 이유)

### 본 spec 의 책임 범위

| 도구 | 범위 | 본 spec 포함? |
|---|---|---|
| **gd-plan 코어 스킬** (7 개) + 5 종 문서 템플릿 | 프로젝트 전체 틀 | ✅ 포함 |
| **`/gd-chat` 주입 통합** | 5 종 문서 → chat.md 생성 컨텍스트 | ✅ 포함 (Top Risk 해결) |
| `create-gd-react` 스캐폴드 갱신 | 신규 프로젝트가 5 종 문서로 시작 | ✅ 포함 |
| **paper.design MCP 통합** | chat.md → paper canvas | ❌ spec-13-02 |
| **paper → chat.md resync** | 디자이너 직접 수정 반영 | ❌ spec-13-03 |
| `docs/components/*.md` (컴포넌트별 design rule) | 복잡 컴포넌트 별도 명세 | ❌ v2 백로그 |
| `docs/database/draft-schema.md` | 백엔드 스키마 초안 | ❌ 후속 spec |
| UI wizard (Lego 조립 web app) | 별도 비전 | ❌ 별도 spec |

## 🎯 요구사항

### Functional Requirements

#### F1. 신규 패키지 `packages/gd-plan` — 7 개 스킬

| 스킬 | 입력 | 출력 | 비고 |
|---|---|---|---|
| `gd-plan-start` | `docs/` 폴더 스캔 | 진행률 + 다음 명령어 안내 | 진입점, idempotent |
| `gd-plan-prd` | `.gd/memory/project.md` (있으면) | `docs/prd.md` (SSOT) + `.gd/memory/project.md` (자동 동기화 요약) | **구조화 15문항 인터뷰** (질문↔prd 필드 완전 커버) |
| `gd-plan-design` | `docs/prd.md` | `docs/design.md` (collection 파일 복사 + frontmatter) | **Sonnet 서브에이전트 + 인덱스 캐시** |
| `gd-plan-structure` | `docs/prd.md`, `docs/design.md` | `docs/structure.md` | sitemap / sticky / LNB / modal / responsive |
| `gd-plan-flows` | `docs/prd.md`, `docs/structure.md` | `docs/flows/<name>.md` 다수 | flow 별 steps 인터뷰 |
| `gd-plan-rules` | `docs/design.md`, `docs/structure.md` | `docs/ui-rules.md` | design.md 추정값 확정 + collection 이 안 주는 interaction/a11y 인터뷰 (F2 참조) |
| `gd-plan-review` | 5 종 문서 전체 | `docs/_review.md` | **Opus 비판 서브에이전트 + 하이브리드 차단 정책** |

**모든 스킬 공통 규칙**:

- idempotent (재실행 안전)
- 완료 직후 출력 포맷: `"docs/<file> 작성 완료. 다음 단계: /gd-plan-<next>. 전체 진행률: N/7"`
- 한국어 본문
- 본문 길이 ≤ 400 줄 (단 `gd-plan-structure` 와 `gd-plan-review` 는 예외 허용, ≤ 600 줄)
- **인터뷰 = 템플릿의 모든 필드를 빠짐없이 질문** (템플릿 = 질문의 source of truth; 필드 추가 시 질문도 추가)

#### F2. 5 종 문서 템플릿 (설계 정련 2026-05-31 — draft 기준: `specs/spec-13-01-gd-plan-package/drafts/`)

> **연결 모델 (통제의 뼈대)**: 5 종은 따로 노는 글이 아니라 **안정 ID 로 연결된 하나의 모델** — `role -> capability -> page -> flow -> scene`. 끊긴 고리는 `/gd-plan-review` 가 BLOCK (F6). 실제 템플릿은 `drafts/*.template.md` 를 기준으로 `packages/gd-plan/templates/` 에 작성.

1. **prd.md** — 한 줄 요약 / (선택)배경 / 페르소나(1-3) / 핵심 가치 / (선택)차별점 / **사용자 역할+접근 모델** / capabilities / 톤 키워드 / (선택)기기 / (선택)비기능 / 성공 기준 / (선택)리스크 / Out of Scope.
   - **roles**: `roles: [User, Admin, ...]` + `access model: RBAC | ABAC | ReBAC` + 디자인 함의 1줄. RBAC 수준(역할→화면/기능 접근)이 디자인 입력; 정책 엔진은 백엔드(범위 밖).
   - capability 마다 `[CAP-NN]` ID + 동사 시작 + `(주체: 역할)`.
   - 인터뷰가 모든 필드를 질문 (→ `drafts/gd-plan-prd.interview.md`, 15문항).
2. **design.md** — `design-md-collection/<file>.md` *전체 복사* + frontmatter(`pickedFrom`/`pickedAt`/`reason`, `reason` 만 사용자 편집). **별도 템플릿 없음** — collection 의 일관된 **9 섹션**(Visual Theme/Color/Typography/Component/Layout/Depth/Do's·Don'ts/Responsive/Agent Prompt Guide)이 형식 역할.
3. **structure.md = 와이어프레임** — 페이지 = **통제된 섹션 어휘에서 고른 순서 있는 섹션 스택**(relume 모델, shadcn 토대 동일). page 별: `[PAGE-slug]` + `covers:[CAP-..]` + `roles:` + sections(`타입(슬롯)`) + layout(LNB/sticky/modal) + responsive + states(empty/loading/error). 섹션 어휘 = `drafts/section-taxonomy.md`(마케팅 11 + 앱 10).
4. **ui-rules.md = enforce 인터랙션/오버라이드 레이어** — design.md(picked)+tokens.json 의 *시각 토큰*(radius/typography/spacing 스케일/색)은 **재서술 안 함**. collection 이 *안 주는* **Motion(ms/easing/reduced-motion) / Form 동작(검증 시점·에러 위치) / CTA 위계(개수·solid/outline) / Header 치수 / a11y 최소선** + design.md 추정값을 **확정 수치**로.
5. **flows/<name>.md** — `[FLOW-slug]` / 목적 / **Actor(role)** / Trigger / Steps(`@[PAGE-id]` + 섹션·데이터·modal) / **mermaid 흐름도**(manyfast 식: `(())`/`[]`/`{}`, 노드에 `[PAGE-id]`) / Edge cases / Success. (선택) 사이트 전체 `flows/_overview.md`.

옵션(database / components)은 본 spec 제외. **기능명세서 별도 문서 없음** — capabilities(+주체) + `<scene>.order.md`(검증/액션/데이터)가 디자인-기능을 커버.

#### F3. design-md-collection 인덱스 캐시

매 호출마다 60+ 파일 풀로드 방지를 위해 **사전 빌드 인덱스**:

- 파일: `design-md-collection/_index.json`
- 빌드 시점: gd-plan 패키지 build 시 / 신규 collection 파일 추가 시 / 사용자 수동 `pnpm gd plan refresh-index`
- 내용 (파일당):
  ```json
  {
    "file": "linear.app.md",
    "domain_keywords": ["productivity", "project-management", "issue-tracking", "dense", "admin"],
    "tone_keywords": ["precise", "minimal", "professional"],
    "color_summary": "neutral-heavy, single accent (indigo/violet)",
    "typography_summary": "Inter, geometric sans-serif",
    "layout_density": "dense"
  }
  ```
- gd-plan-design 의 collection-scanner 가 이 인덱스를 먼저 읽고, 후보 3 개로 좁힌 후에야 실제 파일을 풀로드

#### F4. paper.design 통합 (본 spec 범위 외)

본 spec 은 `chat.md → React TSX` 의 기존 경로만 다룬다. paper.design 통합은 **spec-13-02** 에서 별도 명세.

- 본 spec 의 `/gd-chat` 주입 명세 (F9) 는 paper.design 부재를 가정한 default 흐름.
- spec-13-02 가 추가 layer 로 `pnpm gd paper <scene>` 명령을 추가.

#### F5. 멀티 에이전트 오케스트레이션 (스킬 내부 서브에이전트)

> **모델 열은 non-normative 권장 힌트**다 (실행 환경 의존 — DoD 는 특정 모델을 강제하지 않음). 스킬은 서브에이전트 *없이도* 동작해야 하며, 서브에이전트는 품질/비용 최적화 수단.

| 위치 | 에이전트 | 권장 모델 | 역할 |
|---|---|---|---|
| `gd-plan-design` | collection-scanner | Sonnet | `_index.json` + 60 파일 중 후보 3 추천 |
| `gd-plan-prd` | prd-extractor | Sonnet | 자유 발언에서 capability 추출 (선택) |
| `gd-plan-review` | consistency-critic | Opus 서브 | 명시적 체크리스트 (F6 참조) |

> `gd-plan-structure` 의 layout-thinker(복잡 페이지 전용)는 트리거가 모호해 **보류** (필요 시 v2). Layer 2(메타 비판)는 제품 요구가 아니라 *작성 프로세스 회고*라 spec 요구에서 제외 — plan.md 메모로 이전 (critique 2026-05-29).

#### F6. `/gd-plan-review` 하이브리드 차단 정책

consistency-critic 의 **명시적 체크리스트** (재현 가능):

| 체크 | 카테고리 | 발견 시 |
|---|---|---|
| PRD `capabilities` 항목이 structure.md sitemap 의 어떤 페이지로도 매핑 안 됨 | **structural** | **BLOCK** — 다음 스킬 진입 차단 |
| structure.md 의 페이지가 어떤 flow 에도 등장 안 함 | **structural** | **BLOCK** |
| flow steps 가 참조하는 페이지가 structure.md sitemap 에 없음 | **structural** | **BLOCK** |
| ui-rules.md 수치가 design.md 의 토큰/수치와 불일치 | **style** | WARN |
| flow steps 의 컴포넌트가 FRONT.md 어휘에 없음 | **vocabulary** | WARN |

> **v1 범위** = 위 structural(BLOCK) + style/vocabulary(WARN). LLM 주관·오탐 많은 **wording**(persona↔design 톤) / **completeness**(empty/loading/error 누락) 체크는 **v2 연기**. structural BLOCK 의 결정적(set-diff) 강화도 v2 (→ v2 백로그).
> **ID 기반 추적**: 체크는 `[CAP-..]`/`[PAGE-..]`/`[FLOW-..]` 안정 ID 의 연결(`role->capability->page->flow`)을 따라간다 — v1 은 LLM 이 ID 연결을 읽어 판정, v2 는 ID set-diff 로 결정화. role 축도 추적(예: capability 주체 역할이 prd roles 에 없으면 WARN).

**강제 override**: `/gd-plan-review --force-continue` 플래그 — BLOCK 도 우회 가능 (사용자 책임).

`_review.md` 출력 포맷:
```markdown
# Review Report — 2026-05-29

## BLOCK (해결 전 다음 단계 불가)
- [P1] PRD capability "관리자 통계" 가 structure.md sitemap 에 없음

## WARN (진행 가능, 검토 권장)
- [S1] ui-rules.md hover 180ms vs design.md 200ms 불일치
```

#### F7. `packages/create-gd-react` 스캐폴드 갱신

- `docs/` 폴더 자동 생성:
  - `docs/prd.md` (빈 템플릿)
  - `docs/design.md` (빈 — `/gd-plan-design` 호출 후 채워짐)
  - `docs/structure.md` (빈 템플릿)
  - `docs/ui-rules.md` (빈 템플릿 + 사용자 원본 sample 수치 포함)
  - `docs/flows/.gitkeep`
- `.claude/commands/` 에 gd-plan-* 스킬 7 개 자동 설치
- README 9 단계 흐름 추가:
  ```
  /gd-plan-start → /gd-plan-prd → /gd-plan-design → /gd-plan-structure
  → /gd-plan-flows → /gd-plan-rules → /gd-plan-review
  → /gd-start → /gd-chat <page> → pnpm gd react
  ```
- 버전 0.3.0 bump

#### F8. npm 출시 전략

- `@gen-design/plan` 신규 publish (0.1.0)
- `@gen-design/skills` 는 gd-plan 스킬도 함께 번들 (단독 설치 시 자동 포함)
- `create-gd-react` 0.3.0

#### F9. **`/gd-chat` 주입 명세 — Top Risk 해결**

본 spec 의 *존재 이유*. 5 종 문서가 만들어진 뒤 `/gd-chat` 이 어떻게 활용하는가.

**`/gd-chat <scene>` 호출 시 컨텍스트 로드 순서**:

1. **세션 메모리**: `.gd/memory/{project,designer,decisions,feedback}.md` — 기존 동작
2. **공식 SSOT**:
   - `docs/prd.md` — 타깃 페르소나·톤·capability 목록
   - `docs/structure.md` — *이 scene 에 해당하는 페이지 섹션* (sitemap 검색)
   - `docs/flows/*.md` — *이 scene 이 등장하는 모든 flow* (steps 에서 grep)
   - `docs/ui-rules.md` — 수치 규칙 전체
   - `docs/design.md` — 톤·visual language
3. **어휘 카탈로그**: `templates/FRONT.md` — 기존 동작

**chat.md 생성 시 규칙 적용**:

| 영역 | 소스 | 적용 방식 |
|---|---|---|
| Narrative 톤 | `prd.md` persona + `design.md` 톤 키워드 | 자연어 narrative 의 톤 결정 |
| Structure 트리 | `FRONT.md` 어휘 + `structure.md` 섹션 구성 | 트리 노드는 FRONT.md 만, 섹션 배열은 structure.md 순서 |
| Section 크기·간격 | `ui-rules.md` Spacing | narrative 에 "section gap 120px desktop" 메모 |
| Modal/LNB 동작 | `structure.md` Modal/Layout | "이 페이지는 LNB 있음, modal 은 LNB 제외 영역 중앙" |
| 컴포넌트 visual | `design.md` Component Stylings + `ui-rules.md` Radius/Motion | structure 트리의 props 결정 |
| Flow 진입 / 이탈 | `flows/*.md` steps | "이 scene 은 booking-flow step 2, 이전은 /book, 다음은 /book/confirm" |

**chat.md 생성 전 사전 검증**:

| 검증 | 실패 시 |
|---|---|
| structure.md 에 이 scene 이 정의되어 있는가 | **차단** — "/gd-plan-structure 에서 이 scene 추가 필요" 안내 |
| flows 에 이 scene 이 등장하는가 | WARN — "flow 정의 없이 만들어도 되나요?" |
| ui-rules.md 의 수치가 chat.md narrative 의 수치와 충돌하지 않는가 | WARN — 사용자 확인 |

**chat.md 작성 후 자동 검증**:

- 트리에 FRONT.md 미등록 어휘 있나? → 기존 정책 (등록 또는 거부)
- design.md 톤과 narrative 톤 불일치? → 경고

**`/gd-chat` 본문 변경 범위** (실제 `gd-chat.md` 구조 기준 — 편집 canonical = `packages/create-gd-react/presets-bundled/default/.claude/commands/gd-chat.md`, `gd-skills/skills/` 는 prebuild sync 산출물):

- §1 (자동 로딩 컨텍스트) — 기존 .gd/memory 만 → 위 새 5 종 문서 추가
- 신규 §5.10 (Sitemap 사전 검증) — structure.md 에 scene 정의 없으면 차단 (기존 파일에 §7.8 없음)
- §6/§7/§8 (Narrative/Structure/History 3-layer 생성) — 규칙 표 참조 명시
- §12 (종료 조건) — 일관성 검증 항목 추가

**`/gd-chat` 본문 길이 영향**: 현재 `gd-chat.md` 는 이미 ~598 줄 (phase-12 누적). F9 주입 +~80 → ~680 줄. 본문 길이는 **권고**(하드 cap 아님) — 장황하면 분리/정리 검토.

#### F10. 문서 갱신

- `README.md` 상단 TL;DR 에 gd-plan 흐름 추가
- `docs/handbook.md` — 상류/하류 책임 분담 도식 (ASCII)
- `docs/vision.md` — design system picker library 차별점 명문화
- `docs/decisions/ADR-13-01-*.md` 6 개 ADR 작성 (아래 ADR 후보 참조)

### Non-Functional Requirements

1. **Sync 모델 = 패턴 A (레이어별 SSOT)**: 상류(기획) SSOT = `prd.md`, 하류(화면) SSOT = `chat.md` — 서로 다른 레이어라 NFR2/ADR-C(prd=SSOT) 와 충돌 아님. 5 종 기획 문서는 chat.md 생성 시 *입력*(단방향 docs → chat.md); chat.md 가 docs 를 거꾸로 수정하지 않음.
2. **prd.md ↔ project.md 동기화**: `/gd-plan-prd` 실행 시 둘 다 작성. prd.md 변경 시 project.md 요약 자동 갱신 (멱등).
3. **언어**: 모든 스킬 본문·문서·인터뷰 한국어 우선.
4. **모델 예산**: 일상 인터뷰 메인 Opus, 60+ 파일 스캔·텍스트 추출 Sonnet 서브, 비판·일관성 검사 Opus 서브.
5. **각 스킬 본문 길이**: 기본 ≤ 400 줄, structure / review 예외 ≤ 600 줄.
6. **idempotent**: 모든 `/gd-plan-*` 재실행 안전.
7. **회귀 무**: 기존 `@gen-design/skills`, `gd-cli`, `create-gd-react` 테스트 통과.
8. **인덱스 캐시 무결성**: `design-md-collection/_index.json` 은 파일 추가/수정 시 재생성 (gitignore X, 커밋).

## 🚫 Out of Scope (본 spec)

- **paper.design MCP 통합** → spec-13-02
- **paper → chat.md resync** → spec-13-03
- **`docs/components/*.md`** → v2 백로그 (이유: ui-rules.md + design.md 로 일반 케이스 충분, 복잡 컴포넌트가 등장한 뒤 별도 spec)
- **`docs/database/draft-schema.md`** → 후속 spec
- **양방향 자동 sync (패턴 B)** → 영구 backlog (Figma/Webflow 도 미해결 영역)
- **어휘 자동 환원 / 토큰 자동 매핑** → spec-13-03 와 함께
- **UI 위저드 (Lego 조립 web app)** → 별도 vision spec
- **Figma MCP 병렬 지원** → spec-13-02 이후
- **외부 dogfooding 라운드** → 별도 spec
- **기능명세서(상세 기능/비즈니스 룰 문서)** → 별도 안 둠. capabilities(+주체 role) + `<scene>.order.md` 가 디자인-기능 커버.
- **컴파일러(chat.md→React)의 studio 분리 / gen-design "벗어나기"** → 본 spec 범위 외 (먼저 #1=문서 레이어 구체화, #2=근육 분리는 후속 판단). 현행 아키텍처 분석: `architecture.html` · `deep-dive.html`.

## 🔭 v2 백로그 (critique 2026-05-29 발견 — 본 spec 범위 외, 기록만)

> 비판에서 나온 견고성/정밀화 항목. v1 구현 안 함, 잊지 않게 기록.

- **review BLOCK 결정성** (critique 4): capability/page/flow 안정 ID + 결정적 set-diff (가능하면 `gd-cli lint` 종료코드 enforce). v1 은 LLM 판정 BLOCK 유지.
- **`_index.json` stale 감지** (5): `collectionHash`/mtime 저장 + gd-plan-design 진입 시 mismatch 경고.
- **문서 staleness 전파** (6): 상위(prd/design)가 하위 4문서보다 newer 면 gd-plan-review 가 WARN.
- **인터뷰 중단·재개 상태 모델** (7): 미완 섹션 마커 또는 project.md 진행상태로 "부분 진행 복원" 정의 (idempotent 운영 정의).
- **에러/부분상태 경로** (8): 5종 중 일부만 존재 시 `/gd-chat` 주입 fallback, `_index.json` 손상/스키마 불일치, FRONT.md 부재, `_review.md` 재실행 overwrite/append 규칙.
- **design.md 복사 정의 + drift 감지** (12): "전체 복사" 기준 명확화 + frontmatter `sourceHash`/`pickedVersion` (재픽 시 사용자 편집 보존). 전면 참조전환은 spec-13-03 와 재논의.
- **design.md pick -> tokens.json 반영 브리지** (설계정련 발견): collection 은 현재 에이전트 참조 문서일 뿐 `tokens.json`(컴파일러 토큰 원천)과 연결 안 됨. design.md 픽이 토큰을 자동 설정하지 않으므로 gd-plan-design/gd-token 이 "pick → tokens 반영" 단계를 잇는 설계 필요.

## 📑 ADR 후보 (총 5 개 — critique 6→3 압축 후, 설계 정련에서 D·E 추가)

- [ ] **ADR-13-01-A** — **레이어별 SSOT** (상류=`prd.md` / 하류=`chat.md`, 단방향 docs→chat) — type: `invariant`  *(기존 C + 레이어 개념 통합)*
- [ ] **ADR-13-01-B** — `design.md` = design-md-collection **picker library** (사람 미작성, `reason` 만 편집) — type: `decision`  *(기존 A+B 통합)*
- [ ] **ADR-13-01-C** — `/gd-plan-review` 차단 정책 (v1: structural=BLOCK / style·vocabulary=WARN; 결정적 set-diff 는 v2) — type: `tradeoff`  *(기존 D 재서술)*
- [ ] **ADR-13-01-D** — **structure.md = 통제된 섹션 스택**(relume 모델, shadcn 토대) — 페이지를 자유 박스가 아니라 고정 섹션 어휘로 조립 — type: `convention`  *(설계 정련 2026-05-31)*
- [ ] **ADR-13-01-E** — **역할 + 접근 모델을 디자인 레이어에서 포착**(RBAC 수준; `role->capability->page` 연결, 정책 엔진은 백엔드) — type: `decision`  *(설계 정련 2026-05-31)*

> 제외: 멀티에이전트=프로세스/구현이라 ADR 미달; `_index.json` 사전빌드=convention 수준이라 plan/구현 메모로 흡수.

## ✅ Definition of Done

### 코드

- [ ] `packages/gd-plan/` + 7 개 스킬 본문 + 4 개 템플릿(prd/structure/ui-rules/flows; design.md 는 collection 픽) + **섹션 어휘(section-taxonomy)** + **gd-plan-prd 인터뷰 설계**
- [ ] `design-md-collection/_index.json` 생성 스크립트 + 초기 인덱스 빌드 (60+ 파일)
- [ ] `gd-chat.md` 본문 갱신 (F9 §1 / 신규 §5.10 / §6-8 / §12) — canonical = create-gd-react preset 본, `gd-skills/skills/` 는 sync
- [ ] `packages/create-gd-react` 0.3.0 — docs/ 폴더 + gd-plan-* 스킬 + README + 버전 bump

### 통합 시나리오

- [ ] **시나리오 1 (인터뷰)**: "동네 미용실 예약 사이트" 인터뷰
  - `/gd-plan-start` → ... → `/gd-plan-review`
  - 5 종 문서 생성, `_review.md` 에 BLOCK 0 건
- [ ] **시나리오 2 (주입 검증, Top Risk 검증)**: 위 시나리오 1 산출물 + `/gd-chat <landing>`
  - chat.md 의 narrative 톤이 design.md (e.g. cal.com) 와 일치
  - chat.md 의 Structure 트리가 structure.md 의 landing 섹션 구성과 일치
  - chat.md history 에 "structure.md 참조 / ui-rules.md 적용 / design.md 톤" 명시
- [ ] **시나리오 3 (review 차단)**: 의도적으로 PRD capability 하나를 structure.md 에서 누락
  - `/gd-plan-review` 가 BLOCK 발생, `--force-continue` 없이 `/gd-chat` 진입 차단

### 회귀 / 문서

- [ ] 기존 `@gen-design/skills` / `gd-cli` / `create-gd-react` 회귀 테스트 통과
- [ ] README + `docs/handbook.md` + `docs/vision.md` 갱신
- [ ] `docs/decisions/ADR-13-01-{A..E}.md` 5 개 ADR
- [ ] `walkthrough.md` + `pr_description.md`
