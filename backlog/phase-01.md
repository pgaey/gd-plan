# phase-1: gd-plan-vertical-slice

> 본 phase 의 모든 SPEC 을 한 파일에 요점/방향성으로 나열합니다.
> *구체적* 작업 내용은 `specs/spec-1-{seq}-{slug}/spec.md` 에서 다룹니다.
>
> 본 문서는 "이번 phase 에서 무엇을 어디까지 할 것인가" 를 한 번에 보기 위한 *업무 지도* 입니다.

## 📋 메타

| 항목 | 값 |
|---|---|
| **Phase ID** | `phase-1` |
| **상태** | Planning |
| **시작일** | 2026-06-03 |
| **목표 종료일** | TBD |
| **소유자** | evan |
| **Base Branch** | `phase-1-gd-plan-vertical-slice` (base 모드) |

## 🎯 배경 및 목표

### 현재 상황

gd-plan 은 *기획 산출* 통제 레이어인데, harness-kit 가 *개발 프로세스*를 4층(typed doc·템플릿·명령어·강제 hook)으로 통제하는 것에 비해 현재 **1.5층**뿐이다. 가로축(생애: start→prd→…→review)만 있고, **세로축(계층)·기록축(결정 로그)·강제축(hook)** 이 비어 있다.

그 결과 (1) 큰 프로젝트(거시)를 평면 5문서로밖에 못 담고, (2) 인터뷰/픽의 *결정 이유*가 휘발되어 "프로젝트 목적 표류"를 감지할 원본이 없으며, (3) `role→capability→page→flow` 연결이 프리텍스트라 기계 검증(set-diff)의 토대가 없다.

### 목표 (Goal)

gd-plan 출력 모델을 **평면 5문서 → 지도(`sitemap.md`) + 페이지별 디렉토리(`pages/[PAGE]/`) + 2층 결정 로그**로 재편한다. harness-kit 의 `phase.md`(지도) + `specs/spec-id/`(단위 dir) 모델을 기획 산출에 이식하고, ID 스파인(`role·[CAP]→[PAGE]→[FLOW]`)을 frontmatter 기계가독으로 만들어 향후 강제 hook(set-diff)의 토대를 깐다.

### 성공 기준 (Success Criteria) — 정량 우선

1. 미용실 예약 시나리오로 전체 파이프라인 실행 시 `docs/sitemap.md` + `docs/pages/[PAGE-*]/{structure,decisions}.md` 가 생성되고 `/gd-plan-review` BLOCK 0 건.
2. 페이지 추가 1회 = 명령 1회(`/gd-plan-page <slug>`)로 해당 page dir 전체 + sitemap 로스터 1행 갱신 (멱등).
3. 결정 로그 2층(`docs/decisions.md` 전역 + `pages/[slug]/decisions.md` 페이지)에 인터뷰 fork 선택·Out-of-scope·design 픽이 자동 기록.
4. 페이지 frontmatter(`covers/roles/flows/parent`)와 flow step `@[PAGE-id]` 가 1:1 일치 (flows 역참조 자동 도출, 손편집 0).
5. 기존 `__tests__` 회귀 PASS + 신규 스킬/템플릿 설치 검증 통과.

## 🧩 작업 단위 (SPEC + phase-FF)

> 실질적/불확실 → **SPEC**(아래 표), 작고 가역적인 1–2 commit → **phase-FF**(맨 아래).
> sdd 가 `<!-- sdd:specs:start --> ~ <!-- sdd:specs:end -->` 사이를 자동 갱신하므로 마커는 그대로 두세요.

<!-- sdd:specs:start -->
| ID | 슬러그 | 우선순위 | 상태 | 디렉토리 |
|---|---|:---:|---|---|
| `spec-01-01` | dir-model-templates | P? | Merged | `specs/spec-01-01-dir-model-templates/` |
| `spec-01-02` | vertical-slice-commands | P? | Merged | `specs/spec-01-02-vertical-slice-commands/` |
| `spec-01-03` | decision-log-auto | P? | Active | `specs/spec-01-03-decision-log-auto/` |
<!-- sdd:specs:end -->

