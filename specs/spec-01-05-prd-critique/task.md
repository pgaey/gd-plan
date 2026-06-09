# Task List: spec-01-05

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit; TDD 는 Red/Green 2 commit).
> 매 commit 직후 본 파일의 체크박스를 갱신해야 합니다.

## Pre-flight (Plan 작성 단계)

- [x] Spec ID 확정 및 디렉토리 생성
- [x] spec.md 작성 (+ /hk-spec-critique dogfood 13건 반영)
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [x] 백로그 업데이트 (phase-01.md SPEC 표 — sdd 자동)
- [x] 사용자 Plan Accept (+ dogfood critique 13건 반영)

---

## Task 1: 브랜치 생성 ✅

### 1-1. 브랜치
- [x] `git checkout -b spec-01-05-prd-critique` + 드래프트 커밋 `82bf73f`

---

## Task 2: prd 템플릿 — version frontmatter + 제약/규제 섹션 (FR5·FR8) ✅

### 2-1. 테스트 (Red)
- [x] `__tests__/templates-v2.test.ts` Red 3건 → Commit `609a154`

### 2-2. 구현 (Green)
- [x] `templates/prd.md` version:1 + `## 제약/규제` → 46/46 Pass → Commit `578629d`

---

## Task 3: gd-plan-prd — 제약/규제 질문 슬롯 + version bump (FR5·FR8) ✅

### 3-1. 테스트 (Red)
- [x] skills.test.ts Red 2건 → Commit `9343620`

### 3-2. 구현 (Green)
- [x] gd-plan-prd 16문항(Q10 제약)+version bump+critique 지목 → 48/48 → Commit `7e4ffce`

---

## Task 4: gd-plan-critique 스킬 신설 (FR1-4, §A-H) ✅

### 4-1. 테스트 (Red)
- [x] skills.test.ts: 9번째 등록 + 600줄 예외 + 구조 5검증 → Commit `248b179`

### 4-2. 구현 (Green)
- [x] `plans/gd-plan-critique.md`(96줄) + integration 9개 → 53/53 → Commit `2ee2a26`

---

## Task 5: 통합 표면 — design soft gate + start 상태 + review/start _critique 무시 (FR6·FR7) ✅

### 5-1. 테스트 (Red)
- [x] skills.test.ts Red 3건 → Commit `80e8014`

### 5-2. 구현 (Green)
- [x] design soft-gate + start 상태 + review _critique 무시 → 56/56 → Commit `f8e902d`

---

## Task 6: 가치 검증 fixture (§G, NFR3) ✅

### 6-1. 테스트 (Red)
- [x] fixture 형식 검증 Red 3건 → Commit `34c2bdf`

### 6-2. 구현 (Green)
- [x] golden-prd-dental.md + expected.json(4건) → 59/59 → Commit `3c383c1`
- 비고: recall 판정은 수동/주기 eval — CI 는 fixture 형식만.

---

## Task 7: README + 문서 동기화 ✅

### 7-1. 문서
- [x] README 에 /gd-plan-critique + 검증 2층 + stale 정정 → Commit `4812b63`

---
> 추가 커밋: 폴백 배너 강화(리뷰 반영) `ca466fd`

---

## Task N: Ship (필수)

> 모든 작업 task 완료 후 `/hk-ship` 절차.

### 🚦 Pre-Push Quality Gate
- [x] `pnpm test`(59 PASS) · `pnpm typecheck` · `pnpm build` · `build-index` GREEN
### 📝 산출물
- [x] walkthrough.md / pr_description.md 작성
- [x] 독립 코드리뷰(`/hk-code-review`) Major 2건 반영 `7dae97f`
- [ ] (머지 시) ADR 3종 작성 `docs/decisions/ADR-{NNN}-*.md`
- [ ] Ship Commit: `docs(spec-01-05): ship walkthrough and pr description`
### 🚀 Push & PR
- [ ] `git push -u origin spec-01-05-prd-critique`
- [ ] `/hk-pr-gh` (사용자 승인 후, base=phase-01) → PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 7 + Ship |
| **실제 commit 수** | 14 (TDD Red/Green + 리뷰반영 + ship) |
| **현재 단계** | Ship (push 대기) |
| **마지막 업데이트** | 2026-06-09 |
