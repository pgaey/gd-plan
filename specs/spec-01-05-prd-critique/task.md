# Task List: spec-01-05

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit; TDD 는 Red/Green 2 commit).
> 매 commit 직후 본 파일의 체크박스를 갱신해야 합니다.

## Pre-flight (Plan 작성 단계)

- [x] Spec ID 확정 및 디렉토리 생성
- [x] spec.md 작성 (+ /hk-spec-critique dogfood 13건 반영)
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [x] 백로그 업데이트 (phase-01.md SPEC 표 — sdd 자동)
- [ ] 사용자 Plan Accept

---

## Task 1: 브랜치 생성

### 1-1. 브랜치
- [ ] `git checkout -b spec-01-05-prd-critique`
- [ ] Commit: 없음 (브랜치 생성만)

---

## Task 2: prd 템플릿 — version frontmatter + 제약/규제 섹션 (FR5·FR8)

### 2-1. 테스트 (Red)
- [ ] `__tests__/templates-v2.test.ts` 에 `templates/prd.md` frontmatter `version` + `## 제약/규제` 섹션 존재 검증 추가 → Fail
- [ ] Commit: `test(spec-01-05): add failing tests for prd version + 제약/규제 섹션 (Red)`

### 2-2. 구현 (Green)
- [ ] `templates/prd.md` 수정 (version: 1, `## 제약/규제` — 리스크와 구분)
- [ ] `pnpm test` → Pass
- [ ] Commit: `feat(spec-01-05): prd 템플릿 version + 제약/규제 섹션 (Green)`

---

## Task 3: gd-plan-prd — 제약/규제 질문 슬롯 + version bump (FR5·FR8)

### 3-1. 테스트 (Red)
- [ ] `__tests__/skills.test.ts` 에 gd-plan-prd 의 제약/규제 질문 + 종료 시 version bump 명시 검증 → Fail
- [ ] Commit: `test(spec-01-05): add failing tests for prd 제약 질문·version bump (Red)`

### 3-2. 구현 (Green)
- [ ] `plans/gd-plan-prd.md` 수정 (제약 질문 = 기능 정의 전, 종료 체크리스트에 version bump)
- [ ] `pnpm test` → Pass
- [ ] Commit: `feat(spec-01-05): gd-plan-prd 제약/규제 슬롯 + version bump (Green)`

---

## Task 4: gd-plan-critique 스킬 신설 (FR1-4, §A-H)

### 4-1. 테스트 (Red)
- [ ] `__tests__/skills.test.ts` 에 신규 스킬 구조 검증: frontmatter, 독립 서브에이전트(Opus)+폴백(§F), 3렌즈+tie-break(§C), severity 루브릭+`_critique.md` 스키마(§B), 입력범위(§A), 보고서-only(직접 prd 수정 X) → Fail
- [ ] Commit: `test(spec-01-05): add failing tests for gd-plan-critique 스킬 (Red)`

### 4-2. 구현 (Green)
- [ ] `plans/gd-plan-critique.md` 신설 (spec §A-H 전부 반영)
- [ ] `pnpm test` → Pass
- [ ] Commit: `feat(spec-01-05): gd-plan-critique 스킬 — PRD 전제 적대 검증 (Green)`

---

## Task 5: 통합 표면 — design soft gate + start 상태 + review/start _critique 무시 (FR6·FR7)

### 5-1. 테스트 (Red)
- [ ] `__tests__/skills.test.ts` 에 gd-plan-design 진입 경고(version 비교), gd-plan-start critique 상태 표시, review/start 의 `_critique` 무시 검증 → Fail
- [ ] Commit: `test(spec-01-05): add failing tests for 통합 표면 (Red)`

### 5-2. 구현 (Green)
- [ ] `plans/gd-plan-design.md`·`gd-plan-start.md`·`gd-plan-review.md` 수정
- [ ] `pnpm test` → Pass (기존 회귀 포함)
- [ ] Commit: `feat(spec-01-05): design soft-gate + start 상태 + _critique 무시 (Green)`

---

## Task 6: 가치 검증 fixture (§G, NFR3)

### 6-1. 테스트 (Red)
- [ ] golden PRD fixture(결함 박힘) + 기대 must-catch 목록 형식 검증 테스트 추가 → Fail
- [ ] Commit: `test(spec-01-05): add failing test for golden PRD fixture 형식 (Red)`

### 6-2. 구현 (Green)
- [ ] `__tests__/fixtures/golden-prd-dental.md` + 기대 발견 목록(주석/JSON) 추가
- [ ] `pnpm test` → Pass
- [ ] Commit: `feat(spec-01-05): 가치-recall golden fixture + 기대 발견 (Green)`
- 비고: recall 판정(critique 가 실제로 잡는가)은 수동/주기 eval — CI 자동 assert 아님.

---

## Task 7: README + 문서 동기화

### 7-1. 문서
- [ ] `README.md` 명령어 목록·흐름도에 `/gd-plan-critique` 추가
- [ ] Commit: `docs(spec-01-05): README 에 gd-plan-critique 반영`

---

## Task N: Ship (필수)

> 모든 작업 task 완료 후 `/hk-ship` 절차.

### 🚦 Pre-Push Quality Gate
- [ ] `pnpm test` → 전건 PASS · `pnpm typecheck` · `pnpm build` GREEN
### 📝 산출물
- [ ] walkthrough.md / pr_description.md 작성
- [ ] (선택) ADR 3종 작성 `docs/decisions/ADR-{NNN}-*.md`
- [ ] Ship Commit: `docs(spec-01-05): ship walkthrough and pr description`
### 🚀 Push & PR
- [ ] `git push -u origin spec-01-05-prd-critique`
- [ ] `/hk-pr-gh` (사용자 승인 후) → PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 7 + Ship |
| **예상 commit 수** | ~13 (TDD Red/Green 쌍 + 문서) |
| **현재 단계** | Planning (Plan Accept 대기) |
| **마지막 업데이트** | 2026-06-09 |