> 상태 허용값: `Backlog` / `In Progress` / `Merged`

### spec-1-01 — 디렉토리 모델 + 템플릿 + ADR (토대)

- **요점**: 새 출력 스키마 정의 — `sitemap.md`(마커 자동관리 로스터) + `pages/[PAGE-slug]/{structure,decisions}.md`(+frontmatter) + 전역 `docs/decisions.md` + 페이지 rule 델타. 스킬 행동은 아직 안 건드림(스키마+ADR만).
- **방향성**: 템플릿부터 SoT 로. ADR-004(섹션스택 평면)를 *확장*(충돌 아님)으로 명문화. ID 스파인 frontmatter 규약 확정.
- **참조**: 메모리 `gd-plan-vertical-slice-rearchitecture.md`, `docs/decisions/ADR-004-structure-as-section-stack.md`
- **연관 모듈**: `templates/`, `docs/decisions/`
- **ADR**: 세로축 단위=PAGE / sitemap=phase.md 대응 / 결정로그 2층 (아래 의존성 참조)

### spec-1-02 — sitemap·page 세로 슬라이스 명령어

- **요점**: 신규 `/gd-plan-sitemap`(prd CAP→페이지 로스터 인터뷰, 마커 자동갱신) + `/gd-plan-page <slug>`(한 페이지 dir 전체: structure+decisions+flow접점+rule델타). 기존 `/gd-plan-structure` 는 sitemap 분리 후 page 흐름으로 재편.
- **방향성**: 세로 슬라이스 = "페이지 하나씩". 현행 `structure §3-1`(sitemap 단계) 재사용. `cli.ts installPlans` 가 신규 스킬 설치하도록 갱신(+테스트).
- **참조**: `plans/gd-plan-structure.md`, spec-1-01 템플릿
- **연관 모듈**: `plans/`, `src/cli.ts`, `__tests__/`

### spec-1-03 — 결정 로그 2층 + 자동 fork 트리거

- **요점**: decisions.md 2층을 인터뷰에 연결 — 복수선택 fork 선택 순간 + Out-of-scope + design 픽 = 자동 1행, 수동 보강 허용(3번 합의).
- **방향성**: prd/design/page/rules 스킬에 "fork 결정 → decisions 기록" 훅 삽입. 트랜스크립트 ❌ / typed 결정+탈락지+이유 ✅.
- **참조**: spec-1-01 (decisions 템플릿), `plans/gd-plan-prd.md`
- **연관 모듈**: `plans/`, `templates/`

### spec-1-04 — flows 자동 역참조 + frontmatter ID + review 갱신

- **요점**: flows top-level 정본 유지 + 페이지 `flows:` 를 flow step `@[PAGE-id]` 에서 자동 도출(drift 0). `/gd-plan-review` 가 frontmatter ID 체인을 읽도록 갱신(set-diff 준비).
- **방향성**: 단일 원천(flow steps) → 페이지 역참조 생성. review 가 `covers/roles/flows/parent` 기계가독을 따라가게.
- **참조**: `plans/gd-plan-flows.md`, `plans/gd-plan-review.md`, 누수 B(전파) 분류
- **연관 모듈**: `plans/`

### phase-FF 예정 항목 (spec 미생성)

> 작고 가역적인 1–2 commit. spec 산출물 없이 phase base 브랜치에 직접 커밋(phase-FF, → ADR-004).

| 항목 | 요점 | 예상 commit |
|---|---|:---:|
| spec-13-01 기록 정리 | `spec/`→`specs/spec-13-01-gd-plan-package/` git mv + `README.md:30` 경로 갱신 (이미 staged) | 1 |

## 📌 결정 기록 (Review)

