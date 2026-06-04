# Implementation Plan: spec-01-03 (B+C 반영본)

## 📋 Branch Strategy
- 신규 브랜치: `spec-01-03-decision-log-auto`
- 시작 지점: base `phase-01-gd-plan-vertical-slice`
- 첫 task 가 브랜치 생성

## 🛑 사용자 검토 필요 (User Review Required)

> [!IMPORTANT]
> - [ ] 규칙 **정본 = ADR-011 + 템플릿 규칙 블록 1곳**. 스킬 5종은 짧은 참조 + 자기 fork 목록만(중복 금지).
> - [ ] typed 표 **6열**(`ID|결정|선택지|탈락|이유|연결`). supersede = append+inline status(불변), 삭제 금지.
> - [ ] 이유 미입력 → 1회 되묻기 → `<!-- TODO: 이유 -->`. 수동 보강은 page·prd 만.
> - [ ] page 결정 = `docs/pages/[PAGE]/decisions.md`, 그 외 = `docs/decisions.md`.

## 🎯 핵심 전략 (Core Strategy)

### 주요 결정
| 컴포넌트 | 전략 | 이유 |
|:---:|:---|:---|
| **트리거** | 복수선택 fork 선택 순간 자동 1행 | 인터뷰에 이미 fork 구조 존재 → 비용≈0 |
| **형식** | typed **6열** `ID\|결정\|선택지\|탈락\|이유\|연결` | set-diff 파싱 키 확보(ADR-008 ID 스파인) |
| **정본 위치** | ADR-011 + `decisions.md` 템플릿 규칙 블록 (B) | DRY — 한 곳 수정, 5곳 drift 제거 |
| **스킬 삽입** | 짧은 참조 1줄 + fork 목록만 | gd-plan 은 항상 패키지 템플릿 로드 → 참조 가능 |
| **supersede** | 새 행 append + 옛 행 ID `~~D-01~~`→연결 `→D-05` | ADR 불변(append+status), 이력 보존 |
| **위치** | page=페이지 로컬 / 그 외=전역 | 2층 분리(ADR-008) |

### 📑 ADR 후보
- [x] 있음 → `ADR-011 decision-log-auto-trigger` (type: convention) — 결정 로그 정본(트리거+6열 스키마+supersede+멱등+이유처리+정본위치).

## 📂 Proposed Changes

> 순서: **정본 먼저(ADR-011 → 템플릿) → 스킬 참조**. 정본이 없으면 스킬이 참조할 대상이 없다.

### [NEW] `docs/decisions/ADR-011-decision-log-auto-trigger.md`
type: convention. 정본 규칙 6항: 트리거 / 6열 스키마+ID+연결 / supersede(append+inline status) / 동일키 멱등 / 이유 미입력 처리 / 정본 위치. ADR-008 형식 확장임을 명시.

### [MODIFY] `templates/decisions.md` (전역)
- 표 헤더 4열 → **6열** `| ID | 결정 | 선택지 | 탈락 | 이유 | 연결 |`.
- 규칙 블록(정본 요약): 트리거·멱등키·supersede·이유처리 4줄 + `→ 상세 ADR-011`.
- 경로 수정: `pages/[PAGE]/decisions.md` → `docs/pages/[PAGE]/decisions.md`.
- 예시 행 2개 6열로 갱신(연결에 `[CAP-07]` 등).

### [MODIFY] `templates/pages/decisions.md` (페이지)
- 동일 6열 헤더 + 규칙 블록(참조) + 예시 행 6열 갱신(연결에 섹션/`[PAGE-..]`).

### [MODIFY] 인터뷰 스킬 5종 — 짧은 참조 삽입 (규칙 본문 없음)
각 스킬에 1~2줄: "fork(복수선택) 선택 시 `<위치>/decisions.md` 에 typed 1행 append — 규칙은 decisions.md 헤더/ADR-011 정본 참조." + 자기 fork 목록.
- `plans/gd-plan-prd.md` → `docs/decisions.md` (Out-of-scope·톤·access) **+ 수동 보강 한 줄**
- `plans/gd-plan-design.md` → `docs/decisions.md` (픽+탈락)
- `plans/gd-plan-sitemap.md` → `docs/decisions.md` (페이지 묶기)
- `plans/gd-plan-page.md` → `docs/pages/[PAGE-<slug>]/decisions.md` (섹션/layout/modal, 골격→행) **+ 수동 보강 한 줄**
- `plans/gd-plan-rules.md` → `docs/decisions.md` (수치/인터랙션)

### [MODIFY] `__tests__/skills.test.ts`
인터뷰 스킬 5종이 결정 기록 **참조**(`decisions.md` 언급 + fork→1행 취지)를 포함하는지 검증. page·prd 는 수동 보강 문구 포함.

### [MODIFY] `__tests__/templates-v2.test.ts`
- 템플릿 2종 표 헤더가 **6열(`ID`·`연결` 포함)** 인지 검증.
- ADR 목록에 `ADR-011` 추가.
- (가능하면) 정본 규칙 블록 ID 패턴 `D-\d{2}` 언급 검증. 어려우면 pass 처리하고 spec-1-04 이월(테스트 한계 — DoD).

## 🧪 검증 계획 (Verification Plan)
### 단위 테스트 (필수)
```bash
pnpm test
pnpm typecheck
```
### 테스트 신뢰 한계 (명시 — spec DoD 와 동일)
- 검증 범위 = 스킬 참조 문자열 존재 + 템플릿 6열 헤더 + ADR-011 등록.
- **실제 1행 생성은 검증 불가**(markdown 지시문) → spec-1-04 set-diff 소관.

### 수동 검증 시나리오
1. `pnpm test` → 스킬 5종 참조 + 템플릿 6열 + ADR-011 PASS + 기존 회귀 PASS.

## 🔁 Rollback Plan
- ADR-011 제거 + 템플릿 헤더 4열 환원 + 스킬 참조 줄 제거로 원복. 출력 문서 영향 0.

## 📦 Deliverables 체크
- [ ] task.md 작성 (다음 단계 — B+C 반영본)
- [ ] 사용자 Plan Accept 받음
- [ ] (실행 후) 모든 task 완료
- [ ] (실행 후) walkthrough.md / pr_description.md ship
