# Task List: spec-02-01

> 모든 task 는 한 commit 에 대응합니다 (One Task = One Commit).
> 매 commit 직후 본 파일의 체크박스를 갱신해야 합니다.

## Pre-flight (Plan 작성 단계)

- [x] Spec ID 확정 및 디렉토리 생성
- [x] spec.md 작성
- [x] plan.md 작성
- [x] task.md 작성 (이 파일)
- [x] 백로그 업데이트 (phase-02.md SPEC 표 — sdd 자동 갱신)
- [x] 사용자 Plan Accept

---

## Task 1: 브랜치 생성 + planning 산출물 커밋

### 1-1. 브랜치 생성
- [x] `git checkout -b spec-02-01-dist-artifacts-index`
- [x] Commit: 없음 (브랜치 생성만)

### 1-2. planning 산출물 커밋
- [x] `backlog/phase-02.md`(활성화·결정기록), `backlog/queue.md`, `specs/spec-02-01-dist-artifacts-index/{spec,plan,task,critique}.md` 스테이징
- [x] Commit: `docs(spec-02-01): phase-02 활성화 및 spec/plan/task 작성`

---

## Task 2: 소비자 모드 규약 테스트 (TDD Red)

### 2-1. 테스트 작성
- [x] `__tests__/design-consumer-mode.test.ts` 작성 — 소비자 경로(`.gd/design-md-collection/`)·dev 경로 유지·사문 명령 교정·확장자 중복 부재·네트워크 지시 부재 (plan.md 테스트 목록 5건)
- [x] `pnpm test` 실행 → 신규 3건 Fail 확인 (기존 64건 PASS 유지)
- [x] Commit: `test(spec-02-01): add failing tests for design 스킬 소비자 모드 규약`

---

## Task 3: gd-plan-design.md 소비자 모드 구현 (TDD Green)

### 3-1. 스킬 갱신
- [x] `plans/gd-plan-design.md` §1·§2 갱신 — 2모드 경로 판별 + 모드별 인덱스 없음 안내 + 버그 2건 교정 (plan.md Proposed Changes 참조)
- [x] `pnpm test` 실행 → 전체 67/67 PASS 확인 (길이 cap 400 포함)
- [x] Commit: `feat(spec-02-01): design 스킬 dev/소비자 2모드 + 전체 동봉 규약`

---

## Task 4: ADR-016 배포 모델 작성

### 4-1. ADR 작성
- [x] `.harness-kit/agent/templates/adr.md` 템플릿 확인 후 `docs/decisions/ADR-016-self-contained-distribution.md` 작성 (`type: decision`)
- [x] Commit: `docs(spec-02-01): adr-016 self-contained 배포 모델`

---

## Task 5: Ship (필수)

> 모든 작업 task 완료 후 `/hk-ship` 절차를 따릅니다.

### 🚦 Pre-Push Quality Gate (push 전 필수)

- [ ] **코드 품질 점검**: `pnpm typecheck` → PASS
- [ ] **전체 테스트 실행**: `pnpm test` → 모두 PASS

### 📝 산출물 작성

- [ ] **walkthrough.md 작성** (증거 로그)
- [ ] **pr_description.md 작성** (템플릿 준수)
- [ ] **Ship Commit**: `docs(spec-02-01): ship walkthrough and pr description`

### 🚀 Push & PR

- [ ] **Push**: `git push -u origin spec-02-01-dist-artifacts-index`
- [ ] **PR 생성**: base = `phase-02-distribution` (just-in-time 생성), `/hk-pr-gh` 절차
- [ ] **사용자 알림**: 푸시 완료 + PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 5 |
| **예상 commit 수** | 5 |
| **현재 단계** | Planning |
| **마지막 업데이트** | 2026-06-10 |
