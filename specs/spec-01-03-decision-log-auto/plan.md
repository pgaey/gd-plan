# Implementation Plan: spec-01-03

## 📋 Branch Strategy
- 신규 브랜치: `spec-01-03-decision-log-auto`
- 시작 지점: base `phase-01-gd-plan-vertical-slice`
- 첫 task 가 브랜치 생성

## 🛑 사용자 검토 필요 (User Review Required)

> [!IMPORTANT]
> - [ ] 결정 기록은 **자동(fork 선택) + 수동 보강** (grill 합의 3번). 자동은 *복수선택 fork* 에 한함 — 모든 답을 적지 않음(트랜스크립트 금지).
> - [ ] page 결정은 `pages/[PAGE]/decisions.md`, 그 외(prd·design·sitemap·rules)는 전역 `docs/decisions.md`.

## 🎯 핵심 전략 (Core Strategy)

### 주요 결정
| 컴포넌트 | 전략 | 이유 |
|:---:|:---|:---|
| **트리거** | 복수선택 fork 선택 순간 자동 1행 | 인터뷰에 이미 fork 구조 존재 → 비용≈0, 누락 없음 |
| **형식** | typed `결정\|선택지\|탈락\|이유` | 트랜스크립트 방지(ADR-008) |
| **위치** | page=페이지 로컬 / 그 외=전역 | 2층 분리(ADR-008) |
| **삽입 방식** | 각 스킬 본문에 "결정 기록" 섹션(자기완결) | 스킬은 개별 설치되는 markdown |

### 📑 ADR 후보
- [x] 있음 → `decision-log-auto-trigger` (type: convention) — fork 자동 + 수동 보강 트리거.

## 📂 Proposed Changes

### 인터뷰 스킬에 "결정 기록" 규칙 삽입
#### [MODIFY] `plans/gd-plan-prd.md`
"결정 기록" 섹션 추가 — Out-of-scope·톤·access fork 선택 시 `docs/decisions.md` 에 typed 1행.

#### [MODIFY] `plans/gd-plan-design.md`
픽 확정 시 `docs/decisions.md` 에 "design=X (탈락: Y 이유)" 기록.

#### [MODIFY] `plans/gd-plan-sitemap.md`
페이지 묶기 fork → `docs/decisions.md`.

#### [MODIFY] `plans/gd-plan-page.md`
섹션·layout·modal fork → `docs/pages/[PAGE-<slug>]/decisions.md` (골격 → 행 채움). spec-01-02 의 "decisions 골격만" 을 "fork 시 행 추가" 로 확장.

#### [MODIFY] `plans/gd-plan-rules.md`
수치·인터랙션 fork → `docs/decisions.md`.

#### [NEW] `docs/decisions/ADR-011-decision-log-auto-trigger.md`
type: convention. fork 자동 + 수동 보강 트리거 규칙.

#### [MODIFY] `__tests__/skills.test.ts`
인터뷰 스킬 5종이 "결정 기록" 규칙(`decisions.md` + `탈락`/`이유` 언급)을 포함하는지 검증. ADR-011 검증은 templates-v2.

## 🧪 검증 계획 (Verification Plan)
### 단위 테스트 (필수)
```bash
pnpm test
pnpm typecheck
```
### 수동 검증 시나리오
1. `pnpm test` → 5종 스킬 결정 기록 규칙 검증 PASS + 기존 회귀 PASS.

## 🔁 Rollback Plan
- 스킬 본문의 "결정 기록" 섹션 + ADR-011 제거로 원복. 출력 문서 영향 0.

## 📦 Deliverables 체크
- [ ] task.md 작성 (다음 단계)
- [ ] 사용자 Plan Accept 받음
- [ ] (실행 후) 모든 task 완료
- [ ] (실행 후) walkthrough.md / pr_description.md ship
