# Task List: spec-01-03

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).

## Pre-flight (Plan 작성 단계)
- [x] Spec ID 확정 및 디렉토리 생성
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [x] 백로그 업데이트 (phase-01.md SPEC 표 sdd 자동 갱신)
- [ ] 사용자 Plan Accept

---

## Task 1: 인터뷰 스킬 5종에 "결정 기록" 규칙 삽입

### 1-1. 브랜치 생성
- [ ] `git checkout -b spec-01-03-decision-log-auto` (base: `phase-01-gd-plan-vertical-slice`)
- [ ] Commit: 없음

### 1-2. 테스트 작성 (TDD Red)
- [ ] `__tests__/skills.test.ts` 에 "인터뷰 스킬 5종은 결정 기록 규칙(`decisions.md`+`탈락`/`이유`)을 가진다" 검증 추가
- [ ] `pnpm test` → Fail 확인
- [ ] Commit: `test(spec-01-03): 결정 기록 규칙 검증 추가 (Red)`

### 1-3. 구현 (TDD Green)
- [ ] `plans/gd-plan-prd.md` — 결정 기록 섹션(전역)
- [ ] `plans/gd-plan-design.md` — 픽 기록(전역)
- [ ] `plans/gd-plan-sitemap.md` — 페이지 묶기 기록(전역)
- [ ] `plans/gd-plan-page.md` — 섹션/layout/modal 기록(페이지 로컬, 골격→행)
- [ ] `plans/gd-plan-rules.md` — 수치/인터랙션 기록(전역)
- [ ] `pnpm test` + `pnpm typecheck` → Pass
- [ ] Commit: `feat(spec-01-03): 인터뷰 fork→decisions.md 자동 기록 규칙 (Green)`

---

## Task 2: ADR-011 (결정 로그 자동 트리거)

### 2-1. ADR 작성
- [ ] `docs/decisions/ADR-011-decision-log-auto-trigger.md` (type: convention)
- [ ] `__tests__/templates-v2.test.ts` ADR 목록에 011 추가, `pnpm test` Pass
- [ ] Commit: `docs(spec-01-03): ADR-011 결정 로그 자동 트리거`

---

## Task 3: Ship (필수)

### 🚦 Pre-Push Quality Gate
- [ ] `pnpm typecheck` PASS
- [ ] `pnpm test` 전체 PASS
- [ ] (Integration Test Required = no → 생략)

### 📝 산출물 작성
- [ ] `walkthrough.md` 작성
- [ ] `pr_description.md` 작성
- [ ] Ship Commit: `docs(spec-01-03): ship walkthrough and pr description`

### 🚀 Push & PR
- [ ] Push: `git push -u origin spec-01-03-decision-log-auto`
- [ ] PR 생성: base = `phase-01-gd-plan-vertical-slice` (사용자 승인 후)
- [ ] 사용자 알림: PR URL 보고

---

## 진행 요약
| 항목 | 값 |
|---|---|
| **총 Task 수** | 3 (작업 2 + Ship) |
| **예상 commit 수** | 5 (test, feat, docs-ADR, docs-ship, 마킹) |
| **현재 단계** | Planning |
| **마지막 업데이트** | 2026-06-04 |
