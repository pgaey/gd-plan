# Implementation Plan: spec-01-02

## 📋 Branch Strategy
- 신규 브랜치: `spec-01-02-vertical-slice-commands`
- 시작 지점: base 브랜치 `phase-01-gd-plan-vertical-slice`
- 첫 task 가 브랜치 생성

## 🛑 사용자 검토 필요 (User Review Required)

> [!IMPORTANT]
> - [ ] `/gd-plan-structure`(평면)를 **완전 제거**하고 `/gd-plan-sitemap` + `/gd-plan-page` 쌍으로 대체한다 (orchestrator 로 남기지 않음). gd-plan 미출시·`docs/` 비어 있어 마이그레이션 부담 0.
> - [ ] `/gd-plan-page` 는 이번 spec 에서 `structure.md`(완성) + `decisions.md`(**골격만**) 를 만든다. 결정 *자동 기록*은 spec-1-03, 페이지 `flows:` 자동 채움은 spec-1-04 — 즉 1-02 직후 페이지는 structure 완성 / decisions·flows 는 후속에서 채워짐.

> [!WARNING]
> - [ ] structure 제거로 `flows`/`rules`/`review` 스킬의 `structure.md` 참조가 일시적으로 깨진다 — phase 통합 전(spec-1-04)까지의 **interim 상태**. phase Done 시나리오에서 전체 파이프라인 검증.

## 🎯 핵심 전략 (Core Strategy)

### 주요 결정

| 컴포넌트 | 전략 | 이유 |
|:---:|:---|:---|
| **sitemap 스킬** | prd CAP → 로스터 인터뷰, 마커 채움 | 골격 먼저(phase.md 동형, ADR-007) |
| **page 스킬** | 슬러그 1개 → dir 전체(structure+decisions), sitemap 상태 갱신 | 세로 슬라이스(ADR-006) |
| **structure 스킬** | 제거 | sitemap+page 가 대체, 미출시라 부담 0 |
| **start 스킬** | sitemap + pages/ 상태 집계 | 새 구조 진행률 |

### 📑 ADR 후보
- [x] 있음 (critique 발견) — `slug-page-id-normalization`(type: convention) · `sitemap-pages-single-source`(type: invariant). ADR-006/007 이 답하지 않은 운영 결정이 본 구현에서 처음 굳음.

## 📂 Proposed Changes

### 신규 스킬
#### [NEW] `plans/gd-plan-sitemap.md`
prd `capabilities`/`roles` 로딩 → "어느 CAP 을 어느 page 가 담당?" 인터뷰 → `docs/sitemap.md`(`templates/sitemap.md` 기반, `<!-- gd:pages -->` 로스터 채움) + 커버리지 점검. 멱등. 종료 시 "다음 단계: /gd-plan-page <첫 페이지>" + 진행률.

#### [NEW] `plans/gd-plan-page.md`
인자 `<slug>`(소문자 kebab 정규화). 차단: 인자 누락 / sitemap 부재 / 로스터에 없는 slug. `docs/pages/[PAGE-<slug>]/structure.md`(frontmatter `page/covers/roles/flows(빈)/parent` + 섹션스택/layout/states) + `decisions.md`(헤더+규칙만, 행0) 생성. frontmatter `covers`=진실, sitemap 로스터=파생. `sitemap.md` 상태 todo→draft/done 갱신. 멱등(편집 보존, 누락만 보강).

#### [MODIFY] `plans/gd-plan-flows.md`
하드 차단 안내 1줄만 갱신: "먼저 `/gd-plan-structure`" → "먼저 `/gd-plan-sitemap`"(죽은 명령 가리킴 방지). 경로·역참조 로직 전체는 spec-1-04.

#### [NEW] `docs/decisions/ADR-009-slug-page-id-normalization.md`
type: convention. slug↔PAGE-id 정규화(소문자 kebab, 중복 재호출=기존 페이지).

#### [NEW] `docs/decisions/ADR-010-sitemap-pages-single-source.md`
type: invariant. page frontmatter=진실 / sitemap 로스터=파생. drift 정책 근거.

### 기존 변경
#### [DELETE] `plans/gd-plan-structure.md`
평면 structure 제거 — sitemap+page 로 대체.

#### [MODIFY] `plans/gd-plan-start.md`
대시보드: `docs/sitemap.md` 존재 + `docs/pages/[PAGE-*]/` 페이지별 상태 집계로 진행률 표시. 다음 단계 안내를 sitemap→page 흐름으로.

#### [MODIFY] `src/cli.ts`
`installPlans` 스킬 목록: `gd-plan-structure` 제거 + `gd-plan-sitemap`·`gd-plan-page` 추가.

#### [MODIFY] `__tests__/skills.test.ts`
`EXPECTED_SKILLS`: structure 제거 + sitemap·page 추가(8개). 신규 스킬 frontmatter/`전체 진행률`/`다음 단계` 검증. 길이 cap 예외 목록에 `gd-plan-page` 추가(필요 시).

## 🧪 검증 계획 (Verification Plan)

### 단위 테스트 (필수)
```bash
pnpm test
pnpm typecheck
```

### 수동 검증 시나리오
1. `node dist/cli.js` 설치 → `.claude/commands/` 에 sitemap·page 설치, structure 미설치 — 기대: 8개 스킬.
2. `pnpm test` → skills(갱신) + templates-v2(불변) PASS.

## 🔁 Rollback Plan
- 신규 스킬 2개 삭제 + `git checkout` 으로 structure 복원 + cli/test 되돌림. 출력 문서(`docs/`)는 안 건드리므로 영향 0.

## 📦 Deliverables 체크
- [ ] task.md 작성 (다음 단계)
- [ ] 사용자 Plan Accept 받음
- [ ] (실행 후) 모든 task 완료
- [ ] (실행 후) walkthrough.md / pr_description.md ship
