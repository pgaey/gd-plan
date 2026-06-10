# Implementation Plan: spec-01-01

## 📋 Branch Strategy

- 신규 브랜치: `spec-01-01-dir-model-templates` (브랜치 이름 = spec 디렉토리 이름, `feature/` prefix 없음)
- 시작 지점: **base 브랜치 `phase-1-gd-plan-vertical-slice`** (base 모드)
- 첫 task 가 브랜치 생성을 수행함

## 🛑 사용자 검토 필요 (User Review Required)

> [!IMPORTANT]
> - [ ] 신규 템플릿 4종(`sitemap`/`pages/structure`/`pages/decisions`/`decisions`)이 **세로 슬라이스 출력 스키마를 확정**한다 — spec-1-02~04 전부의 전제.
> - [ ] ADR-006 이 ADR-004 를 **확장(폐기 아님)** 으로 둔다 — 평면 `structure.md` 템플릿은 당분간 공존.

> [!WARNING]
> - [ ] 본 spec 은 *추가만* 한다. 기존 평면 `structure.md` 사용 흐름은 spec-1-02 마이그레이션 전까지 그대로 동작(backward compatible).

## 🎯 핵심 전략 (Core Strategy)

### 주요 결정

| 컴포넌트 | 전략 | 이유 |
|:---:|:---|:---|
| **단위** | 페이지 = `pages/[PAGE]/` dir (↔ spec dir) | "페이지 하나씩 추가" 비전 + 증분 단위 |
| **지도** | `sitemap.md` 마커 자동관리 로스터(평면) + `parent` frontmatter | phase.md 동형. 표 단순 유지, 계층은 frontmatter 합성 |
| **결정로그** | 전역 `decisions.md` + 페이지 `pages/[PAGE]/decisions.md` 2층 | ADR↔walkthrough 동형. 전역/페이지 결정 분리 |
| **ID 스파인** | frontmatter `page/covers/roles/flows/parent` | 기계가독 → set-diff(누수 B) 토대 |

### 📑 ADR 후보

- [x] ADR 가치 있는 결정 있음 → `dir-model-page-unit`(convention) · `sitemap-as-map`(convention) · `decision-log-two-tier`(convention)
- [ ] 없음

## 📂 Proposed Changes

### 신규 템플릿 (templates/)

#### [NEW] `templates/sitemap.md`
지도 로스터. `<!-- gd:pages:start/end -->` 마커 + 표(`Page|covers|roles|상태|flows`) + 목표 한 줄 + 커버리지 점검. 여정 mermaid는 `flows/_overview` 위임(중복 금지) 주석.

#### [NEW] `templates/pages/structure.md`
페이지 단위 와이어프레임. frontmatter(`page/covers/roles/flows/parent`) + sections(taxonomy 어휘) + layout + responsive + states. 기존 `templates/structure.md` 의 "Page 블록"을 페이지별 파일로 분리한 형태.

#### [NEW] `templates/pages/decisions.md`
페이지 결정 로그. typed 표(`결정|선택지|탈락|이유`) + "트랜스크립트 ❌, typed 결정 ✅" 규칙 주석.

#### [NEW] `templates/decisions.md`
전역 결정 로그. 동일 typed 표 형식. prd/design/rules 단계 결정 수용.

### 신규 ADR (docs/decisions/)

#### [NEW] `docs/decisions/ADR-006-vertical-slice-page-unit.md`
type: convention. 세로축 단위 = PAGE. ADR-004 확장(폐기 아님) 명시.

#### [NEW] `docs/decisions/ADR-007-sitemap-as-map.md`
type: convention. sitemap = phase.md 대응 지도(마커 자동관리·평면·parent 계층).

#### [NEW] `docs/decisions/ADR-008-decision-log-two-tier.md`
type: convention. 결정 로그 2층 + frontmatter ID 스파인.

### 테스트 (__tests__/)

#### [NEW] `__tests__/templates-v2.test.ts`
신규 템플릿 4종 존재 + 필수 마커/frontmatter 키(`page/covers/roles/flows/parent`, `gd:pages` 마커) 포함 + ADR-006~008 존재 & frontmatter `type` closure 준수.

## 🧪 검증 계획 (Verification Plan)

### 단위 테스트 (필수)
```bash
pnpm test
pnpm typecheck
```

### 수동 검증 시나리오
1. `pnpm test` → 신규 `templates-v2` PASS + 기존 `skills` 회귀 PASS — 기대: 전부 green.
2. 신규 템플릿 4종 + ADR 3종 파일 확인 — 기대: 존재 & 한국어 본문.

## 🔁 Rollback Plan

- 본 spec 은 *추가만* 하므로 신규 파일(템플릿 4 + ADR 3 + 테스트 1) 삭제로 완전 원복. 기존 파일·동작 영향 0.

## 📦 Deliverables 체크

- [ ] task.md 작성 (다음 단계)
- [ ] 사용자 Plan Accept 받음
- [ ] (실행 후) 모든 task 완료
- [ ] (실행 후) walkthrough.md / pr_description.md ship
