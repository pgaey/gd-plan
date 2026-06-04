# Task List: spec-01-03 (B+C 반영본)

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).
> 순서: 정본(ADR-011 → 템플릿) → 스킬 참조 → Ship.

## Pre-flight (Plan 작성 단계)
- [x] Spec ID 확정 및 디렉토리 생성
- [x] spec.md 작성 (B+C 반영)
- [x] plan.md 작성 (B+C 반영)
- [x] task.md 작성 (이 파일)
- [x] 백로그 업데이트 (phase-01.md SPEC 표 sdd 자동 갱신)
- [x] critique 수행 + B+C 반영 결정
- [x] 사용자 Plan Accept

---

## Task 1: 브랜치 생성 + ADR-011 정본 작성

### 1-1. 브랜치 생성
- [x] `git checkout -b spec-01-03-decision-log-auto` (base: `phase-01-gd-plan-vertical-slice`)
- [x] Commit: 없음

### 1-2. ADR-011 작성 (정본) + 테스트
- [x] `docs/decisions/ADR-011-decision-log-auto-trigger.md` (type: convention) — 6항: 트리거 / 6열 스키마+ID+연결 / supersede(append+inline status) / 동일키 멱등 / 이유 미입력 처리 / 정본 위치
- [x] `__tests__/templates-v2.test.ts` ADR 목록에 `ADR-011` 추가 → `pnpm test` Fail→Pass
- [x] Commit: `docs(spec-01-03): ADR-011 결정 로그 정본 (트리거+6열 스키마+supersede)`

---

## Task 2: 템플릿 2종 6열 스키마 + 규칙 블록 + 경로 통일

### 2-1. 테스트 작성 (TDD Red)
- [x] `__tests__/templates-v2.test.ts` 에 "decisions 템플릿 2종 표 헤더 = 6열(`ID`·`연결` 포함)" 검증 추가
- [x] `pnpm test` → Fail 확인

### 2-2. 구현 (TDD Green)
- [x] `templates/decisions.md` — 헤더 6열 + 규칙 블록(정본 요약+ADR-011 참조) + 경로 `pages/`→`docs/pages/` + 예시 행 6열
- [x] `templates/pages/decisions.md` — 헤더 6열 + 규칙 블록 + 예시 행 6열
- [x] `pnpm test` + `pnpm typecheck` → Pass
- [x] Commit: `feat(spec-01-03): decisions 템플릿 6열 스키마(ID·연결) + 규칙 정본 블록`

---

## Task 3: 인터뷰 스킬 5종 짧은 참조 삽입

### 3-1. 테스트 작성 (TDD Red)
- [x] `__tests__/skills.test.ts` 에 "스킬 5종은 결정 기록 참조(`decisions.md`+fork→1행 취지)를 가진다" + "page·prd 는 수동 보강 문구" 검증 추가
- [x] `pnpm test` → Fail 확인
- [x] Commit: `test(spec-01-03): 스킬 결정 기록 참조 검증 추가 (Red)`

### 3-2. 구현 (TDD Green)
- [x] `plans/gd-plan-prd.md` — 참조 1줄(전역) + 수동 보강
- [x] `plans/gd-plan-design.md` — 참조 1줄(전역)
- [x] `plans/gd-plan-sitemap.md` — 참조 1줄(전역)
- [x] `plans/gd-plan-page.md` — 참조(페이지 로컬, 골격→행) + 수동 보강
- [x] `plans/gd-plan-rules.md` — 참조 1줄(전역)
- [x] `pnpm test` + `pnpm typecheck` → Pass
- [x] Commit: `feat(spec-01-03): 인터뷰 스킬 5종 결정 기록 참조 삽입 (Green)`

---

## Task 4: Ship (필수)

### 🚦 Pre-Push Quality Gate
- [x] `pnpm typecheck` PASS
- [x] `pnpm test` 전체 PASS (32)
- [x] (Integration Test Required = no → 생략)

### 📝 산출물 작성
- [x] `walkthrough.md` 작성 (B+C 반영 결정·테스트 한계 기록)
- [x] `pr_description.md` 작성
- [x] Ship Commit: `docs(spec-01-03): ship walkthrough and pr description`

### 🚀 Push & PR
- [x] Push: `git push -u origin spec-01-03-decision-log-auto`
- [x] PR 생성: base = `phase-01-gd-plan-vertical-slice` → PR #3
- [x] 사용자 알림: PR URL 보고

---

## 진행 요약
| 항목 | 값 |
|---|---|
| **총 Task 수** | 4 (작업 3 + Ship) |
| **예상 commit 수** | 5 (docs-ADR, feat-템플릿, test-스킬, feat-스킬, docs-ship) |
| **현재 단계** | Planning (B+C 반영 완료, Plan Accept 대기) |
| **마지막 업데이트** | 2026-06-04 |
