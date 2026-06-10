# Task List: spec-02-02

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
- [x] `git checkout -b spec-02-02-get-sh-bootstrap` (base: `phase-02-distribution`)
- [x] Commit: 없음 (브랜치 생성만)

### 1-2. planning 산출물 커밋
- [x] `backlog/phase-02.md`(spec 표), `backlog/queue.md`, `specs/spec-02-02-get-sh-bootstrap/{spec,plan,task}.md` 스테이징
- [x] Commit: `docs(spec-02-02): spec/plan/task 작성`

---

## Task 2: 셸 테스트 하네스 + 실패 테스트 (TDD Red)

### 2-1. 테스트 작성
- [x] `test/sh/run.sh` (러너) + `test/sh/test-get.sh` (시나리오 4건: fresh·docs 미접촉·멱등·node 비의존)
- [x] `bash test/sh/run.sh` 실행 → Fail 확인 (get.sh 미존재, exit=1)
- [x] Commit: `test(spec-02-02): add failing shell tests for get.sh 설치 시나리오`

---

## Task 3: get.sh + install.sh 구현 (TDD Green)

### 3-1. 구현
- [x] `get.sh` (tar.gz fetch + --src 로컬 모드 + install.sh 위임), `install.sh` (footprint 복사 + VERSION·manifest + docs 미접촉 + 멱등)
- [x] `bash test/sh/run.sh` → 4 시나리오 PASS / `pnpm test` 67/67 회귀 PASS
- [x] Commit: `feat(spec-02-02): get.sh 부트스트랩 + install.sh 설치기`

---

## Task 4: test:sh 스크립트 등록

### 4-1. package.json
- [ ] `"test:sh": "bash test/sh/run.sh"` 추가, `pnpm test:sh` 동작 확인
- [ ] Commit: `chore(spec-02-02): test:sh 스크립트 등록`

---

## Task 5: Ship (필수)

> 모든 작업 task 완료 후 `/hk-ship` 절차를 따릅니다.

### 🚦 Pre-Push Quality Gate (push 전 필수)

- [ ] **코드 품질 점검**: `pnpm typecheck` → PASS
- [ ] **전체 테스트 실행**: `pnpm test` + `pnpm test:sh` → 모두 PASS

### 📝 산출물 작성

- [ ] **walkthrough.md 작성** (증거 로그)
- [ ] **pr_description.md 작성** (템플릿 준수)
- [ ] **Ship Commit**: `docs(spec-02-02): ship walkthrough and pr description`

### 🚀 Push & PR

- [ ] **Push**: `git push -u origin spec-02-02-get-sh-bootstrap`
- [ ] **PR 생성**: base = `phase-02-distribution`
- [ ] **사용자 알림**: 푸시 완료 + PR URL 보고

---

## 진행 요약

| 항목 | 값 |
|---|---|
| **총 Task 수** | 5 |
| **예상 commit 수** | 5 |
| **현재 단계** | Planning |
| **마지막 업데이트** | 2026-06-10 |