| 이슈 | 선택지 | 결정 | 이유 |
|---|---|---|---|
| 세로/가로 슬라이스 | 세로(page) / 가로(관심사) | 세로 `/gd-plan-page` | "페이지 하나씩 추가" 비전 + dir 모델과 동형 (= sdd spec new) |
| flows 위치 | top-level 정본 / 페이지 분해 / 하이브리드 | top-level + 자동 역참조 | end-to-end 가독성 유지, 분해는 나중에 값싸게 |
| 결정 로그 트리거 | 자동 fork / 수동 / 둘다 | 둘다(3) | fork는 기계적 누락0, 비용≈0 + 중요 일회성만 수동 |
| sitemap 형태 | 평면 로스터 / 계층 nav 트리 | 평면 + `parent:` frontmatter | 표 단순 유지, 트리는 필요 시 frontmatter 합성 |

## 🧪 통합 테스트 시나리오 (간결)

### 시나리오 1: 미용실 예약 — 세로 슬라이스 파이프라인
- **Given**: 빈 `docs/` + prd(capabilities/roles) 작성됨
- **When**: `/gd-plan-sitemap` → `/gd-plan-page home` → `/gd-plan-page booking` → `/gd-plan-flows`
- **Then**: `docs/sitemap.md` 로스터 + `docs/pages/[PAGE-home|booking]/{structure,decisions}.md` 생성, 페이지 `flows:` frontmatter 자동 채워짐
- **연관 SPEC**: spec-1-01, spec-1-02, spec-1-04

### 시나리오 2: 결정 로그 2층 자동 기록
- **Given**: design 픽 인터뷰에서 cal.md 선택(linear 탈락), CAP-07 Out-of-scope
- **When**: 인터뷰 진행
- **Then**: `docs/decisions.md` 에 전역 결정 2행, `pages/booking/decisions.md` 에 페이지 결정 기록 (typed: 결정+탈락지+이유)
- **연관 SPEC**: spec-1-03

### 시나리오 3: review ID 체인 BLOCK 0
- **Given**: 시나리오 1 산출물
- **When**: `/gd-plan-review`
- **Then**: frontmatter `covers/flows` 체인으로 `role→CAP→PAGE→FLOW` 연결 확인, BLOCK 0 / WARN 보고
- **연관 SPEC**: spec-1-04

### 통합 테스트 실행
```bash
pnpm test
```

## 🔗 의존성

- **선행 phase**: 없음
- **외부 시스템**: 없음 (standalone, markdown + TS 설치기)
- **연관 ADR**:
  - `docs/decisions/ADR-004-structure-as-section-stack.md` (확장 대상)
  - `docs/decisions/ADR-001-layered-ssot.md` (전역/페이지 SSOT 경계)

## 📝 위험 요소 및 완화

| 위험 | 영향 | 완화책 |
|---|---|---|
| 기존 평면 `structure.md` 사용 프로젝트 마이그레이션 | 하위호환 깨짐 | spec-1-02 에 마이그레이션 경로/안내 포함, gd-plan-start 가 구·신 구조 모두 인식 |
| ADR-004(평면 섹션스택)와의 충돌 인상 | 설계 혼란 | spec-1-01 ADR 에서 "확장이지 폐기 아님" 명문화 |
| 명령어 분리로 기존 흐름 변화 | 사용자 혼동 | start 대시보드가 새 흐름 안내, 명령 출력에 "다음 단계" 유지 |

## 🏁 Phase Done 조건

- [ ] 모든 SPEC 이 merge (base 모드: `phase-1-gd-plan-vertical-slice` → main)
- [ ] 통합 테스트 3 시나리오 PASS
- [ ] 성공 기준 1~5 정량 측정 결과 기록
- [ ] 사용자 최종 승인

## 📊 검증 결과 (phase 완료 시 작성)

<!-- 통합 테스트 로그, 성공 기준 측정값, 회귀 점검 결과 등을 여기 첨부 -->
